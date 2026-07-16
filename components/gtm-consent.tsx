'use client';

import { useEffect, useState } from 'react';
import { getCookieConsent, setCookieConsent, type CookieConsentValue } from '@/lib/cookie-consent';
import { initDataLayer, loadGoogleTagManager } from '@/lib/gtm';

type GtmConsentProps = {
  gtmId?: string;
};

export function GtmConsent({ gtmId }: GtmConsentProps) {
  const [consent, setConsent] = useState<CookieConsentValue | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const currentConsent = getCookieConsent();
    setConsent(currentConsent);
    setReady(true);

    if (!gtmId) {
      return;
    }

    if (currentConsent === 'accepted') {
      loadGoogleTagManager(gtmId);
      return;
    }

    if (currentConsent === 'declined') {
      initDataLayer();
    }
  }, [gtmId]);

  function handleConsent(value: CookieConsentValue) {
    setCookieConsent(value);
    setConsent(value);

    if (!gtmId) {
      return;
    }

    if (value === 'accepted') {
      loadGoogleTagManager(gtmId);
      return;
    }

    initDataLayer();
  }

  if (!ready || !gtmId || consent) {
    return null;
  }

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-consent-title">
      <div className="cookie-banner-wrapper">
        <div className="cookie-banner-text">
          <p id="cookie-consent-title" className="cookie-banner-title">
            Chúng tôi sử dụng Cookie
          </p>
          <p className="cookie-banner-description">
            Website sử dụng Google Tag Manager để phân tích lưu lượng truy cập. Dữ liệu giúp chúng tôi cải thiện trải
            nghiệm của bạn.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button className="button" type="button" onClick={() => handleConsent('declined')}>
            Từ chối
          </button>
          <button className="button button-primary" type="button" onClick={() => handleConsent('accepted')}>
            Chấp nhận
          </button>
        </div>
      </div>
    </div>
  );
}
