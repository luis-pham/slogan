# Database Schema — Supabase

## Nguyên tắc

- Toàn bộ bảng nằm trong schema `public` của Supabase project riêng
- BẮT BUỘC bật Row Level Security (RLS) cho MỌI bảng — không có ngoại lệ
- Viết migration dưới dạng file `.sql` trong `supabase/migrations/`,
  KHÔNG chạy trực tiếp lên Supabase production — chỉ tạo file, tôi sẽ
  review và tự chạy qua Supabase CLI hoặc Dashboard

## Bảng: profiles

Lưu thông tin người dùng sau khi xác thực Email OTP, liên kết với
`auth.users` của Supabase Auth (Supabase vẫn tạo `auth.users` record
khi verify OTP thành công, dù không dùng Google OAuth).

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger tự tạo profile khi user verify OTP lần đầu
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Bảng: submissions (ĐÃ CẬP NHẬT — xác thực qua email OTP, không qua
Google user_id)

```sql
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  slug text unique not null,               -- dùng cho URL /entry/[slug]
  slogan text not null check (char_length(slogan) <= 60),
  -- giới hạn ký tự an toàn hơn đếm "10 chữ", validate số từ ở app layer
  explanation text not null check (char_length(explanation) <= 300),
  followed_channels text[] not null default '{}',
  -- ví dụ: ['facebook', 'tiktok']
  status text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  vote_count int not null default 0,        -- denormalized, cập nhật qua trigger
  is_seed boolean not null default false,   -- đánh dấu bài mồi/nội bộ,
                                             -- loại khỏi giải nếu cần
  is_winner boolean not null default false, -- đánh dấu thủ công sau khi
                                             -- BGK quyết định (qua Dashboard)
  flagged_for_review boolean not null default false, -- admin tạm khoá
                                             -- nếu nghi ngờ gian lận
  submitter_fingerprint_hash text not null, -- dùng để chặn tự vote sau này
  created_at timestamptz default now()
);

create unique index one_submission_per_email
  on public.submissions(lower(email))
  where status != 'rejected';   -- mỗi email 1 bài hợp lệ

alter table public.submissions enable row level security;

create policy "Anyone can view approved submissions"
  on public.submissions for select
  using (status = 'approved');

-- Insert CHỈ qua service role (server route), sau khi verify OTP
-- session hợp lệ — chặn hoàn toàn insert trực tiếp từ client
create policy "Block direct client insert"
  on public.submissions for insert
  with check (false);
```

## Bảng: pending_submissions (lưu tạm trước khi verify OTP)

```sql
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
```

Server route `/api/submissions/request` tạo row pending, route
`/api/submissions/confirm` verify OTP rồi mới insert vào
`submissions`. Pending hết hạn sau 10 phút và có thể dọn bằng function
`delete_expired_pending_submissions()`.

## Bảng: votes (ĐÃ CẬP NHẬT — không yêu cầu đăng nhập, dùng fingerprint + IP)

```sql
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references public.submissions(id) on delete cascade not null,
  fingerprint_hash text not null,   -- từ FingerprintJS, hash lại 1 lần
                                     -- nữa bằng sha256 trước khi lưu
  ip_hash text not null,            -- sha256 hash của IP
  created_at timestamptz default now()
);

-- Chặn vote trùng: cùng fingerprint + cùng IP + cùng submission
create unique index one_vote_per_device_per_submission
  on public.votes(submission_id, fingerprint_hash, ip_hash);

alter table public.votes enable row level security;

-- Vote KHÔNG cần đăng nhập, nhưng vẫn KHÔNG cho client insert thẳng
-- từ browser — bắt buộc qua API route (server) để enforce rate-limit
-- và kiểm tra phase trước khi ghi
create policy "Only service role can insert votes"
  on public.votes for insert
  with check (false);   -- chặn hoàn toàn insert từ client,
                          -- chỉ server (service role) mới ghi được

create policy "No direct read access to votes table"
  on public.votes for select
  using (false);   -- không cho đọc bảng votes trực tiếp,
                     -- vote_count đã denormalize trên submissions rồi

-- Trigger cập nhật vote_count denormalized trên submissions
create function public.increment_vote_count()
returns trigger as $$
begin
  update public.submissions
  set vote_count = vote_count + 1
  where id = new.submission_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_vote_inserted
  after insert on public.votes
  for each row execute procedure public.increment_vote_count();
```

**Lưu ý quan trọng:** Vì vote không có người dùng đăng nhập, route API
`/api/votes` phải dùng Supabase **service role key** để insert (bypass
RLS có kiểm soát), sau khi đã tự validate rate-limit/fingerprint ở tầng
server. Toàn bộ logic chống gian lận nằm ở server, không dựa vào RLS
cho bảng này.

## Bảng: campaign_settings

```sql
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

-- KHÔNG có policy insert/update cho client — chỉ admin sửa qua
-- Supabase Dashboard trực tiếp hoặc service role key
```

## Việc CẦN làm ở bước này

1. Tạo các file migration `.sql` riêng biệt theo thứ tự
   (0001_profiles.sql, 0002_submissions.sql, 0003_votes.sql,
   0004_campaign_settings.sql, 0005_rate_limit_events.sql,
   0006_pending_submissions.sql)
2. KHÔNG chạy migration — chỉ tạo file
3. Viết kèm 1 file `seed.sql` mẫu để test local (dữ liệu giả, không
   phải data thật)
4. Báo cáo danh sách file đã tạo, chờ xác nhận trước khi sang bước tiếp theo
