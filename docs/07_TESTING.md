# Testing — Yêu cầu bắt buộc

## Stack test

- Unit/integration: Vitest hoặc Jest (Cursor chọn 1, giải thích lý do)
- E2E: Playwright
- Test database: Supabase local (dùng Supabase CLI `supabase start`
  chạy local Postgres qua Docker, KHÔNG test trên production project)

## Unit tests bắt buộc

- Hàm đếm số từ tiếng Việt (slogan ≤ 10 từ, explanation ≤ 50 từ) —
  test với chuỗi có dấu, không dấu, nhiều khoảng trắng liên tiếp
- Hàm generate slug — test tính duy nhất, test không trùng khi gọi
  liên tục nhanh
- Hàm hash IP / hash fingerprint — test output ổn định, không reverse được

## Integration tests bắt buộc (dùng Supabase local)

- Request submission thành công khi form hợp lệ → tạo row
  `pending_submissions` và gửi OTP
- Confirm OTP đúng mã → tạo row `submissions` chính thức với
  `status = 'pending'`, xoá pending, trả slug
- Confirm OTP sai mã → tăng `verify_attempts`, báo lỗi rõ ràng
- Confirm OTP quá 5 lần hoặc pending hết hạn → báo lỗi, không tạo
  submission
- Rate limit gửi OTP: gửi quá 3 lần/email/giờ → chặn
- Request submission thất bại khi: email đã có bài chính thức, sai
  phase, vượt giới hạn từ, chưa chọn kênh follow
- Vote thành công khi đủ điều kiện (đúng phase, chưa vote submission
  này, không tự vote)
- Vote thất bại khi: tự vote bài mình (fingerprint trùng
  submitter_fingerprint_hash), vote trùng (fingerprint+ip+submission
  đã tồn tại), sai phase, vượt rate limit
- RLS: thử query trực tiếp bằng anon key, xác nhận không đọc được bài
  pending/rejected của người khác, không tự update submission người
  khác, không đọc được bảng votes trực tiếp

## E2E tests bắt buộc (Playwright)

- Luồng đầy đủ: vào trang chủ → bấm tham gia → điền toàn bộ form →
  submit → nhập mã OTP (lấy từ Supabase local test inbox hoặc mock) →
  redirect đến trang cá nhân → thấy đúng slogan vừa nhập
- Luồng vote: vào wall → chọn 1 bài → vote → thấy số vote tăng realtime
- Luồng chặn gian lận: thử vote 2 lần cùng fingerprint+IP → thấy thông
  báo lỗi đúng, không tăng vote_count lần 2
- Luồng chặn tự vote: tác giả (cùng fingerprint lúc submit) thử vote
  bài của chính mình → bị chặn, thông báo rõ ràng
- Test vote qua user agent giả lập mobile in-app webview (Facebook/TikTok)
  — xác nhận luồng vote hoạt động bình thường, không bị chặn bởi bất
  kỳ cơ chế nào (khác với vấn đề Google OAuth từng gặp)

## Yêu cầu báo cáo

Sau khi viết xong test, chạy toàn bộ test suite và dán kết quả đầy đủ
(bao nhiêu pass, bao nhiêu fail, tên test fail nếu có) — KHÔNG được nói
"đã test xong" mà không có log cụ thể.

## Việc CẦN làm ở bước này

1. Setup Supabase local + test framework
2. Viết test theo danh sách trên
3. Chạy và dán full output
4. Nếu có test fail, sửa code cho đến khi pass hết, không được bỏ qua
   hoặc comment out test đang fail
