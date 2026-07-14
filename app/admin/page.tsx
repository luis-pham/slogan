import { redirect } from 'next/navigation';
import { AdminSignoutButton } from '@/components/admin-signout-button';
import { getAdminUser } from '@/lib/admin-auth';
import { getAllSubmissionsForAdmin } from '@/lib/data/submissions';
import type { Submission } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

const statusLabels: Record<Submission['status'], string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let user: User | null;
  let configError = '';

  try {
    user = await getAdminUser();
  } catch (error) {
    user = null;
    configError = error instanceof Error ? error.message : 'Không thể kết nối Supabase.';
  }

  if (configError) {
    return (
      <main className="section section-cream">
        <div className="page-frame section-stack">
          <p className="toast-line" data-tone="error">
            {configError}
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    redirect('/admin/login');
  }

  let submissions: Submission[] = [];
  let loadError = '';

  try {
    submissions = await getAllSubmissionsForAdmin();
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Không thể tải dữ liệu.';
  }

  const totalVotes = submissions.reduce((sum, submission) => sum + submission.vote_count, 0);
  const countByStatus = {
    pending: submissions.filter((submission) => submission.status === 'pending').length,
    approved: submissions.filter((submission) => submission.status === 'approved').length,
    rejected: submissions.filter((submission) => submission.status === 'rejected').length,
  };

  return (
    <main className="section section-cream">
      <div className="page-frame section-stack">
        <div className="nav-edge" style={{ minHeight: 'auto' }}>
          <div className="section-narrow">
            <h1 className="section-title">Quản trị chương trình.</h1>
            <p className="section-lede">Đăng nhập với {user.email}.</p>
          </div>
          <AdminSignoutButton />
        </div>

        {loadError ? (
          <p className="toast-line" data-tone="error">
            {loadError}
          </p>
        ) : (
          <>
            <div className="stat-grid">
              <div className="stat-cell">
                <strong className="stat-number">{submissions.length}</strong>
                <span className="stat-label">Tổng người tham gia</span>
              </div>
              <div className="stat-cell">
                <strong className="stat-number">{countByStatus.approved}</strong>
                <span className="stat-label">Đã duyệt</span>
              </div>
              <div className="stat-cell">
                <strong className="stat-number">{totalVotes}</strong>
                <span className="stat-label">Tổng lượt bình chọn</span>
              </div>
            </div>
            <p className="submission-meta">
              Chờ duyệt: {countByStatus.pending} · Từ chối: {countByStatus.rejected}
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table className="rules-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Slogan</th>
                    <th>Trạng thái</th>
                    <th>Lượt vote</th>
                    <th>Gửi lúc</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.full_name}</td>
                      <td>{submission.email}</td>
                      <td>&ldquo;{submission.slogan}&rdquo;</td>
                      <td>{statusLabels[submission.status]}</td>
                      <td>{submission.vote_count}</td>
                      <td>{new Date(submission.created_at).toLocaleString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
