# Deployment

## Docker

`Dockerfile` — multi-stage build, dùng `output: 'standalone'` của Next.js
để image gọn:

```dockerfile
FROM node:20-alpine AS base
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

`docker-compose-slogan.yml`:

```yaml
version: '3.8'

networks:
  slogan-net:
    driver: bridge

services:
  slogan-app:
    build: .
    container_name: greenruby-slogan-app
    restart: unless-stopped
    ports:
      - "3001:3000"
    networks:
      - slogan-net
    env_file:
      - .env.production
```

Lưu ý: KHÔNG cần container database riêng vì dùng Supabase (managed,
external). `.env.production` chứa connection string Supabase — KHÔNG
commit file này vào git.

## Nginx (chỉ để tham khảo — người quản trị VPS sẽ tự áp dụng, Cursor
không tự sửa Nginx server thật)

```nginx
location ^~ /slogan {
  proxy_pass http://127.0.0.1:3001;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_buffering off;
}
```

## Quy trình deploy đề xuất

1. Build và test local trước
2. Push code lên repo `greenruby-slogan` riêng
3. SSH vào VPS, pull code vào thư mục riêng (không đụng thư mục cms-develop)
4. Chạy `docker compose -f docker-compose-slogan.yml up -d --build`
5. Kiểm tra container chạy đúng qua `docker logs greenruby-slogan-app`
6. Người quản trị VPS thêm rule Nginx ở trên, reload Nginx
   (`nginx -t && nginx -s reload`)
7. Test truy cập `greenrubycruises.com/slogan` từ bên ngoài

## Rollback

```bash
docker compose -f docker-compose-slogan.yml down
git checkout <previous-commit>
docker compose -f docker-compose-slogan.yml up -d --build
```

## Việc CẦN làm ở bước này

1. Tạo Dockerfile, docker-compose-slogan.yml, .env.example
2. KHÔNG chạy docker compose up thật — chỉ tạo file, báo cáo, chờ tôi
   tự chạy hoặc xác nhận trước
3. Viết README.md ngắn hướng dẫn deploy cho người sau này maintain
