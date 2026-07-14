import 'server-only';
import { z } from 'zod';

const optionalEnvString = (schema: z.ZodString) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional());

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalEnvString(z.string().url()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalEnvString(z.string().min(1)),
  SUPABASE_SERVICE_ROLE_KEY: optionalEnvString(z.string().min(1)),
  HASH_SALT: optionalEnvString(z.string().min(16)),
  CAMPAIGN_TURNSTILE_SITE_KEY: optionalEnvString(z.string()),
  CAMPAIGN_TURNSTILE_SECRET_KEY: optionalEnvString(z.string()),
  NEXT_PUBLIC_TURNSTILE_ENABLED: z.string().default('false'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('https://greenrubycruises.com'),
  ALLOWED_ORIGIN: z.string().url().default('https://greenrubycruises.com'),
  RESEND_API_KEY: optionalEnvString(z.string().min(1)),
  EMAIL_FROM: optionalEnvString(z.string().min(1)),
  ADMIN_EMAILS: optionalEnvString(z.string().min(1)),
});

const parsed = serverEnvSchema.parse(process.env);

export const env = {
  supabaseUrl: parsed.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  supabaseServiceRoleKey: parsed.SUPABASE_SERVICE_ROLE_KEY ?? '',
  hashSalt: parsed.HASH_SALT ?? 'local-development-hash-salt-change-me',
  turnstileSiteKey: parsed.CAMPAIGN_TURNSTILE_SITE_KEY ?? '',
  turnstileSecretKey: parsed.CAMPAIGN_TURNSTILE_SECRET_KEY ?? '',
  turnstileEnabled: parsed.NEXT_PUBLIC_TURNSTILE_ENABLED === 'true',
  siteUrl: parsed.NEXT_PUBLIC_SITE_URL,
  allowedOrigin: parsed.ALLOWED_ORIGIN,
  resendApiKey: parsed.RESEND_API_KEY ?? '',
  emailFrom: parsed.EMAIL_FROM ?? 'Green Ruby Slogan <slogan@greenrubycruises.com>',
  adminEmails: (parsed.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
};

export function requireServerEnv() {
  const missing = [
    ['NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ['SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY],
    ['HASH_SALT', process.env.HASH_SALT],
  ].filter(([, value]) => !value);

  if (missing.length > 0) {
    throw new Error(`Thiếu biến môi trường bắt buộc: ${missing.map(([key]) => key).join(', ')}`);
  }
}
