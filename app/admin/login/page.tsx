import { redirect } from 'next/navigation';
import { AdminLoginButton } from '@/components/admin-login-button';
import { AdminSignoutButton } from '@/components/admin-signout-button';
import { getCurrentUser, isAdminEmail } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  let user;
  let configError = '';

  try {
    user = await getCurrentUser();
  } catch (error) {
    user = null;
    configError = error instanceof Error ? error.message : 'Không thể kết nối Supabase.';
  }

  if (user && isAdminEmail(user.email)) {
    redirect('/admin');
  }

  return (
    <main className="section section-cream">
      <div className="page-frame section-stack">
        <div className="section-narrow">
          <h1 className="section-title">Quản trị chương trình.</h1>
          <p className="section-lede">Đăng nhập bằng tài khoản Google được cấp quyền để xem số liệu tham gia.</p>
        </div>
        <div className="form-panel">
          {configError ? (
            <p className="toast-line" data-tone="error">
              {configError}
            </p>
          ) : user ? (
            <div className="form-grid">
              <p className="field-helper field-helper-error">
                Tài khoản {user.email} chưa được cấp quyền truy cập trang quản trị.
              </p>
              <AdminSignoutButton />
            </div>
          ) : (
            <AdminLoginButton />
          )}
        </div>
      </div>
    </main>
  );
}
