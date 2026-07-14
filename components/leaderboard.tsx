'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { LeaderboardEntry } from '@/lib/types';

type LeaderboardProps = {
  entries: LeaderboardEntry[];
};

export function Leaderboard({ entries }: LeaderboardProps) {
  const [rows, setRows] = useState(entries);
  const maxVotes = Math.max(1, ...rows.map((entry) => entry.vote_count));

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return undefined;

    const channel = supabase
      .channel('leaderboard-submissions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'submissions' },
        () => {
          setRows((current) => [...current].sort((a, b) => b.vote_count - a.vote_count));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <aside className="leaderboard-panel">
      <h2 className="leaderboard-title">Bảng xếp hạng</h2>
      <ol className="leaderboard-list">
        {rows.slice(0, 10).map((entry, index) => (
          <li className="leaderboard-row" key={entry.id}>
            <div className="leaderboard-row-head">
              <span className="leaderboard-rank">{index + 1}</span>
              <Link href={`/entry/${entry.slug}`}>{entry.slogan}</Link>
              <strong>{entry.vote_count}</strong>
            </div>
            <div className="progress-track" aria-hidden="true">
              <div className="progress-fill" style={{ width: `${Math.max(6, (entry.vote_count / maxVotes) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
