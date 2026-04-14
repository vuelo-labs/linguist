-- Run this in Supabase SQL editor
-- https://supabase.com/dashboard/project/odnzrykfmfgdfybnmcfd/editor

create table if not exists public.course_progress (
  id               uuid        default gen_random_uuid() primary key,
  email            text        not null,
  profile          text        check (profile in ('newrole', 'professional', 'maker')),
  completed_modules text[]     default '{}',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- One row per email address
create unique index if not exists course_progress_email_idx
  on public.course_progress (lower(email));

-- Allow anonymous inserts and upserts (no auth required — progress is not sensitive)
alter table public.course_progress enable row level security;

create policy "Anyone can upsert their own progress"
  on public.course_progress
  for all
  using (true)
  with check (true);
