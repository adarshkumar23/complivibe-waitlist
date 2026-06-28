import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import type { WaitlistSignup } from '@/lib/types'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  // 1. Check Authorization header against ADMIN_PASSWORD
  const auth = req.headers.get('authorization') || ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || token !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Service-key client bypasses RLS
  const supabase = createServiceClient()

  // 3. Fetch all signups, newest first
  const { data, error } = await supabase
    .from('waitlist_signups')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 4. Return full data
  return NextResponse.json({ signups: (data || []) as WaitlistSignup[] })
}
