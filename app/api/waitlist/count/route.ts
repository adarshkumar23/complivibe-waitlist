import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ count: 0 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { count } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })

    return Response.json({ count: count || 0 })
  } catch {
    return Response.json({ count: 0 })
  }
}
