'use client';

import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { IconCheck, IconClock, IconInfoCircle } from '@tabler/icons-react';
import { getFingerprint } from '@/lib/fingerprint';
import { countVietnameseWords } from '@/lib/word-count';
import { WordCounter } from '@/components/word-counter';
import { TurnstileWidget } from '@/components/turnstile-widget';
import { ChannelFollowRow } from '@/components/channel-follow-row';
import { SOCIAL_CHANNELS } from '@/lib/constants';
import type { FollowedChannel } from '@/lib/types';

type JoinFormProps = {
  turnstileEnabled?: boolean;
  turnstileSiteKey?: string;
};

const stepItems = [
  ['1', 'Điền thông tin'],
  ['2', 'Xác nhận email'],
  ['3', 'Hoàn tất'],
];

const stepIndex = {
  details: 0,
  confirm: 1,
  success: 2,
};

export function JoinForm({ turnstileEnabled, turnstileSiteKey }: JoinFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [pendingId, setPendingId] = useState('');
  const [submittedSlug, setSubmittedSlug] = useState('');
  const [fullName, setFullName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [explanation, setExplanation] = useState('');
  const [followedChannels, setFollowedChannels] = useState<FollowedChannel[]>([]);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'error' | 'success' | 'idle'>('idle');
  const [isPending, startTransition] = useTransition();

  const formValid = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      email.trim().length > 0 &&
      countVietnameseWords(slogan) > 0 &&
      countVietnameseWords(slogan) <= 10 &&
      countVietnameseWords(explanation) >= 3 &&
      countVietnameseWords(explanation) <= 50 &&
      followedChannels.length > 0
    );
  }, [email, explanation, followedChannels.length, fullName, slogan]);

  useEffect(() => {
    if (step !== 'confirm' || resendCooldown <= 0) return undefined;

    const timer = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown, step]);

  function setFeedback(nextMessage: string, nextTone: 'error' | 'success') {
    setMessage(nextMessage);
    setTone(nextTone);
  }

  function requestOtp() {
    if (!formValid) {
      setFeedback('Biểu mẫu chưa hoàn tất. Kiểm tra giới hạn số chữ và chọn ít nhất một kênh đã theo dõi.', 'error');
      return;
    }

    startTransition(async () => {
      setMessage('');

      try {
        const fingerprint = await getFingerprint();
        const response = await fetch('/slogan/api/submissions/request', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            email,
            slogan,
            explanation,
            followed_channels: followedChannels,
            fingerprint,
            turnstileToken,
          }),
        });
        const payload = (await response.json()) as { error?: string; pending_id?: string; slug?: string };

        if (!response.ok || !payload.pending_id) {
          if (payload.slug) {
            router.push(`/entry/${payload.slug}`);
            return;
          }

          setFeedback(payload.error ?? 'Không thể gửi mã xác nhận. Kiểm tra lại biểu mẫu và thử lại.', 'error');
          return;
        }

        setPendingId(payload.pending_id);
        setOtpCode('');
        setResendCooldown(60);
        setFeedback(`Đã gửi mã xác nhận đến ${email}.`, 'success');
        setStep('confirm');
      } catch {
        setFeedback('Yêu cầu gửi mã xác nhận thất bại. Kiểm tra kết nối và thử lại.', 'error');
      }
    });
  }

  async function submitDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    requestOtp();
  }

  async function confirmOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pendingId) {
      setFeedback('Không tìm thấy phiên xác nhận. Vui lòng gửi lại biểu mẫu.', 'error');
      return;
    }

    startTransition(async () => {
      setMessage('');

      try {
        const response = await fetch('/slogan/api/submissions/confirm', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            pending_id: pendingId,
            email,
            otp_code: otpCode,
          }),
        });
        const payload = (await response.json()) as { error?: string; slug?: string };

        if (!response.ok) {
          if (payload.slug) {
            setSubmittedSlug(payload.slug);
            setStep('success');
            setFeedback('Chúc mừng! Bạn đã gửi bài thi thành công.', 'success');
            return;
          }

          setFeedback(payload.error ?? 'Không thể xác nhận bài dự thi. Kiểm tra mã OTP và thử lại.', 'error');
          return;
        }

        if (!payload.slug) {
          setFeedback('Không nhận được đường dẫn bài dự thi. Vui lòng thử lại.', 'error');
          return;
        }

        setSubmittedSlug(payload.slug);
        setStep('success');
        setFeedback('Chúc mừng! Bạn đã gửi bài thi thành công.', 'success');
      } catch {
        setFeedback('Yêu cầu xác nhận thất bại. Kiểm tra kết nối và thử lại.', 'error');
      }
    });
  }

  function toggleChannel(channel: FollowedChannel) {
    setFollowedChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel],
    );
  }

  return (
    <div className="form-panel">
      <div className="form-grid">
        <div className="step-bar" aria-label="Các bước gửi bài">
          {stepItems.map(([number, label], index) => (
            <span
              className={index === stepIndex[step] ? 'step-bar-item step-bar-item-active' : 'step-bar-item'}
              key={number}
            >
              {number}. {label}
            </span>
          ))}
        </div>

        {step !== 'success' ? (
          <p className="submission-meta">
            <IconClock size={18} aria-hidden="true" /> Điền thông tin trước, xác nhận email sau. Bình chọn không cần đăng nhập.
          </p>
        ) : null}

        {step === 'details' ? (
          <form className="form-grid" onSubmit={submitDetails}>
            <div className="field">
              <label className="field-label" htmlFor="full-name">
                Họ và tên
              </label>
              <input
                className="field-control"
                id="full-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
              <p className="field-helper">Tên này sẽ hiển thị cùng bài dự thi công khai của bạn.</p>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                className="field-control"
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <p className="field-helper">Chúng tôi sẽ gửi mã OTP 6 số đến email này sau khi bạn gửi biểu mẫu.</p>
            </div>

            <fieldset className="field">
              <legend className="field-label">Kênh đã theo dõi</legend>
              <div className="channel-follow-list">
                {SOCIAL_CHANNELS.map((channel) => (
                  <ChannelFollowRow
                    key={channel.id}
                    channel={channel}
                    checked={followedChannels.includes(channel.id)}
                    onToggle={toggleChannel}
                  />
                ))}
              </div>
              <p className="field-helper">Chọn ít nhất một kênh bạn đã theo dõi.</p>
              <p className="channel-priority-hint">
                <IconInfoCircle size={14} aria-hidden="true" /> Mẹo: follow đủ cả 4 kênh sẽ được ưu tiên xét nếu
                bài dự thi bằng điểm với bài khác.
              </p>
              {followedChannels.length === 4 ? (
                <span className="channel-priority-badge">
                  <IconCheck size={14} aria-hidden="true" /> Đủ 4 kênh — được ưu tiên xét
                </span>
              ) : null}
            </fieldset>

            <div className="field">
              <label className="field-label" htmlFor="slogan">
                Slogan
              </label>
              <input
                className="field-control"
                id="slogan"
                value={slogan}
                onChange={(event) => setSlogan(event.target.value)}
                required
              />
              <div className="slogan-preview" aria-live="polite">
                <span className="field-helper">Xem trước</span>
                <strong className="slogan-preview-text">
                  {slogan.trim() ? slogan : 'Đặt Tên Cho Chuyến Đi'}
                </strong>
              </div>
              <WordCounter label="Slogan" maxWords={10} value={slogan} />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="explanation">
                Giải thích
              </label>
              <textarea
                className="field-control"
                id="explanation"
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
                required
              />
              <WordCounter label="Giải thích" maxWords={50} value={explanation} />
            </div>

            <TurnstileWidget enabled={turnstileEnabled} siteKey={turnstileSiteKey} onToken={setTurnstileToken} />

            <button className="button button-primary" disabled={isPending || !formValid} type="submit">
              {isPending ? 'Đang gửi mã' : 'Gửi bài dự thi'}
            </button>
          </form>
        ) : null}

        {step === 'confirm' ? (
          <form className="form-grid" onSubmit={confirmOtp}>
            <div className="field">
              <label className="field-label" htmlFor="otp">
                Mã xác nhận
              </label>
              <input
                className="field-control"
                id="otp"
                inputMode="numeric"
                pattern="[0-9]{6}"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                required
              />
              <p className="field-helper">Nhập mã 6 số đã gửi đến {email}.</p>
            </div>
            <button className="button button-primary" disabled={isPending || otpCode.length !== 6} type="submit">
              {isPending ? 'Đang xác nhận' : 'Xác nhận và tạo bài dự thi'}
            </button>
            <div className="hero-actions">
              <button
                className="button"
                disabled={isPending || resendCooldown > 0}
                type="button"
                onClick={requestOtp}
              >
                {resendCooldown > 0 ? `Gửi lại mã sau ${resendCooldown}s` : 'Gửi lại mã'}
              </button>
              <button
                className="button"
                disabled={isPending}
                type="button"
                onClick={() => {
                  setStep('details');
                  setMessage('');
                }}
              >
                Quay lại sửa thông tin
              </button>
            </div>
          </form>
        ) : null}

        {step === 'success' ? (
          <div className="form-grid">
            <div className="meaning-box">
              <strong>Chúc mừng đã gửi bài thi thành công</strong>
              <p>
                Cảm ơn {fullName}. Slogan &ldquo;{slogan}&rdquo; của bạn đã được duyệt và có thể chia sẻ ngay.
              </p>
            </div>
            <div className="hero-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => router.push(`/entry/${submittedSlug}`)}
              >
                Xem trang bài dự thi
              </button>
              <button className="button" type="button" onClick={() => router.push('/wall')}>
                Xem tường bài dự thi
              </button>
            </div>
          </div>
        ) : null}

        {message ? (
          <p className="toast-line" data-tone={tone === 'idle' ? undefined : tone}>
            {tone === 'success' ? <IconCheck size={18} aria-hidden="true" /> : null}
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
