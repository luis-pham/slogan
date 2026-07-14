'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CampaignPhase, Submission } from '@/lib/types';

type FeaturedSubmissionsProps = {
  newest: Submission[];
  mostVoted: Submission[];
  phase: CampaignPhase;
};

type TabKey = 'newest' | 'votes';

export function FeaturedSubmissions({ newest, mostVoted, phase }: FeaturedSubmissionsProps) {
  const votesLocked = phase === 'submission';
  const [tab, setTab] = useState<TabKey>('newest');
  const activeTab = votesLocked ? 'newest' : tab;
  const entries = activeTab === 'newest' ? newest : mostVoted;

  if (newest.length === 0 && mostVoted.length === 0) {
    return null;
  }

  return (
    <section className="section section-forest">
      <div className="page-frame section-stack">
        <div className="section-narrow">
          <h2 className="section-title">Bài dự thi nổi bật.</h2>
          <p className="section-lede">Một vài slogan đã được duyệt gần đây — xem toàn bộ tại bảng bài dự thi.</p>
        </div>

        <div className="step-bar step-bar-two" role="tablist" aria-label="Sắp xếp bài dự thi nổi bật">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'newest'}
            className={activeTab === 'newest' ? 'step-bar-item step-bar-item-active' : 'step-bar-item'}
            onClick={() => setTab('newest')}
          >
            Mới nhất
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'votes'}
            aria-disabled={votesLocked}
            title={votesLocked ? 'Mở sau khi kết thúc nhận bài' : undefined}
            className={activeTab === 'votes' ? 'step-bar-item step-bar-item-active' : 'step-bar-item'}
            onClick={() => {
              if (!votesLocked) setTab('votes');
            }}
          >
            Nhiều vote nhất
          </button>
        </div>

        <div className="submission-grid" role="tabpanel">
          {entries.map((submission) => (
            <article className="submission-card" key={submission.id}>
              <h3 className="submission-slogan">&ldquo;{submission.slogan}&rdquo;</h3>
              <p className="submission-meta">
                {submission.full_name} · {submission.vote_count.toLocaleString('en-US')} lượt bình chọn
              </p>
            </article>
          ))}
        </div>

        <Link className="button button-primary" href="/wall">
          Xem tất cả bài dự thi
        </Link>
      </div>
    </section>
  );
}
