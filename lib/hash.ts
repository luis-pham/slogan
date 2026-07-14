import { createHash } from 'crypto';
import { env } from '@/lib/env';

export function hashWithSalt(value: string) {
  return createHash('sha256').update(`${env.hashSalt}:${value}`).digest('hex');
}

export function hashFingerprint(fingerprint: string) {
  return hashWithSalt(`fingerprint:${fingerprint}`);
}

export function hashIp(ip: string) {
  return hashWithSalt(`ip:${ip}`);
}
