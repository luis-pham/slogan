create table public.pending_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  slogan text not null check (char_length(slogan) <= 120),
  explanation text not null check (char_length(explanation) <= 600),
  followed_channels text[] not null default '{}',
  fingerprint_hash text not null,
  ip_hash text not null,
  verify_attempts int not null default 0,
  otp_requested_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index pending_submissions_email_idx
  on public.pending_submissions(lower(email), expires_at desc);

create index pending_submissions_expires_idx
  on public.pending_submissions(expires_at);

alter table public.pending_submissions enable row level security;

create policy "No direct read access to pending submissions"
  on public.pending_submissions for select
  using (false);

create policy "Block direct client insert pending submissions"
  on public.pending_submissions for insert
  with check (false);

create policy "Block direct client update pending submissions"
  on public.pending_submissions for update
  using (false);

create policy "Block direct client delete pending submissions"
  on public.pending_submissions for delete
  using (false);

create or replace function public.delete_expired_pending_submissions()
returns void as $$
begin
  delete from public.pending_submissions
  where expires_at < now();
end;
$$ language plpgsql security definer set search_path = public;
