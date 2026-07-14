import { describe, expect, it } from 'vitest';
import { hashFingerprint, hashIp } from '@/lib/hash';

describe('privacy hashes', () => {
  it('produces stable sha256 hashes', () => {
    expect(hashIp('127.0.0.1')).toBe(hashIp('127.0.0.1'));
    expect(hashFingerprint('visitor')).toBe(hashFingerprint('visitor'));
  });

  it('separates IP and fingerprint namespaces', () => {
    expect(hashIp('same-value')).not.toBe(hashFingerprint('same-value'));
  });

  it('does not expose the input value', () => {
    expect(hashIp('192.0.2.1')).not.toContain('192.0.2.1');
  });
});
