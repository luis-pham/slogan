'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { publicEnv } from '@/lib/public-env';

export function AdminLoginButton() {
  const [error, setError] = useState('');

  async function signIn() {
    setError('');
    const supabase = createClient();

    if (!supabase) {
      setError('Chưa cấu hình Supabase cho môi trường này.');
      return;
    }

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${publicEnv.siteUrl}/slogan/admin/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  return (
    <div className="form-grid">
      <button type="button" className="button button-primary" onClick={signIn}>
        Đăng nhập bằng Google
      </button>
      {error ? <p className="field-helper field-helper-error">{error}</p> : null}
    </div>
  );
}
