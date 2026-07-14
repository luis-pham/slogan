# Green Ruby Slogan Contest — Hướng dẫn thực hiện cho Cursor

## QUY TẮC BẮT BUỘC — ĐỌC TRƯỚC KHI LÀM BẤT KỲ VIỆC GÌ

1. Đây là dự án ĐỘC LẬP HOÀN TOÀN, tách biệt khỏi codebase Laravel hiện tại
   (cms-develop). TUYỆT ĐỐI KHÔNG:
   - Sửa, xoá, hoặc tạo file nào trong thư mục cms-develop hiện tại
   - Dùng chung database, Redis, network Docker với stack hiện tại
   - Thêm route/middleware vào ứng dụng Laravel hiện tại

2. Thực hiện đúng theo trình tự các file trong thư mục này:
   - 01_ARCHITECTURE.md — kiến trúc & tech stack
   - 02_DATABASE_SCHEMA.md — schema Supabase
   - 03_AUTH_VERIFICATION.md — Email OTP (submit) + fingerprint (vote)
   - 04_PAGES_COMPONENTS.md — thiết kế UI/UX 5 màn hình
   - 05_API_ROUTES.md — API endpoints
   - 06_SECURITY.md — bảo mật & chống gian lận
   - 07_TESTING.md — yêu cầu test
   - 08_DEPLOYMENT.md — Docker & Nginx
   - 09_BRAND_ASSETS.md — design tokens, font, icon chính xác

3. QUY TRÌNH BẮT BUỘC cho MỌI file trên:
   a. Đọc file tương ứng
   b. Viết ra kế hoạch thực hiện (không code) — liệt kê file sẽ tạo,
      thư viện sẽ dùng, thay đổi dự kiến
   c. DỪNG LẠI và chờ tôi xác nhận kế hoạch
   d. Chỉ code sau khi tôi gõ "OK, làm đi"
   e. Sau khi code xong, báo cáo: file nào đã tạo, test nào đã chạy,
      test nào PASS/FAIL

4. Không tự ý chạy `docker compose up`, không tự ý deploy, không tự ý
   chạy migration lên Supabase production — luôn hỏi trước.

5. Không hard-code bất kỳ secret/API key nào trong code. Tất cả qua
   biến môi trường (.env), và .env KHÔNG được commit vào git
   (xác nhận .gitignore có .env trước khi bắt đầu).

## MỤC TIÊU DỰ ÁN

Xây dựng module cuộc thi sáng tác slogan tại greenrubycruises.com/slogan,
gồm 5 màn hình: Trang chủ, Form dự thi, Trang cá nhân bài dự thi,
Public Wall + Leaderboard, Trang kết quả.

## GHI CHÚ QUAN TRỌNG VỀ AUTH (đã điều chỉnh)

Dự án này KHÔNG dùng Google OAuth. Xác thực dùng Email OTP (chỉ cho bước
submit) và browser fingerprint + IP (cho bước vote, không cần đăng nhập).
Lý do chi tiết nằm trong file 03_AUTH_VERIFICATION.md — đọc kỹ trước khi
code phần auth.

Bắt đầu bằng cách đọc 01_ARCHITECTURE.md và báo cáo lại kế hoạch trước
khi làm bất kỳ điều gì.
