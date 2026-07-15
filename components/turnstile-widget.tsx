'use client';

import { Turnstile } from '@marsidev/react-turnstile';

type TurnstileWidgetProps = {
  siteKey?: string;
  enabled?: boolean;
  onToken: (token: string) => void;
  onExpire?: () => void;
};

export function TurnstileWidget({ siteKey, enabled, onToken, onExpire }: TurnstileWidgetProps) {
  if (!enabled || !siteKey) {
    return null;
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={onExpire}
      options={{ theme: 'light' }}
    />
  );
}
