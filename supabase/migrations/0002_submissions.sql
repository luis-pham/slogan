create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  slug text unique not null,
  slogan text not null check (char_length(slogan) <= 60),
  explanation text not null check (char_length(explanation) <= 300),
  followed_channels text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  vote_count int not null default 0,
  is_seed boolean not null default false,
  is_winner boolean not null default false,
  flagged_for_review boolean not null default false,
  submitter_fingerprint_hash text not null,
  created_at timestamptz default now()
);

create unique index one_submission_per_email
  on public.submissions(lower(email))
  where status != 'rejected';

create index submissions_public_wall_idx
  on public.submissions(status, flagged_for_review, vote_count desc, created_at desc);

alter table public.submissions enable row level security;

create policy "Anyone can view approved submissions"
  on public.submissions for select
  using (status = 'approved');

create policy "Block direct client insert"
  on public.submissions for insert
  with check (false);

create policy "Block direct client updates"
  on public.submissions for update
  using (false);

create policy "Block direct client deletes"
  on public.submissions for delete
  using (false);
