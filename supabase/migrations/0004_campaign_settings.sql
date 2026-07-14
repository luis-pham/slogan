create table public.campaign_settings (
  id int primary key default 1,
  phase text not null default 'submission'
    check (phase in ('submission','voting','ended')),
  submission_start timestamptz not null,
  submission_end timestamptz not null,
  voting_start timestamptz not null,
  voting_end timestamptz not null,
  constraint single_row check (id = 1)
);

alter table public.campaign_settings enable row level security;

create policy "Anyone can view campaign settings"
  on public.campaign_settings for select
  using (true);

create policy "Block direct campaign insert"
  on public.campaign_settings for insert
  with check (false);

create policy "Block direct campaign update"
  on public.campaign_settings for update
  using (false);

create policy "Block direct campaign delete"
  on public.campaign_settings for delete
  using (false);
