# Brand Assets — Design Tokens chính xác

Cursor KHÔNG được tự đoán màu/font/style — dùng đúng giá trị dưới đây.

## Màu sắc (Tailwind config — thêm vào `tailwind.config.ts`)

```ts
export default {
  theme: {
    extend: {
      colors: {
        'gr-forest': '#0D2B1A',      // forest green — nền chính, header, footer
        'gr-gold': '#C8A84B',        // gold — CTA, số liệu nổi bật, badge giải thưởng
        'gr-cream': '#f8f5ef',       // cream — nền phụ, card, section sáng
        'gr-light-green': '#1A4A2E', // light green — box phụ, meaning box, hover state
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],  // dùng cho heading, slogan lớn
        body: ['"DM Sans"', 'sans-serif'],             // dùng cho toàn bộ text thường
      },
      borderRadius: {
        DEFAULT: '0px',   // toàn bộ component sharp corners, KHÔNG bo góc
      }
    }
  }
}
```

## Import font (trong `app/layout.tsx`, dùng next/font)

```ts
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500'],
  variable: '--font-body',
})
```

Lưu ý quan trọng: PHẢI include subset `vietnamese` cho cả 2 font, nếu
không dấu tiếng Việt sẽ hiển thị sai/lỗi font trên một số trình duyệt.

## Icon — Tabler Icons

```bash
npm install @tabler/icons-react
```

Dùng theo import trực tiếp từng icon, KHÔNG import cả bộ:

```tsx
import { IconTrophy, IconHeart, IconMedal, IconGift, IconCheck,
  IconClock, IconBrandFacebook, IconBrandTiktok, IconBrandInstagram,
  IconBrandYoutube, IconCopy, IconArrowLeft } from '@tabler/icons-react'
```

Danh sách icon cần dùng theo từng màn hình:
- Giải Nhất: `IconTrophy`
- Giải Yêu Thích: `IconHeart`
- Giải Nhì: `IconMedal`
- Giải Ba / Giải KK: `IconGift`
- Vote button: `IconHeart`
- Đã vote: `IconCheck`
- Countdown/thời gian: `IconClock`
- Share Facebook: `IconBrandFacebook`
- Share TikTok: `IconBrandTiktok`
- Share Instagram: `IconBrandInstagram`
- YouTube (nav/footer): `IconBrandYoutube`
- Copy link: `IconCopy`
- Nút quay lại: `IconArrowLeft`

KHÔNG dùng emoji (🥇❤️🥈🎖️) trong code production — chỉ dùng emoji khi
làm mockup demo nhanh, bản thật phải dùng Tabler Icons để nhất quán
với toàn bộ hệ thống thiết kế Green Ruby.

## Quy tắc dùng màu Gold — kỷ luật quan trọng

Gold (#C8A84B) CHỈ xuất hiện tối đa 1-2 điểm nhấn trên mỗi màn hình:
- 1 nút CTA chính (ví dụ "Tham gia ngay", "Gửi bài dự thi")
- Số liệu giải thưởng nổi bật nhất (ví dụ giá trị tiền thưởng)

KHÔNG dùng gold cho: border thường, background thường, text thường,
nhiều icon cùng lúc trên 1 màn hình. Overuse làm mất cảm giác luxury.

## Border-radius

Toàn bộ component: `rounded-none` hoặc để mặc định 0 theo Tailwind
config ở trên. Không có ngoại lệ, kể cả button, input, card.

## Hashtag chính thức (dùng đúng trong mọi nội dung liên quan)

- #GreenRubySlogan (chính)
- #DatTenChoChuyenDi
- #LuxuryWithoutTrace
- #GreenRubyCruises

## Việc CẦN làm ở bước này

1. Setup Tailwind config theo đúng token trên
2. Import font đúng subset vietnamese
3. Cài @tabler/icons-react, xác nhận danh sách icon dùng đúng theo
   từng màn hình ở 04_PAGES_COMPONENTS.md
4. Báo cáo, chờ xác nhận trước khi áp dụng vào component thật
