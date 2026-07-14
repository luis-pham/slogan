import Link from 'next/link';
import { Leaderboard } from '@/components/leaderboard';
import { PhaseBanner } from '@/components/phase-banner';
import { SubmissionCard } from '@/components/submission-card';
import { getCampaignSettings } from '@/lib/data/campaign';
import { getApprovedSubmissions, getLeaderboard } from '@/lib/data/submissions';

type WallPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function WallPage({ searchParams }: WallPageProps) {
  const params = await searchParams;
  const order = params.order === 'newest' ? 'newest' : 'votes';
  const [campaign, submissions, leaderboard] = await Promise.all([
    getCampaignSettings(),
    getApprovedSubmissions(order),
    getLeaderboard(),
  ]);
  const totalVotes = submissions.reduce((sum, submission) => sum + submission.vote_count, 0);

  return (
    <main className="section section-cream">
      <div className="page-frame wall-layout">
        <section>
          <div className="section-narrow">
            <h1 className="section-title">Danh sách dự thi.</h1>
            <p className="section-lede">
              Các bài đã duyệt sẽ hiển thị tại đây. Sắp xếp theo lượt bình chọn trong thời gian mở vote hoặc xem
              các bài mới nhất.
            </p>
          </div>
          <div className="stats-row" style={{ marginTop: 'var(--space-xl)' }}>
            <div className="stat-cell">
              <strong className="stat-number">{submissions.length}</strong>
              <span className="stat-label">Bài đã duyệt</span>
            </div>
            <div className="stat-cell">
              <strong className="stat-number">{totalVotes}</strong>
              <span className="stat-label">Tổng bình chọn</span>
            </div>
          </div>
          <div className="hero-actions" style={{ marginTop: 'var(--space-lg)' }}>
            <Link className={order === 'votes' ? 'button button-dark' : 'button'} href="/wall?order=votes">
              Nhiều bình chọn nhất
            </Link>
            <Link className={order === 'newest' ? 'button button-dark' : 'button'} href="/wall?order=newest">
              Mới nhất
            </Link>
          </div>
          <div className="submission-grid" style={{ marginTop: 'var(--space-xl)' }}>
            {submissions.map((submission, index) => (
              <SubmissionCard key={submission.id} rank={order === 'votes' ? index + 1 : undefined} submission={submission} />
            ))}
          </div>
        </section>
        <div className="form-grid">
          <PhaseBanner campaign={campaign} />
          <Leaderboard entries={leaderboard} />
        </div>
      </div>
    </main>
  );
}
