import Image from 'next/image';
import { IconGift, IconHeart, IconMedal, IconTrophy } from '@tabler/icons-react';
import { PhaseBanner } from '@/components/phase-banner';
import { getCampaignSettings } from '@/lib/data/campaign';
import { getWinnerSubmissions } from '@/lib/data/submissions';

const awardIcons = [IconTrophy, IconHeart, IconMedal, IconGift];
const awardLabels = ['Giải Nhất', 'Giải Yêu Thích', 'Giải Nhì', 'Giải Ba'];

export default async function ResultsPage() {
  const [campaign, winners] = await Promise.all([getCampaignSettings(), getWinnerSubmissions()]);

  return (
    <main>
      <section className="hero-brand">
        <div className="hero-media" aria-hidden="true">
          <Image src="/slogan/hero.jpg" alt="" fill sizes="(min-width: 40rem) 100vw, 0px" className="hero-media-img" />
          <div className="hero-media-overlay" />
        </div>
        <div className="page-frame section-stack">
          <div className="section-narrow">
            <h1 className="section-title">Kết quả chung cuộc.</h1>
            <p className="section-lede">
              Người thắng được ban giám khảo đánh giá bình chọn công khai.
            </p>
          </div>
          <PhaseBanner campaign={campaign} />
        </div>
      </section>

      <section className="section section-cream">
        <div className="page-frame">
          {campaign.phase !== 'ended' ? (
            <section className="phase-banner">
              <strong>Kết quả chưa được công bố.</strong>
              <span>Trang kết quả sẽ mở khi chiến dịch chuyển sang trạng thái đã kết thúc.</span>
            </section>
          ) : (
            <section className="results-grid">
              {winners.map((winner, index) => {
                const Icon = awardIcons[index] ?? IconGift;
                const featured = index === 0 || index === 1;
                return (
                  <article className={featured ? 'result-card result-card-featured' : 'result-card'} key={winner.id}>
                    <span className={featured ? 'result-badge result-badge-featured' : 'result-badge'}>
                      {awardLabels[index] ?? 'Giải Khuyến Khích'}
                    </span>
                    <Icon size={24} aria-hidden="true" />
                    <h2 className="submission-slogan">&ldquo;{winner.slogan}&rdquo;</h2>
                    <p>{winner.explanation}</p>
                    <strong>{winner.full_name}</strong>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
