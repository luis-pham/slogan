'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconGift, IconHeart, IconMedal, IconTrophy } from '@tabler/icons-react';

const prizes = [
  {
    title: 'Giải Nhất',
    value: '20 triệu VNĐ',
    body: 'Do ban giám khảo Green Ruby lựa chọn.',
    icon: IconTrophy,
    featured: true,
  },
  {
    title: 'Giải Yêu Thích',
    value: '20 triệu VNĐ',
    body: 'Dành cho bài dự thi dẫn đầu bình chọn công khai sau khi được rà soát.',
    icon: IconHeart,
    featured: true,
  },
  {
    title: 'Giải Nhì',
    value: '10 triệu VNĐ',
    body: 'Dành cho một slogan phù hợp, dễ nhớ và có cá tính thương hiệu.',
    icon: IconMedal,
  },
  {
    title: 'Giải Ba',
    value: '50%',
    body: 'Voucher du thuyền cho hành trình Green Ruby tiếp theo.',
    icon: IconGift,
  },
  {
    title: '20 Giải Khuyến Khích',
    value: '30%',
    body: 'Voucher du thuyền cho các bài dự thi được chọn vào danh sách nổi bật.',
    icon: IconGift,
  },
];

// Nguồn: docs/10_RULES_CONTENT.md — "BẢN RÚT GỌN". Giữ nguyên văn bản, không tự viết lại.
const rules = [
  {
    number: '01',
    title: 'Đối tượng',
    body: 'Công dân Việt Nam từ 18 tuổi trở lên. Không áp dụng cho nhân viên, cộng tác viên và người thân trực tiếp của Green Ruby Cruises.',
  },
  {
    number: '02',
    title: 'Điều kiện tham gia',
    body: 'Follow ít nhất 1 trong 4 kênh: Facebook, TikTok, Instagram, YouTube của Green Ruby Cruises.',
  },
  {
    number: '03',
    title: 'Slogan dự thi',
    body: 'Tiếng Việt, tối đa 10 chữ, là sáng tác gốc, chưa từng công bố thương mại dưới bất kỳ hình thức nào.',
  },
  {
    number: '04',
    title: 'Mỗi người một bài',
    body: 'Mỗi email chỉ được gửi 1 bài dự thi duy nhất, xác thực qua email OTP trước khi bài chính thức được ghi nhận.',
  },
  {
    number: '05',
    title: 'Cách chọn người thắng',
    body: 'Giải Nhất, Nhì, Ba do Ban giám khảo chấm. Giải Được Yêu Thích do cộng đồng bình chọn công khai trong 3 ngày sau khi kết thúc nhận bài. Nếu điểm bằng nhau, bài follow đủ 4 kênh sẽ được ưu tiên.',
  },
  {
    number: '06',
    title: 'Bản quyền',
    body: 'Green Ruby Cruises có quyền sử dụng slogan đoạt giải cho mục đích truyền thông thương hiệu, không giới hạn thời gian.',
  },
];

type TabKey = 'prizes' | 'rules';

export function PrizeRulesTabs() {
  const [tab, setTab] = useState<TabKey>('prizes');

  return (
    <div className="section-stack">
      <div className="step-bar step-bar-two" role="tablist" aria-label="Cơ cấu giải thưởng và thể lệ tham gia">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'prizes'}
          className={tab === 'prizes' ? 'step-bar-item step-bar-item-active' : 'step-bar-item'}
          onClick={() => setTab('prizes')}
        >
          Cơ cấu giải thưởng
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'rules'}
          className={tab === 'rules' ? 'step-bar-item step-bar-item-active' : 'step-bar-item'}
          onClick={() => setTab('rules')}
        >
          Thể lệ tham gia
        </button>
      </div>

      {tab === 'prizes' ? (
        <div className="prize-grid" role="tabpanel">
          {prizes.map((prize) => {
            const Icon = prize.icon;
            return (
              <article className={prize.featured ? 'prize-card prize-card-featured' : 'prize-card'} key={prize.title}>
                <Icon size={24} aria-hidden="true" />
                <h3>{prize.title}</h3>
                <strong className="prize-value">{prize.value}</strong>
                <p>{prize.body}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rules-panel" role="tabpanel">
          <ol className="rules-list rules-list-plain">
            {rules.map((rule) => (
              <li key={rule.number}>
                <strong>
                  {rule.number}. {rule.title}
                </strong>
                <p>{rule.body}</p>
              </li>
            ))}
          </ol>
          <Link className="text-link" href="/rules">
            Xem đầy đủ thể lệ chi tiết →
          </Link>
        </div>
      )}
    </div>
  );
}
