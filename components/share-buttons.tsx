'use client';

import { useState } from 'react';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconCheck,
  IconCopy,
} from '@tabler/icons-react';

type ShareButtonsProps = {
  url: string;
  text: string;
};

export function ShareButtons({ url, text }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    if (navigator.share) {
      await navigator.share({ title: 'Cuộc thi Slogan Green Ruby', text, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="share-row" aria-label="Chia sẻ bài dự thi này">
      <a
        className="share-button"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
      >
        <IconBrandFacebook size={18} aria-hidden="true" />
        Facebook
      </a>
      <button className="share-button" type="button" onClick={copyLink}>
        <IconBrandTiktok size={18} aria-hidden="true" />
        TikTok
      </button>
      <button className="share-button" type="button" onClick={copyLink}>
        <IconBrandInstagram size={18} aria-hidden="true" />
        Instagram
      </button>
      <button className="share-button" type="button" onClick={copyLink}>
        {copied ? <IconCheck size={18} aria-hidden="true" /> : <IconCopy size={18} aria-hidden="true" />}
        {copied ? 'Đã sao chép' : 'Sao chép link'}
      </button>
    </div>
  );
}
