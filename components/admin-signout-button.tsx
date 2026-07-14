'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AdminSignoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase?.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    });
  }

  return (
    <button type="button" className="button" disabled={isPending} onClick={signOut}>
      {isPending ? 'Đang đăng xuất' : 'Đăng xuất'}
    </button>
  );
}
