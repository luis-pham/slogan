-- Bỏ phase 'voting': bình chọn mở song song với giai đoạn nhận bài.
-- Giữ cột voting_start / voting_end (không drop); logic app không còn dùng.
-- Không chạy migration này lên production cho đến khi được review.

-- Chuẩn hoá dữ liệu trước khi thắt check constraint
update public.campaign_settings
set phase = 'submission'
where phase = 'voting';

update public.campaign_settings
set
  phase = 'submission',
  submission_start = timestamptz '2026-07-10 00:00:00+07',
  submission_end = timestamptz '2026-07-31 23:59:59+07',
  voting_start = timestamptz '2026-07-15 00:00:00+07',
  voting_end = timestamptz '2026-07-31 23:59:59+07'
where id = 1;

alter table public.campaign_settings
  drop constraint if exists campaign_settings_phase_check;

alter table public.campaign_settings
  add constraint campaign_settings_phase_check
  check (phase in ('submission', 'ended'));
