# Thiết kế UI/UX — 5 màn hình

## Design tokens

Xem file 09_BRAND_ASSETS.md cho chi tiết chính xác màu/font/icon.
Tóm tắt nhanh:

- Border-radius: 0 (sharp corners) toàn bộ component — KHÔNG bo góc
- Icon: dùng @tabler/icons-react — KHÔNG dùng emoji trong code production
- Gold (#C8A84B) chỉ dùng cho: nút CTA chính, số liệu nổi bật, huy hiệu
  giải thưởng — KHÔNG dùng tràn lan trên nhiều element cùng lúc
- Mobile-first: thiết kế cho màn hình 375-430px trước, sau đó mở rộng
  responsive cho desktop

## Màn 1 — Trang chủ (`app/page.tsx`) (ĐÃ CẬP NHẬT — thêm 2 khối mới)

- Hero: tên chương trình, countdown realtime (dùng client component,
  tính từ `campaign_settings.submission_end`)
- Khối "Cơ cấu giải thưởng / Thể lệ" (thay thế section giải thưởng cũ)
- Khối "Bài dự thi nổi bật" (mới)
- 3 bước tham gia
- CTA "Tham gia ngay" → `/join`

### Khối "Cơ cấu giải thưởng / Thể lệ" (thay thế section giải thưởng cũ)

- Tab bar 2 tab: "Cơ cấu giải thưởng" (mặc định active) và "Thể lệ tham gia"
- Tab "Cơ cấu giải thưởng": giữ nguyên 5 prize card như thiết kế cũ
  (Giải Nhất 20tr, Giải Yêu Thích 20tr, Giải Nhì 10tr, Giải Ba 50%,
  20 Giải KK 30%)
- Tab "Thể lệ tham gia": danh sách điều khoản đánh số 01-06, nội dung
  lấy nguyên văn từ `docs/10_RULES_CONTENT.md` — mục "BẢN RÚT GỌN"
  (không tự viết lại)
- Cuối tab thể lệ: link "Xem đầy đủ thể lệ chi tiết →" → trỏ tới trang
  `/rules` (trang riêng chứa FULL thể lệ, dùng cho mục đích pháp lý —
  không rút gọn ở đây)
- Component: `components/prize-rules-tabs.tsx`, dùng React state đơn
  giản (useState) để switch tab, không dùng thư viện tab riêng

### Trang `/rules` (mới)

- Nội dung lấy nguyên văn từ `docs/10_RULES_CONTENT.md` — mục "BẢN ĐẦY
  ĐỦ" (14 mục, gồm 2 bảng: cơ cấu giải thưởng và tiêu chí chấm giải)
- Các đoạn `[điền ...]` giữ nguyên dấu ngoặc vuông làm placeholder,
  không tự bịa nội dung — chờ điền tay trước khi publish
- Có mục lục (anchor link) nhảy nhanh tới từng mục 1-14
- Không có tab hay animation — trang đọc tuyến tính, nền cream, chữ
  forest green, ưu tiên dễ đọc dễ tra cứu hơn thẩm mỹ
- Trang: `app/rules/page.tsx`

### Khối "Bài dự thi nổi bật" (mới — đặt ngay sau khối trên, trước
section 3 bước)

