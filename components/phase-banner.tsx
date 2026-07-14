import type { CampaignSettings } from '@/lib/types';

type PhaseBannerProps = {
  campaign: CampaignSettings;
};

const phaseCopy = {
  submission: {
    title: 'Giai đoạn nhận bài',
    body: 'Cần xác thực OTP qua email để gửi slogan. Bình chọn sẽ mở sau khi hết thời gian nhận bài.',
  },
  voting: {
    title: 'Giai đoạn bình chọn',
    body: 'Các bài đã duyệt đang mở bình chọn. Không cần đăng nhập; hệ thống áp dụng giới hạn theo fingerprint và IP.',
  },
  ended: {
    title: 'Cuộc thi đã kết thúc',
    body: 'Bình chọn công khai đã đóng. Kết quả sẽ hiển thị sau khi đội Green Ruby rà soát thủ công.',
  },
};

export function PhaseBanner({ campaign }: PhaseBannerProps) {
  const copy = phaseCopy[campaign.phase];
  const className = campaign.phase === 'voting' ? 'phase-banner phase-banner-voting' : 'phase-banner';

  return (
    <aside className={className}>
      <strong>{copy.title}</strong>
      <span>{copy.body}</span>
    </aside>
  );
}
