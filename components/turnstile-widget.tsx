'use client';

import { Turnstile } from '@marsidev/react-turnstile';

type TurnstileWidgetProps = {
  siteKey?: string;
  enabled?: boolean;
  onToken: (token: string) => void;
};

export function TurnstileWidget({ siteKey, enabled, onToken }: TurnstileWidgetProps) {
  if (!enabled || !siteKey) {
    return null;
  }

  return <Turnstile siteKey={siteKey} onSuccess={onToken} options={{ theme: 'light' }} />;
}
