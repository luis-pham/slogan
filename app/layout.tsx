import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { GtmConsent } from '@/components/gtm-consent';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { publicEnv } from '@/lib/public-env';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-display-face',
});

const dmSans = DM_Sans({
  subsets: ['latin', 'vietnamese'] as unknown as ['latin', 'latin-ext'],
  weight: ['400', '500', '700'],
  variable: '--font-body-face',
});

export const metadata: Metadata = {
  title: 'Cuộc thi Slogan Green Ruby',
  description: 'Gửi bài dự thi và bình chọn cho cuộc thi slogan Green Ruby Cruises.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://greenrubycruises.com'),
  openGraph: {
    title: 'Cuộc thi Slogan Green Ruby',
    description: 'Đặt tên cho hành trình Green Ruby.',
    url: '/slogan',
    siteName: 'Green Ruby Cruises',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <div className="site-shell">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <GtmConsent gtmId={publicEnv.gtmId} />
      </body>
    </html>
  );
}
