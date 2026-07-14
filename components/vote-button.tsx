'use client';

import { useCallback, useState, useSyncExternalStore, useTransition } from 'react';
import { IconCheck, IconHeart } from '@tabler/icons-react';
import { getFingerprint } from '@/lib/fingerprint';

type VoteButtonProps = {
  submissionId: string;
  initialVotes: number;
};

export function VoteButton({ submissionId, initialVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [status, setStatus] = useState<'idle' | 'voted' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const storageKey = `greenruby-vote-${submissionId}`;
  const subscribeToVoteStorage = useCallback(
    (onStoreChange: () => void) => {
      function handleStorage(event: StorageEvent) {
        if (event.key === storageKey) {
          onStoreChange();
        }
      }

      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    },
    [storageKey],
  );
  const getStoredVote = useCallback(() => window.localStorage.getItem(storageKey) === '1', [storageKey]);
  const hasStoredVote = useSyncExternalStore(subscribeToVoteStorage, getStoredVote, () => false);
  const isVoted = status === 'voted' || hasStoredVote;
  const messageText = message || (hasStoredVote ? 'Bạn đã bình chọn cho bài này.' : '');

  function vote() {
    startTransition(async () => {
      setMessage('');

      try {
        const fingerprint = await getFingerprint();
        const response = await fetch('/slogan/api/votes', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ submission_id: submissionId, fingerprint }),
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setStatus('error');
          setMessage(payload.error ?? 'Không thể ghi nhận bình chọn.');
          return;
        }

        window.localStorage.setItem(storageKey, '1');
        setVotes((current) => current + 1);
        setStatus('voted');
        setMessage('Đã ghi nhận bình chọn.');
      } catch {
        setStatus('error');
        setMessage('Yêu cầu bình chọn thất bại. Kiểm tra kết nối và thử lại.');
      }
    });
  }

  return (
    <div className="form-grid" aria-live="polite">
      <div>
        <p className="submission-meta">Lượt bình chọn hiện tại</p>
        <strong className="vote-count">{votes.toLocaleString('en-US')}</strong>
      </div>
      <button
        className="button button-primary"
        type="button"
        onClick={vote}
        disabled={isPending || isVoted}
      >
        {isVoted ? <IconCheck size={18} aria-hidden="true" /> : <IconHeart size={18} aria-hidden="true" />}
        {isPending ? 'Đang ghi nhận' : isVoted ? 'Đã bình chọn' : 'Bình chọn'}
      </button>
      {messageText ? (
        <p className="toast-line" data-tone={status === 'error' ? 'error' : 'success'}>
          {messageText}
        </p>
      ) : null}
    </div>
  );
}
