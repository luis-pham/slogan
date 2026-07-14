import type { SupabaseClient } from '@supabase/supabase-js';

type RateLimitOptions = {
  action: 'send_otp' | 'submit' | 'vote';
  key: string;
  ipHash?: string;
  limit: number;
  windowSeconds: number;
};

export async function checkRateLimit(
  supabase: SupabaseClient,
  options: RateLimitOptions,
) {
  const since = new Date(Date.now() - options.windowSeconds * 1000).toISOString();

  const { count, error: countError } = await supabase
    .from('rate_limit_events')
    .select('id', { count: 'exact', head: true })
    .eq('action', options.action)
    .eq('key', options.key)
    .gte('created_at', since);

  if (countError) {
    throw countError;
  }

  if ((count ?? 0) >= options.limit) {
    return { allowed: false, remaining: 0 };
  }

  const { error: insertError } = await supabase
    .from('rate_limit_events')
    .insert({
      action: options.action,
      key: options.key,
      ip_hash: options.ipHash ?? null,
    });

  if (insertError) {
    throw insertError;
  }

  return { allowed: true, remaining: options.limit - (count ?? 0) - 1 };
}
