# Kiến trúc & Tech Stack

## Tech stack bắt buộc

- Framework: Next.js 14+ (App Router), TypeScript
- Styling: TailwindCSS (dùng design tokens ở file 09_BRAND_ASSETS.md)
- Database + Auth: Supabase (Postgres + Supabase Auth với Email OTP —
  xem 03_AUTH_VERIFICATION.md, KHÔNG dùng Google OAuth)
- Realtime leaderboard: Supabase Realtime (Postgres changes subscription)
  — KHÔNG cần Redis riêng vì Supabase đã có realtime built-in qua
  logical replication
- Icon: Tabler Icons (@tabler/icons-react)
- Fingerprint: @fingerprintjs/fingerprintjs (bản open-source, community)
- Hosting: Self-host bằng Docker container riêng trên VPS hiện tại,
  port 3001, đứng sau Nginx reverse proxy

## Nguyên tắc tách biệt bắt buộc

- Repo riêng: `greenruby-slogan` (thư mục riêng, git repo riêng —
  không phải submodule hay subfolder của cms-develop)
- Supabase project riêng hoàn toàn (không dùng chung project Supabase
  nào khác nếu công ty đã có sẵn dự án khác)
- Docker container riêng, network Docker riêng (không join network
  `green-ruby-private` hiện tại)
- Next.js basePath: '/slogan' để chạy đúng dưới sub-path domain chính

## next.config.js bắt buộc có

```js
module.exports = {
  basePath: '/slogan',
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' }
    ]
  }
}
```

## Routing tổng thể (tham khảo, KHÔNG sửa Nginx production — chỉ ghi
lại để dev biết bối cảnh, việc sửa Nginx server thật sẽ do người quản
trị VPS thực hiện thủ công sau khi review)

```
greenrubycruises.com/         → Laravel app hiện tại (port 8082, không đụng)
greenrubycruises.com/slogan   → Next.js app mới (port 3001)
```

## Cấu trúc thư mục đề xuất

```
greenruby-slogan/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Màn 1: Trang chủ
│   ├── join/page.tsx                # Màn 2: Form dự thi
│   ├── entry/[slug]/page.tsx        # Màn 3: Trang cá nhân bài dự thi
│   ├── wall/page.tsx                 # Màn 4: Public wall + leaderboard
│   ├── results/page.tsx              # Màn 5: Kết quả
│   ├── api/
│   │   ├── submissions/request/route.ts
│   │   ├── submissions/confirm/route.ts
│   │   └── votes/route.ts
├── components/
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # browser client
│   │   ├── server.ts     # server client (service role, chỉ dùng server-side)
│   │   └── middleware.ts
│   ├── fingerprint.ts
│   └── validation.ts     # Zod schemas
├── supabase/
│   └── migrations/        # SQL migration files, KHÔNG chạy tự động lên
│                           # production, chỉ tạo file, chờ tôi review
├── tests/
├── docker-compose-slogan.yml
├── Dockerfile
├── .env.example
└── .gitignore
```

## Việc CẦN làm ở bước này (chỉ đọc/lên kế hoạch)

1. Xác nhận đã hiểu toàn bộ nguyên tắc tách biệt
2. Đề xuất danh sách package.json dependencies cụ thể (kèm version)
3. Viết .env.example với tên biến (KHÔNG điền giá trị thật):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (chỉ dùng server-side, không bao giờ
     expose ra client)
   - HASH_SALT (dùng để hash IP/fingerprint trước khi lưu DB)
   - CAMPAIGN_TURNSTILE_SITE_KEY / CAMPAIGN_TURNSTILE_SECRET_KEY
     (Cloudflare Turnstile, có thể để trống nếu chưa bật)
4. Dừng lại, báo cáo kế hoạch, chờ xác nhận trước khi tạo bất kỳ file nào
