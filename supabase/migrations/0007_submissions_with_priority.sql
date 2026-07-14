create or replace view public.submissions_with_priority as
select
  *,
  (array_length(followed_channels, 1) = 4) as has_full_follow_priority
from public.submissions
where status = 'approved'
order by vote_count desc;
