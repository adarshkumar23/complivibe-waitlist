import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase'
import { calculateRiskScore } from '@/lib/riskScore'
import { sendRiskScoreEmail } from '@/lib/resend'
import { tierFromModelCount, type WaitlistApiResponse, type WaitlistInput } from '@/lib/types'

export const runtime = 'edge'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** WL-2026-#### with a random 4-digit suffix (1000–9999). */
function generateWaitlistId(): string {
  return `WL-2026-${Math.floor(1000 + Math.random() * 9000)}`
}

export async function POST(req: NextRequest): Promise<NextResponse<WaitlistApiResponse>> {
  let body: Partial<WaitlistInput>
  try {
    body = (await req.json()) as Partial<WaitlistInput>
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const name = (body.name || '').trim()
  const email = (body.email || '').trim().toLowerCase()
  const company = (body.company || '').trim()
  const role = (body.role || '').trim()
  const frameworks = Array.isArray(body.frameworks) ? body.frameworks : []
  const modelCount = (body.modelCount || '').trim()
  const challenges = Array.isArray(body.challenges) ? body.challenges : []
  const nightRegulation = (body.nightRegulation || '').trim().slice(0, 200)

  // 1. Validate required fields
  if (!name || !email || !company || !role || !modelCount) {
    return NextResponse.json(
      { success: false, error: 'Please fill in all required fields.' },
      { status: 400 }
    )
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: 'Please enter a valid work email.' },
      { status: 400 }
    )
  }

  // 2. Calculate risk score + tier
  const { score, gaps } = calculateRiskScore({ frameworks, modelCount, challenges })
  const tier = tierFromModelCount(modelCount)

  // 3. Insert into Supabase.
  //    Resilient to: duplicate email (409), rare waitlist_id collisions
  //    (regenerate), and the waitlist_id column not existing yet (drop it
  //    so the signup still saves until the migration is run).
  const supabase = createAnonClient()
  let waitlistId: string | null = generateWaitlistId()
  let includeWaitlistId = true
  let lastError: { code?: string; message: string; details?: string } | null = null

  const baseRow = {
    name,
    email,
    company,
    role,
    frameworks,
    model_count: modelCount,
    challenges,
    night_regulation: nightRegulation || null,
    risk_score: score,
    risk_gaps: gaps,
  }

  for (let attempt = 0; attempt < 4; attempt++) {
    const row = includeWaitlistId ? { ...baseRow, waitlist_id: waitlistId } : baseRow
    const { error: insertError } = await supabase.from('waitlist_signups').insert(row)

    if (!insertError) {
      lastError = null
      break
    }
    lastError = insertError

    // Column missing (migration not run yet) — drop waitlist_id and retry
    const refersWaitlistId = /waitlist_id/i.test(
      `${insertError.message} ${insertError.details ?? ''}`
    )
    if (insertError.code === 'PGRST204' && refersWaitlistId) {
      includeWaitlistId = false
      waitlistId = null
      continue
    }

    const isUnique = insertError.code === '23505' || /duplicate|unique/i.test(insertError.message)
    if (isUnique) {
      const blob = `${insertError.message} ${insertError.details ?? ''}`.toLowerCase()
      // Duplicate email — terminal, surface gracefully
      if (blob.includes('email')) {
        return NextResponse.json(
          {
            success: false,
            error: "You're already on the waitlist with this email — check your inbox!",
          },
          { status: 409 }
        )
      }
      // waitlist_id collision — regenerate and retry
      waitlistId = generateWaitlistId()
      continue
    }
    break // unknown error — stop retrying
  }

  if (lastError) {
    console.error('Waitlist insert error:', lastError)
    return NextResponse.json(
      { success: false, error: 'Could not save your signup. Please try again.' },
      { status: 500 }
    )
  }

  // 4. Send confirmation email (non-blocking failure)
  const emailResult = await sendRiskScoreEmail({
    name,
    email,
    riskScore: score,
    gaps,
    waitlistId: waitlistId ?? undefined,
  })
  console.log('Email send outcome:', emailResult)

  // 5. Return result
  return NextResponse.json({
    success: true,
    riskScore: score,
    gaps,
    waitlistId: waitlistId ?? undefined,
    tier,
  })
}
