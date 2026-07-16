export const COOKIE_CONSENT_NAME = 'cookie_consent';
export type CookieConsentValue = 'accepted' | 'declined';

const maxAgeSeconds = 60 * 60 * 24 * 365;

export function getCookieConsent(): CookieConsentValue | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_CONSENT_NAME}=([^;]*)`));
  const value = match?.[1];

  if (value === 'accepted' || value === 'declined') {
    return value;
  }

  return null;
}

export function setCookieConsent(value: CookieConsentValue) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_CONSENT_NAME}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}
