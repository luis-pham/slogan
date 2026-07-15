import type { CampaignSettings } from '@/lib/types';

type PhaseBannerProps = {
  campaign: CampaignSettings;
};

const phaseCopy = {
  submission: {
    title: 'Đang nhận bài & mở bình chọn',
    body: 'Vote cho slogan bạn yêu thích đến hết 31/07.',
  },
  ended: {
    title: 'Cuộc thi đã kết thúc',
    body: 'Nhận bài và bình chọn công khai đã đóng. Kết quả sẽ được công bố sau khi Ban giám khảo chấm nội bộ.',
  },
};

export function PhaseBanner({ campaign }: PhaseBannerProps) {
  const copy = phaseCopy[campaign.phase];
  const className =
    campaign.phase === 'submission' ? 'phase-banner phase-banner-active' : 'phase-banner';

  return (
    <aside className={className}>
      <strong>{copy.title}</strong>
      <span>{copy.body}</span>
    </aside>
  );
}
