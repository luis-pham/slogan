import { notFound } from 'next/navigation';
import { Leaderboard } from '@/components/leaderboard';
import { ShareButtons } from '@/components/share-buttons';
import { VoteButton } from '@/components/vote-button';
import { getLeaderboard, getSubmissionBySlug } from '@/lib/data/submissions';
import { env } from '@/lib/env';

type EntryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: EntryPageProps) {
  const { slug } = await params;
  const submission = await getSubmissionBySlug(slug);

  return {
    title: submission ? `${submission.slogan} | Slogan Green Ruby` : 'Bài dự thi Slogan Green Ruby',
    description: submission?.explanation,
  };
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { slug } = await params;
  const submission = await getSubmissionBySlug(slug);

  if (!submission) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const entryUrl = `${env.siteUrl.replace(/\/$/, '')}/slogan/entry/${submission.slug}`;
  const isPending = submission.status === 'pending';
  const canVote = submission.status === 'approved';

  return (
    <main>
      <section className="entry-hero">
        <div className="page-frame entry-layout">
          <article className="hero-copy">
            <p className="submission-meta">Bài dự thi của {submission.full_name}</p>
            <h1 className="entry-slogan">&ldquo;{submission.slogan}&rdquo;</h1>
            {isPending ? (
              <p className="field-helper">
                Bài dự thi đã được ghi nhận và đang chờ hiển thị công khai.
              </p>
            ) : (
              <p className="field-helper">
                Bình chọn đang mở đến hết 31/07 — chia sẻ link bài của bạn để nhận vote ngay.
              </p>
            )}
          </article>
          <aside className="vote-card vote-button-wrap">
            {canVote ? (
              <VoteButton
                initialVotes={submission.vote_count}
                submissionId={submission.id}
                turnstileEnabled={env.turnstileEnabled}
                turnstileSiteKey={env.turnstileSiteKey}
              />
            ) : (
              <p className="field-helper">Chưa thể bình chọn cho bài này.</p>
            )}
          </aside>
        </div>
      </section>

      <section className="section section-cream">
        <div className="page-frame entry-layout">
          <article className="form-grid">
            <div className="meaning-box">
              <strong>Ý nghĩa</strong>
              <p>{submission.explanation}</p>
            </div>
            <ShareButtons text={submission.slogan} url={entryUrl} />
          </article>
          <Leaderboard entries={leaderboard} />
        </div>
      </section>
    </main>
  );
}
