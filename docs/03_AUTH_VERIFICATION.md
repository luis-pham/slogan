# Xác thực — Email OTP cho Submit, Fingerprint cho Vote

## Quyết định thiết kế (đã điều chỉnh sau khi cân nhắc UX)

KHÔNG dùng Google Auth. Lý do:
- Đối tượng tham gia chủ yếu lướt Facebook/TikTok, không quen luồng
  Google Sign In giữa chừng
- Vote thường diễn ra trong in-app browser của Facebook/TikTok/Instagram
  (embedded webview) — Google OAuth bị chặn trong môi trường này
  ("This browser or app may not be secure"), gây mất vote thật
- Mục tiêu là tối giản friction ở bước vote vì đây là nơi traffic cao
  nhất và quyết định viral

## Cơ chế thay thế

### Submit bài dự thi → Email OTP

1. User điền đầy đủ form dự thi trước
2. Server validate form, lưu tạm vào `pending_submissions`, rồi gửi mã
   OTP 6 số vào email (dùng Supabase Auth `signInWithOtp`, KHÔNG cần
   thiết lập Google provider, chỉ cần bật Email OTP trong Supabase
   Dashboard)
3. User nhập mã OTP để xác thực
4. Sau khi xác thực, server mới tạo submission chính thức trong bảng
   `submissions`

Đây vẫn dùng Supabase Auth (giữ nguyên bảng `profiles` liên kết
`auth.users`), chỉ khác provider: Email OTP thay vì Google OAuth.

### Vote → Không cần đăng nhập

1. Không yêu cầu tài khoản
2. Chống gian lận bằng 3 lớp kết hợp:
   a. **Browser fingerprint** — dùng thư viện FingerprintJS (bản
      open-source miễn phí, KHÔNG dùng bản Pro trả phí trừ khi traffic
      thực tế cần), sinh ra `visitor_id` ổn định theo trình duyệt/thiết bị
   b. **IP hash** — SHA-256 hash IP (không lưu IP thô)
   c. **Rate limit theo cả 2** — 1 submission chỉ được vote 1 lần bởi
      cùng (fingerprint + ip_hash), unique constraint ở tầng database
3. Thêm Cloudflare Turnstile (CAPTCHA ẩn, không làm phiền user) trước
   khi cho phép vote — bật/tắt qua biến môi trường, chỉ kích hoạt hiển
   thị challenge nếu Turnstile nghi ngờ hành vi bất thường

## Luồng UX cụ thể (đã cập nhật — điền form trước, xác thực sau)

**Submit:**
1. User vào `/join` — không cần bất kỳ xác thực nào để bắt đầu
2. Điền toàn bộ form ngay: họ tên, email, chọn kênh đã follow, slogan
   tối đa 10 từ, giải thích tối đa 50 từ
3. Bấm "Gửi bài dự thi" — client validate đủ điều kiện trước
4. Server validate lại toàn bộ, kiểm tra phase, kiểm tra email chưa có
   submission chính thức, lưu dữ liệu vào `pending_submissions`, rồi gửi
   OTP đến email vừa nhập
5. Hiện màn hình "Nhập mã xác nhận gửi đến [email]"
6. User nhập mã 6 số
7. Verify đúng → server lấy dữ liệu từ `pending_submissions`, tạo
   submission chính thức với `status = 'pending'`, xoá pending, redirect
   sang `/entry/[slug]`
8. Verify sai → cho nhập lại, tối đa 5 lần; pending hết hạn sau 10 phút
   thì phải quay lại gửi lại biểu mẫu

**Lý do đổi thứ tự:** để người dùng đầu tư công sức viết slogan trước
khi yêu cầu xác thực, tăng tỷ lệ hoàn thành so với việc bắt xác thực
ngay từ đầu.

## Lưu trữ tạm trong lúc chờ verify OTP

Dùng bảng `pending_submissions` tạm thay vì ghi ngay vào bảng
`submissions`. Cách này rõ ràng, dễ debug và tránh rác trong bảng chính
khi người dùng không bao giờ verify OTP.

```sql
create table public.pending_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  slogan text not null,
  explanation text not null,
  followed_channels text[] not null,
  fingerprint_hash text not null,
  ip_hash text not null,
  verify_attempts int not null default 0,
  otp_requested_at timestamptz not null default now(),
  expires_at timestamptz not null
);
```

