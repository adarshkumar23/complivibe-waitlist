-- CompliVibe Waitlist — Supabase schema
-- Run this in the Supabase SQL Editor (https://app.supabase.com → SQL Editor → New query)

create table if not exists waitlist_signups (
  id uuid default gen_random_uuid() primary key,
  waitlist_id text unique,
  name text not null,
  email text not null unique,
  company text not null,
  role text not null,
  frameworks text[] default '{}',
  model_count text not null,
  challenges text[] default '{}',
  night_regulation text,
  risk_score text not null check (risk_score in ('HIGH', 'MEDIUM', 'LOW')),
  risk_gaps text[] default '{}',
  created_at timestamptz default now()
);

-- If the table already exists, add the waitlist_id column:
alter table waitlist_signups add column if not exists waitlist_id text unique;

-- Enable RLS
alter table waitlist_signups enable row level security;

-- Allow inserts from anon (for form submissions)
create policy "Allow public inserts" on waitlist_signups
  for insert with check (true);

-- Only service role can read (for admin)
create policy "Service role only reads" on waitlist_signups
  for select using (auth.role() = 'service_role');
