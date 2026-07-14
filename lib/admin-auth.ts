import 'server-only';
import { env } from '@/lib/env';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  return env.adminEmails.includes(email.toLowerCase());
}

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getAdminUser() {
  const user = await getCurrentUser();

  if (!user || !isAdminEmail(user.email)) {
    return null;
  }

  return user;
}
