import Image from 'next/image';
import Link from 'next/link';
import { IconClock } from '@tabler/icons-react';
import { Countdown } from '@/components/countdown';
import { FeaturedSubmissions } from '@/components/featured-submissions';
import { PrizeRulesTabs } from '@/components/prize-rules-tabs';
import { getCampaignSettings } from '@/lib/data/campaign';
import { getFeaturedSubmissions } from '@/lib/data/submissions';

export const dynamic = 'force-dynamic';

const steps = [
  ['1', 'Viết slogan', 'Gửi slogan tối đa 10 chữ và phần giải thích tối đa 50 chữ.'],
  ['2', 'Xác thực email', 'Nhập email và xác nhận bằng mã OTP 6 số.'],
  ['3', 'Chia sẻ và bình chọn', 'Mỗi bài được duyệt sẽ có URL riêng để chia sẻ và nhận bình chọn công khai.'],
];

export default async function HomePage() {
  const [campaign, featured] = await Promise.all([getCampaignSettings(), getFeaturedSubmissions()]);

  return (
    <main>
      <section className="hero-brand">
        <div className="hero-media" aria-hidden="true">
          <Image src="/slogan/hero.jpg" alt="" fill sizes="(min-width: 40rem) 100vw, 0px" className="hero-media-img" />
          <div className="hero-media-overlay" />
        </div>
        <div className="page-frame hero-grid">
          <div className="hero-copy">
            <p className="submission-meta">
              <IconClock size={18} aria-hidden="true" /> Cuộc thi Slogan Green Ruby
            </p>
            <h1 className="hero-title">Đặt tên cho chuyến đi.</h1>
            <p className="hero-lede">Chỉ mất 2 phút — tham gia để trúng giải thưởng lên đến 20 triệu.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/join">
                Tham gia ngay
              </Link>
              <Link className="button" href="/wall">
                Xem bài dự thi
              </Link>
            </div>
          </div>
          <div className="form-grid">
            <Countdown target={campaign.submission_end} />
          </div>
        </div>
      </section>

      <section className="section section-cream">
        <div className="page-frame section-stack">
          <div className="section-narrow">
            <h2 className="section-title">Cơ cấu giải thưởng.</h2>
            <p className="section-lede">
              Một giải do ban giám khảo chọn, một giải được cộng đồng yêu thích và các voucher dành cho những câu
              slogan đáng nhớ.
            </p>
          </div>
          <PrizeRulesTabs />
        </div>
      </section>

      <FeaturedSubmissions newest={featured.newest} mostVoted={featured.mostVoted} />

      <section className="section section-forest">
        <div className="page-frame section-stack">
          <div className="section-narrow">
            <h2 className="section-title">Các bước tham gia.</h2>
          </div>
          <ol className="workflow-list">
            {steps.map(([stage, title, body]) => (
              <li className="workflow-step" key={stage}>
                <span className="stage-circle">{stage}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
