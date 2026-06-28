import { createClient } from '@supabase/supabase-js'

/*
 * Supabase schema (also in supabase-setup.sql):
 *
 * create table if not exists waitlist_signups (
 *   id uuid default gen_random_uuid() primary key,
 *   name text not null,
 *   email text not null unique,
 *   company text not null,
 *   role text not null,
 *   frameworks text[] default '{}',
 *   model_count text not null,
 *   challenges text[] default '{}',
 *   night_regulation text,
 *   risk_score text not null check (risk_score in ('HIGH', 'MEDIUM', 'LOW')),
 *   risk_gaps text[] default '{}',
 *   created_at timestamptz default now()
 * );
 *
 * alter table waitlist_signups enable row level security;
 * create policy "Allow public inserts" on waitlist_signups for insert with check (true);
 * create policy "Service role only reads" on waitlist_signups for select using (auth.role() = 'service_role');
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

/**
 * Browser/anon client — uses the public publishable key.
 * Safe to use client-side and in unauthenticated server contexts (inserts only).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

/**
 * Server-only admin client — uses the service role key and bypasses RLS.
 * NEVER import this into client components. Admin routes only.
 */
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY as string
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
