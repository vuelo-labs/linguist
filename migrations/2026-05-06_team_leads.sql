-- Team leads from /teams page contact form.
-- Anonymous insert allowed; reads restricted (service role only).

create table if not exists public.team_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid,
  name text not null,
  email text not null,
  company text,
  team_size text,
  notes text,
  referrer text,
  user_agent text
);

alter table public.team_leads enable row level security;

drop policy if exists team_leads_anon_insert on public.team_leads;
create policy team_leads_anon_insert
  on public.team_leads
  for insert
  to anon
  with check (true);
