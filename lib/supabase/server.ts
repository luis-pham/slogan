import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

function hasBrowserSupabaseConfig() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

function hasServiceSupabaseConfig() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export async function createServerSupabaseClient() {
  if (!hasBrowserSupabaseConfig()) {
    throw new Error('Chưa cấu hình biến môi trường public của Supabase.');
  }

  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies; Route Handlers can.
        }
      },
    },
  });
}

export function createServiceSupabaseClient() {
  if (!hasServiceSupabaseConfig()) {
    throw new Error('Chưa cấu hình biến môi trường service của Supabase.');
  }

  return createSupabaseClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