- Nền forest green (#0D2B1A), tương tự style section "3 bước tham gia"
- Tab bar 2 tab: "Mới nhất" (mặc định) / "Nhiều vote nhất"
- Hiển thị 3 submission card dạng rút gọn (chỉ slogan + tên tác giả +
  số vote), không hiện phần giải thích đầy đủ ở đây
- Data fetch: `getFeaturedSubmissions()` trong `lib/data/submissions.ts`
  gọi song song `getApprovedSubmissions('newest', 3)` và
  `getApprovedSubmissions('votes', 3)` (status='approved',
  flagged_for_review=false) ngay trên server component `app/page.tsx`,
  rồi truyền cả 2 danh sách xuống làm props — component
  `components/featured-submissions.tsx` chỉ xử lý việc chuyển tab
  (client component, useState), không tự fetch lại, để nhất quán với
  cách các trang khác trong dự án (Wall, Leaderboard) đang lấy dữ liệu
  qua service client trên server rồi truyền props xuống
- **Xử lý theo phase:**
  - Nếu `campaign_settings.phase === 'submission'`: vẫn hiện tab "Mới
    nhất" bình thường, nhưng tab "Nhiều vote nhất" hiện disabled/mờ
    kèm tooltip "Mở sau khi kết thúc nhận bài"
  - Nếu chưa có submission nào (`newest.length === 0 &&
    mostVoted.length === 0`): ẩn toàn bộ khối này, không hiện section
    trống
- CTA cuối khối: "Xem tất cả bài dự thi" → trỏ `/wall`
- Component: `components/featured-submissions.tsx`

## Màn 2 — Form dự thi (`app/join/page.tsx`)

- Bước 1: hiện toàn bộ form ngay, không cần login/xác thực trước:
  - Họ tên
  - Email
  - Checkbox chọn kênh đã follow (ít nhất 1, validate client + server)
  - Input slogan — đếm số TỪ tiếng Việt (không phải ký tự), giới hạn
    10 từ, hiển thị realtime "X/10 chữ"
  - Textarea giải thích — giới hạn 50 từ, hiển thị realtime
- Bước 2: bấm "Gửi bài dự thi" → validate client → gọi
  `/api/submissions/request` → server lưu pending và gửi OTP
- Bước 3: hiện ô nhập mã 6 số + nút "Gửi lại mã" (disable 60 giây) +
  nút "Quay lại sửa thông tin" (giữ nguyên dữ liệu đã điền trong state)
- Bước 4: nhập đúng mã → gọi `/api/submissions/confirm` → server tạo
  submission chính thức → redirect `/entry/[slug]`
- UI step bar hiển thị 2 bước: "Điền thông tin" → "Xác nhận email"

## Màn 3 — Trang cá nhân bài dự thi (`app/entry/[slug]/page.tsx`)

- Server component fetch submission theo slug
- Hiển thị: slogan, giải thích, tên tác giả, số vote hiện tại (realtime
  qua Supabase subscription), vị trí xếp hạng
- Nút Vote — KHÔNG yêu cầu đăng nhập, chỉ tính fingerprint ngầm, disable nếu:
  - Đã vote submission này rồi (kiểm tra qua fingerprint đã lưu ở
    localStorage hoặc gọi API kiểm tra) → hiện "Đã vote"
  - Fingerprint hiện tại trùng `submitter_fingerprint_hash` → disable,
    ghi chú "Không thể tự vote"
- 3 nút share (Facebook, TikTok, Instagram) — dùng Web Share API cho
  mobile, fallback copy link cho desktop
- Ô copy link kèm slug URL đầy đủ

## Màn 4 — Public wall + Leaderboard (`app/wall/page.tsx`)

- Banner trạng thái phase (submission/voting/ended) lấy từ
  `campaign_settings`
- Filter: Nhiều vote nhất / Mới nhất — query Supabase với order by tương ứng
- Danh sách submission dạng card, phân trang (Next.js server component
  + cursor pagination, KHÔNG load hết 1 lần nếu số bài lớn)
- Sidebar/section leaderboard top 10 — dùng Supabase Realtime subscription
  để tự động cập nhật không cần refresh trang

## Màn 5 — Kết quả (`app/results/page.tsx`)

- Chỉ hiện khi `campaign_settings.phase = 'ended'`
- Query submission với `is_winner = true` (đánh dấu thủ công qua
  Supabase Dashboard sau khi BGK quyết định — KHÔNG tự động hoá việc
  chọn giải BGK)
- Hiển thị Giải Nhất/Nhì/Ba/Yêu Thích/20 KK theo đúng thiết kế mockup
  đã duyệt trước đó

## Responsive

- Áp dụng đúng theo mockup mobile đã duyệt (5 màn hình mobile-first)
  — tham khảo file ảnh/link mockup được cung cấp riêng khi bắt đầu code

## Việc CẦN làm ở bước này

1. Liệt kê danh sách component sẽ tạo (component tree)
2. Xác nhận cách xử lý đếm "10 chữ tiếng Việt" — đề xuất thư viện tách
   từ tiếng Việt hoặc quy tắc split(' ') đơn giản, giải thích trade-off
3. Báo cáo, chờ xác nhận trước khi code
