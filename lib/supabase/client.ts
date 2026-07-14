'use client';

import { createBrowserClient } from '@supabase/ssr';
import { publicEnv } from '@/lib/public-env';

export function createClient() {
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    return null;
  }

  return createBrowserClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey);
}
