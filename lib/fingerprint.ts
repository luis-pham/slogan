'use client';

import FingerprintJS from '@fingerprintjs/fingerprintjs';

let visitorPromise: Promise<string> | null = null;

export function getFingerprint() {
  if (!visitorPromise) {
    visitorPromise = FingerprintJS.load().then(async (agent) => {
      const result = await agent.get();
      return result.visitorId;
    });
  }

  return visitorPromise;
}
