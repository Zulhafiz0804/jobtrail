create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company text not null,
  title text not null,
  link text not null,
  date_applied date not null,
  status text not null default 'Applied',
  salary text,
  recruiter_name text,
  recruiter_email text,
  cv text,
  interview_at timestamptz,
  notes text,
  checklist jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy "Users manage their own jobs"
  on public.jobs for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select, insert, update, delete on public.jobs to authenticated;