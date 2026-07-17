-- Siết chống spam vote:
-- 1) Mỗi fingerprint chỉ vote 1 lần / bài
-- 2) Mỗi IP chỉ vote 1 lần / bài
-- Giữ vote sớm nhất khi có trùng; đồng bộ lại vote_count.

-- Xóa vote trùng theo fingerprint (giữ bản sớm nhất)
delete from public.votes a
using public.votes b
where a.submission_id = b.submission_id
  and a.fingerprint_hash = b.fingerprint_hash
  and a.created_at > b.created_at;

delete from public.votes a
using public.votes b
where a.submission_id = b.submission_id
  and a.fingerprint_hash = b.fingerprint_hash
  and a.created_at = b.created_at
  and a.id > b.id;

-- Xóa vote trùng theo IP (giữ bản sớm nhất)
delete from public.votes a
using public.votes b
where a.submission_id = b.submission_id
  and a.ip_hash = b.ip_hash
  and a.created_at > b.created_at;

delete from public.votes a
using public.votes b
where a.submission_id = b.submission_id
  and a.ip_hash = b.ip_hash
  and a.created_at = b.created_at
  and a.id > b.id;

drop index if exists public.one_vote_per_device_per_submission;

create unique index one_vote_per_fingerprint_per_submission
  on public.votes (submission_id, fingerprint_hash);

create unique index one_vote_per_ip_per_submission
  on public.votes (submission_id, ip_hash);

-- Đồng bộ vote_count sau khi dọn trùng
update public.submissions s
set vote_count = coalesce((
  select count(*)::int
  from public.votes v
  where v.submission_id = s.id
), 0);
