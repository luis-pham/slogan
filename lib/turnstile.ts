import { env } from '@/lib/env';

type TurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
};

export async function verifyTurnstile(token?: string) {
  if (!env.turnstileEnabled) {
    return { ok: true };
  }

  if (!token || !env.turnstileSecretKey) {
    return { ok: false, message: 'Cần xác thực Turnstile.' };
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: env.turnstileSecretKey,
      response: token,
    }),
  });

  const payload = (await response.json()) as TurnstileResponse;
  return payload.success
    ? { ok: true }
    : { ok: false, message: payload['error-codes']?.join(', ') || 'Xác thực Turnstile thất bại.' };
}
