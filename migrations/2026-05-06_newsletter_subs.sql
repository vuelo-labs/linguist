-- Newsletter subscribers from footer + page-end capture forms.
-- Anonymous insert allowed; reads service-role only.

create table if not exists public.newsletter_subs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  source text,
  session_id uuid,
  referrer text,
  user_agent text
);

create unique index if not exists newsletter_subs_email_unique
  on public.newsletter_subs (lower(email));

alter table public.newsletter_subs enable row level security;

drop policy if exists newsletter_subs_anon_insert on public.newsletter_subs;
create policy newsletter_subs_anon_insert
  on public.newsletter_subs
  for insert
  to anon
  with check (true);
