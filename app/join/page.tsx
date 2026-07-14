import { JoinForm } from '@/components/join-form';
import { env } from '@/lib/env';

export default function JoinPage() {
  return (
    <main className="section section-cream">
      <div className="page-frame section-stack">
        <div className="section-narrow">
          <h1 className="section-title">Gửi một câu slogan đáng nhớ.</h1>
          <p className="section-lede">
            Biểu mẫu sẽ xác thực email trước, sau đó nhận slogan và phần giải thích. Slogan tối đa 10 chữ.
          </p>
        </div>
        <JoinForm turnstileEnabled={env.turnstileEnabled} turnstileSiteKey={env.turnstileSiteKey} />
      </div>
    </main>
  );
}
