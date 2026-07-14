create table public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  key text not null,
  action text not null check (action in ('send_otp','submit','vote')),
  ip_hash text,
  created_at timestamptz not null default now()
);

create index rate_limit_events_lookup_idx
  on public.rate_limit_events(action, key, created_at desc);

alter table public.rate_limit_events enable row level security;

create policy "No direct read access to rate limit events"
  on public.rate_limit_events for select
  using (false);

create policy "Block direct client insert rate limit events"
  on public.rate_limit_events for insert
  with check (false);

create policy "Block direct client update rate limit events"
  on public.rate_limit_events for update
  using (false);

create policy "Block direct client delete rate limit events"
  on public.rate_limit_events for delete
  using (false);