Mỗi lần request OTP thành công, server xoá pending cũ của cùng email và
tạo pending mới hết hạn sau 10 phút. Migration cũng có hàm
`delete_expired_pending_submissions()` để cron hoặc Supabase Scheduler
dọn dẹp định kỳ.

**Vote:**
1. User vào `/wall` hoặc `/entry/[slug]` (kể cả qua in-app browser
   Facebook/TikTok)
2. Bấm nút Vote — không có bước đăng nhập nào
3. Client gọi API kèm fingerprint (tính toán ngầm bằng JS khi trang load)
4. Server kiểm tra rate-limit + unique constraint → ghi vote hoặc trả
   lỗi "Bạn đã vote bài này rồi"

## Việc Cursor cần code

1. `lib/supabase/client.ts` và `server.ts` — dùng Email OTP:

```ts
// Gửi mã OTP
await supabase.auth.signInWithOtp({
  email,
  options: { shouldCreateUser: true }
})

// Xác thực OTP
await supabase.auth.verifyOtp({
  email,
  token: otpCode,
  type: 'email'
})
```

2. Component form `/join` — 2 bước: điền thông tin → nhập mã OTP
3. Hàm `getFingerprint()` trong `lib/fingerprint.ts` dùng
   `@fingerprintjs/fingerprintjs` (bản community/open-source), gọi ở
   client trước khi submit vote request
4. Không dùng middleware để chặn `/join`; route này luôn mở để người
   dùng điền form. Việc xác thực OTP chỉ diễn ra trong API
   `/api/submissions/confirm`. KHÔNG áp dụng middleware cho `/wall`,
   `/entry/[slug]`, route vote

## Chặn tự vote (tác giả tự vote bài của mình)

Vì vote ẩn danh hoàn toàn, không thể chắc chắn chặn tác giả tự vote bài
mình trừ khi so sánh fingerprint. Giải pháp:
- Lưu `submitter_fingerprint_hash` vào bảng `submissions` ngay tại thời
  điểm submit (tính fingerprint của người submit lúc đó)
- Khi vote, so sánh fingerprint hiện tại với `submitter_fingerprint_hash`
  của submission đang được vote — nếu trùng thì chặn, trả lỗi
  "Không thể tự vote cho bài của mình"

## Trang quản trị `/admin` — Google OAuth (ĐÃ THÊM)

Khác với luồng submit/vote công khai (không dùng Google Auth vì lý do
in-app browser ở trên), trang quản trị nội bộ `/admin` dùng Google OAuth
qua Supabase Auth vì admin luôn truy cập bằng trình duyệt thường, không
qua embedded webview.

- `components/admin-login-button.tsx` gọi
  `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })`
- `app/admin/auth/callback/route.ts` — Route Handler đổi `code` lấy
  session (`exchangeCodeForSession`), rồi redirect vào `/admin`
- **Phân quyền:** đăng nhập Google thành công KHÔNG đồng nghĩa được vào
  dashboard — server so email đã đăng nhập với danh sách
  `ADMIN_EMAILS` (biến môi trường, phân tách bằng dấu phẩy) trong
  `lib/admin-auth.ts`. Không có trong danh sách → chặn, hiện "chưa được
  cấp quyền", không lộ dữ liệu
- `app/admin/page.tsx` hiển thị: tổng số người tham gia, số đã
  duyệt/chờ duyệt/từ chối, tổng lượt bình chọn, và bảng chi tiết từng
  submission kèm số vote — fetch bằng service role client (bỏ qua RLS,
  chỉ an toàn vì đã chặn quyền truy cập ở trên)

**Việc cần làm ở Supabase Dashboard (ngoài code, tự cấu hình):**
1. Bật Google provider trong Authentication → Providers, cần tạo OAuth
   Client ID/Secret trên Google Cloud Console
2. Thêm Authorized redirect URI:
   `https://<supabase-project>.supabase.co/auth/v1/callback`
3. Thêm domain thật vào Site URL / Redirect URLs của Supabase Auth để
   `exchangeCodeForSession` hoạt động đúng trên production
4. Điền `ADMIN_EMAILS` trong biến môi trường production với email
   Google thật của những người được xem dashboard

## Việc CẦN làm ở bước này

1. Cấu hình Supabase Dashboard: bật Email OTP provider (tôi tự làm,
   Cursor không cần lo phần Dashboard)
2. Code luồng OTP 2 bước cho submit
3. Code fingerprint cho vote
4. Viết test cho cả 2 luồng (xem 07_TESTING.md)
5. Báo cáo, chờ xác nhận
