insert into public.campaign_settings (
  id,
  phase,
  submission_start,
  submission_end,
  voting_start,
  voting_end
) values (
  1,
  'submission',
  now() - interval '1 day',
  now() + interval '7 days',
  now() + interval '8 days',
  now() + interval '11 days'
) on conflict (id) do update set
  phase = excluded.phase,
  submission_start = excluded.submission_start,
  submission_end = excluded.submission_end,
  voting_start = excluded.voting_start,
  voting_end = excluded.voting_end;

insert into public.submissions (
  email,
  full_name,
  slug,
  slogan,
  explanation,
  followed_channels,
  status,
  vote_count,
  is_seed,
  submitter_fingerprint_hash
) values
  (
    'seed-one@example.com',
    'Linh Nguyen',
    'gr-a9f2c1d4',
    'Luxury without trace',
    'A quiet promise for trips that stay with guests, not with the bay.',
    array['facebook','tiktok'],
    'approved',
    18,
    true,
    'seed_hash_one'
  ),
  (
    'seed-two@example.com',
    'Minh Tran',
    'gr-b8e3d2c5',
    'Where silence meets emerald water',
    'The line keeps Green Ruby calm, visual, and close to Lan Ha Bay.',
    array['facebook','instagram'],
    'approved',
    11,
    true,
    'seed_hash_two'
  )
on conflict (slug) do nothing;
