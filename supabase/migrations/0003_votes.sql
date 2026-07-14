create table public.votes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references public.submissions(id) on delete cascade not null,
  fingerprint_hash text not null,
  ip_hash text not null,
  created_at timestamptz default now()
);

create unique index one_vote_per_device_per_submission
  on public.votes(submission_id, fingerprint_hash, ip_hash);

create index votes_submission_created_idx
  on public.votes(submission_id, created_at desc);

alter table public.votes enable row level security;

create policy "Only service role can insert votes"
  on public.votes for insert
  with check (false);

create policy "No direct read access to votes table"
  on public.votes for select
  using (false);

create policy "No direct update access to votes table"
  on public.votes for update
  using (false);

create policy "No direct delete access to votes table"
  on public.votes for delete
  using (false);

create or replace function public.increment_vote_count()
returns trigger as $$
begin
  update public.submissions
  set vote_count = vote_count + 1
  where id = new.submission_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_vote_inserted
  after insert on public.votes
  for each row execute procedure public.increment_vote_count();
