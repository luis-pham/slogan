# Bảo mật & Chống gian lận

## Bắt buộc

1. **RLS trên mọi bảng** — đã định nghĩa ở 02_DATABASE_SCHEMA.md,
   verify lại bằng cách thử query từ client như 1 user thường không có
   quyền, đảm bảo bị chặn đúng

2. **Rate limiting** ở tầng API route:
   - Send OTP: tối đa 3 lần/email/giờ (chặn spam gửi mail)
   - Submit: tối đa 1 request/phút/IP (dùng thư viện `@upstash/ratelimit`
     nếu dùng Upstash Redis miễn phí, hoặc tự implement bằng bảng
     Supabase đơn giản đếm request theo IP + timestamp nếu không muốn
     thêm dependency Redis)
   - Vote: tối đa 20 request/phút/IP (chặn bot spam vote nhanh)

3. **Fingerprint + IP là lớp chống gian lận chính cho vote** — mỗi
   vote gắn với (fingerprint_hash, ip_hash), unique constraint
   (submission_id, fingerprint_hash, ip_hash) chặn vote trùng ở tầng
   database, không chỉ tầng app

4. **Email OTP là lớp xác thực chính cho submit** — email thật được
   xác thực trước khi cho phép submit, giảm submission rác/ảo

5. **IP hashing** — không lưu IP thô vào database (tuân thủ nguyên tắc
   privacy), dùng SHA-256 hash IP + salt cố định trước khi lưu, chỉ
   dùng để phát hiện pattern bất thường (nhiều vote khác fingerprint
   nhưng cùng IP trong thời gian ngắn)

6. **CAPTCHA** — thêm Cloudflare Turnstile (miễn phí) vào form gửi OTP
   và có thể vào vote nếu phát hiện traffic bất thường trong giai đoạn
   vote. Thêm sẵn component nhưng để `enabled` qua biến môi trường, có
   thể bật/tắt không cần deploy lại

7. **Input sanitization** — slogan/explanation phải qua Zod validation
   + escape HTML trước khi lưu, dù React tự escape khi render, vẫn
   tránh lưu payload độc hại vào DB

8. **Secrets** —
   - `SUPABASE_SERVICE_ROLE_KEY` CHỈ dùng trong server-side code
     (route handlers, server components), KHÔNG BAO GIỜ import vào
     'use client' component
   - `HASH_SALT` cũng chỉ dùng server-side
   - Kiểm tra kỹ trước khi commit: chạy `git diff --cached` xem có lọt
     secret nào không

9. **CORS** — API routes chỉ chấp nhận request từ domain
   greenrubycruises.com, chặn request cross-origin khác

10. **Content Security Policy** — thêm CSP header cơ bản trong
    `next.config.js` hoặc middleware, hạn chế script nguồn lạ

## Rủi ro & giới hạn của cơ chế fingerprint (cần hiểu rõ, không phải
giải pháp hoàn hảo)

- Fingerprint có thể bị vô hiệu hoá nếu người dùng dùng chế độ ẩn danh
  (incognito) hoặc đổi trình duyệt — tức 1 người có thể vote nhiều lần
  bằng cách đổi trình duyệt/thiết bị. Đây là giới hạn CHẤP NHẬN ĐƯỢC
  cho 1 cuộc thi marketing, không phải hệ thống bầu cử — mục tiêu là
  chặn gian lận hàng loạt (bot script), không phải chặn tuyệt đối
  1 người vote 2 lần bằng 2 thiết bị
- Kết hợp IP + fingerprint giảm đáng kể khả năng bot đơn giản (chỉ đổi
  IP hoặc chỉ đổi fingerprint không đủ để vượt qua)
- Nếu phát hiện gian lận quy mô lớn trong giai đoạn vote (ví dụ 1
  submission tăng vọt bất thường), có endpoint admin để tạm khoá
  submission đó khỏi leaderboard trong khi điều tra (cột
  `flagged_for_review` đã có trong bảng submissions)

## Checklist bảo mật trước khi launch (Cursor tự chạy qua checklist
này và báo cáo từng mục)

- [ ] RLS bật trên tất cả bảng, đã test bằng anon key không đọc/ghi
      được dữ liệu không được phép
- [ ] Service role key và HASH_SALT không xuất hiện ở bất kỳ file
      client-side nào
- [ ] .env không bị commit (kiểm tra git log)
- [ ] Rate limit hoạt động đúng (test bằng script gửi nhiều request liên tục)
- [ ] Unique constraint vote hoạt động đúng (test gửi 2 vote trùng
      fingerprint+ip+submission)
- [ ] Chặn tự vote hoạt động đúng (test fingerprint trùng
      submitter_fingerprint_hash)
- [ ] Slug không đoán được / không sequential (không phải id=1,2,3...)
- [ ] Test vote qua user agent giả lập in-app browser (Facebook/TikTok
      webview) — xác nhận KHÔNG bị chặn như Google OAuth từng gặp

## Việc CẦN làm ở bước này

1. Implement từng mục trên
2. Viết test cho từng mục bảo mật (xem 07_TESTING.md)
3. Báo cáo checklist đã pass/fail, chờ xác nhận
