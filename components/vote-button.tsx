'use client';

import { useCallback, useState, useSyncExternalStore, useTransition } from 'react';
import { IconCheck, IconHeart, IconShieldCheck } from '@tabler/icons-react';
import { getFingerprint } from '@/lib/fingerprint';
import { TurnstileWidget } from '@/components/turnstile-widget';

type VoteButtonProps = {
  submissionId: string;
  initialVotes: number;
  turnstileEnabled?: boolean;
  turnstileSiteKey?: string;
};

export function VoteButton({
  submissionId,
  initialVotes,
  turnstileEnabled = false,
  turnstileSiteKey = '',
}: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [status, setStatus] = useState<'idle' | 'voted' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [needsVerify, setNeedsVerify] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [widgetKey, setWidgetKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const storageKey = `greenruby-vote-${submissionId}`;
  const requireTurnstile = turnstileEnabled && Boolean(turnstileSiteKey);
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

  function resetVerify() {
    setNeedsVerify(false);
    setTurnstileToken('');
    setWidgetKey((current) => current + 1);
  }

  function beginVote() {
    setMessage('');
    setStatus('idle');

    if (requireTurnstile) {
      setNeedsVerify(true);
      setTurnstileToken('');
      setWidgetKey((current) => current + 1);
      return;
    }

    submitVote();
  }

  function submitVote(token = turnstileToken) {
    if (requireTurnstile && !token) {
      setStatus('error');
      setMessage('Hãy hoàn tất xác thực Cloudflare trước khi bình chọn.');
      return;
    }

    startTransition(async () => {
      setMessage('');

      try {
        const fingerprint = await getFingerprint();
        const response = await fetch('/slogan/api/votes', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            submission_id: submissionId,
            fingerprint,
            turnstileToken: token || undefined,
          }),
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          setStatus('error');
          setMessage(payload.error ?? 'Không thể ghi nhận bình chọn.');
          setTurnstileToken('');
          setWidgetKey((current) => current + 1);
          return;
        }

        window.localStorage.setItem(storageKey, '1');
        setVotes((current) => current + 1);
        setStatus('voted');
        setNeedsVerify(false);
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

      {!needsVerify || isVoted ? (
        <button
          className="button button-primary"
          type="button"
          onClick={beginVote}
          disabled={isPending || isVoted}
        >
          {isVoted ? <IconCheck size={18} aria-hidden="true" /> : <IconHeart size={18} aria-hidden="true" />}
          {isPending ? 'Đang ghi nhận' : isVoted ? 'Đã bình chọn' : 'Bình chọn'}
        </button>
      ) : (
        <div className="form-grid">
          <p className="field-helper">Hoàn tất xác thực Cloudflare để gửi bình chọn.</p>
          <TurnstileWidget
            key={widgetKey}
            enabled={requireTurnstile}
            siteKey={turnstileSiteKey}
            onToken={setTurnstileToken}
            onExpire={() => setTurnstileToken('')}
          />
          <div className="hero-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={() => submitVote()}
              disabled={isPending || !turnstileToken}
            >
              <IconShieldCheck size={18} aria-hidden="true" />
              {isPending ? 'Đang xác thực' : 'Xác thực và bình chọn'}
            </button>
            <button className="button" type="button" onClick={resetVerify} disabled={isPending}>
              Huỷ
            </button>
          </div>
        </div>
      )}

      {messageText ? (
        <p className="toast-line" data-tone={status === 'error' ? 'error' : 'success'}>
          {messageText}
        </p>
      ) : null}
    </div>
  );
}
