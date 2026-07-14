# Green Ruby Slogan Contest

Independent Next.js app for `greenrubycruises.com/slogan`.

## Boundaries

- Do not place this project inside `cms-develop`.
- Do not use the Laravel database, Redis, or Docker network.
- Do not commit `.env`, `.env.local`, or `.env.production`.
- Do not run Supabase production migrations without review.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://127.0.0.1:3000/slogan`.

## Supabase

Create a separate Supabase project, then review and apply:

```bash
supabase db push
```

The migration files live in `supabase/migrations/`. The `seed.sql` file is sample local data only.

## Required Environment

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
HASH_SALT=
CAMPAIGN_TURNSTILE_SITE_KEY=
CAMPAIGN_TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_ENABLED=false
NEXT_PUBLIC_SITE_URL=https://greenrubycruises.com
ALLOWED_ORIGIN=https://greenrubycruises.com
```

`SUPABASE_SERVICE_ROLE_KEY` and `HASH_SALT` are server-only. Never import them in client components.

## Deploy

Build and run as its own container:

```bash
docker compose -f docker-compose-slogan.yml up -d --build
docker logs greenruby-slogan-app
```

Nginx rule for the VPS administrator:

```nginx
location ^~ /slogan {
  proxy_pass http://127.0.0.1:3001;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_buffering off;
}
```

Rollback:

```bash
docker compose -f docker-compose-slogan.yml down
git checkout <previous-commit>
docker compose -f docker-compose-slogan.yml up -d --build
```

## Test

```bash
npm run typecheck
npm run test
npm run build
```

Run the standalone production server locally:

```bash
PORT=3001 HOSTNAME=127.0.0.1 npm start
```

Open `http://127.0.0.1:3001/slogan`.

Playwright uses port 3001 by default:

```bash
npm run test:e2e
```

Or target the dev server on port 3000 explicitly:

```bash
npm run dev
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000/slogan/ npm run test:e2e
```
