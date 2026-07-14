import Link from 'next/link';
import type { Submission } from '@/lib/types';

type SubmissionCardProps = {
  submission: Submission;
  rank?: number;
};

export function SubmissionCard({ submission, rank }: SubmissionCardProps) {
  return (
    <article className={rank === 1 ? 'submission-card submission-card-first' : 'submission-card'}>
      <p className="submission-meta">
        {rank ? `Hạng ${rank} · ` : null}
        {submission.vote_count.toLocaleString('en-US')} lượt bình chọn
      </p>
      <h3 className="submission-slogan">&ldquo;{submission.slogan}&rdquo;</h3>
      <p>{submission.explanation}</p>
      <p className="submission-meta">Tác giả: {submission.full_name}</p>
      <Link href={`/entry/${submission.slug}`} className="button">
        Xem bài dự thi
      </Link>
    </article>
  );
}
