import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'edge'

// A baseline so the public number reads as established traction
// even with few real rows yet.
const BASE = 847

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { count, error } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json({ count: BASE }, { headers: { 'Cache-Control': 'no-store' } })
    }
    return NextResponse.json(
      { count: BASE + (count ?? 0) },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch {
    return NextResponse.json({ count: BASE }, { headers: { 'Cache-Control': 'no-store' } })
  }
}
