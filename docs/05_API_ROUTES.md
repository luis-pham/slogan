# API Routes

## Nguyên tắc

- Toàn bộ ghi dữ liệu (submit, vote) phải qua Next.js Route Handler
  (server-side), KHÔNG cho client insert thẳng vào Supabase từ browser
  — dù có RLS, vẫn cần business logic validate ở server (đếm từ, kiểm
  tra phase, rate limit)
- Đọc dữ liệu (list submissions, leaderboard) có thể query thẳng từ
  client qua Supabase client (RLS đã đủ bảo vệ cho SELECT)

## POST /api/submissions/request

Input: `{ full_name, email, slogan, explanation, followed_channels, fingerprint }`

Xử lý:
1. Kiểm tra `campaign_settings.phase === 'submission'`, nếu không → trả lỗi 403
2. Validate toàn bộ input bằng Zod (số từ slogan/explanation,
   `followed_channels` không rỗng)
3. Rate limit gửi OTP theo email và rate limit submit theo IP
4. Kiểm tra email chưa có submission chính thức nào trong bảng
   `submissions` (không tính pending)
5. Hash fingerprint/IP, lưu dữ liệu form vào `pending_submissions`,
   set `expires_at = now() + 10 phút`
6. Gọi `supabase.auth.signInWithOtp({ email })`
7. Trả về `{ pending_id }` để client dùng ở bước verify

## POST /api/submissions/confirm

Input: `{ pending_id, email, otp_code }`

Xử lý:
1. Lấy pending theo `pending_id + email`, kiểm tra chưa hết hạn và chưa
   quá 5 lần verify sai
2. Verify OTP qua `supabase.auth.verifyOtp(...)`
3. Nếu sai OTP: tăng `verify_attempts`, trả lỗi, cho phép thử lại
4. Nếu đúng: kiểm tra lại email chưa có submission chính thức
5. Generate slug duy nhất, insert vào bảng `submissions` chính thức với
   `status = 'pending'`
6. Xoá bản ghi trong `pending_submissions`
7. Gửi email xác nhận "đã nhận được bài dự thi" qua Resend (best-effort
   — nếu gửi lỗi hoặc chưa cấu hình `RESEND_API_KEY`, không làm fail
   request, xem `lib/email.ts`)
8. Trả về slug để redirect `/entry/[slug]`

## POST /api/votes

Input: `{ submission_id, fingerprint }`

Xử lý:
1. Lấy IP từ header request (`x-forwarded-for` qua Nginx proxy, cấu
   hình đã có `proxy_set_header X-Forwarded-For` — xem 08_DEPLOYMENT.md)
2. Hash fingerprint + hash IP (SHA-256 + salt cố định lưu trong biến
   môi trường `HASH_SALT`)
3. Kiểm tra `campaign_settings.phase === 'voting'`
4. Kiểm tra không tự vote cho bài của chính mình — so sánh
   `fingerprint_hash` vừa tính với `submitter_fingerprint_hash` của
   submission đó, nếu trùng → chặn, trả lỗi rõ ràng
5. Kiểm tra rate limit theo IP (tối đa 20 vote/phút/IP — chặn bot
   vote hàng loạt)
6. Insert vào bảng votes bằng Supabase service role client (bảng votes
   chặn insert trực tiếp từ client theo RLS)
7. Nếu vi phạm unique constraint (đã vote rồi) → trả lỗi 409 rõ ràng
   cho UI hiện "Bạn đã vote bài này rồi"
8. Trigger tự động tăng `vote_count` trên submissions (đã có ở
   02_DATABASE_SCHEMA.md)

## GET /api/submissions (dùng cho wall)

Có thể query thẳng client thay vì qua route riêng nếu đơn giản —
Cursor tự quyết định, ưu tiên đơn giản hoá nếu Supabase client query
trực tiếp đủ dùng (RLS cho phép SELECT submission có status='approved').

## Việc CẦN làm ở bước này

1. Code các route handler trên
2. Viết input validation dùng Zod (thêm vào dependencies)
3. Báo cáo, chờ xác nhận
