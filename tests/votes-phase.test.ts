import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import type { CampaignPhase } from '@/lib/types';
import { canAcceptVotes } from '@/lib/campaign-phase';

const getCampaignSettings = vi.fn();
const checkRateLimit = vi.fn();
const createServiceSupabaseClient = vi.fn();
const verifyTurnstile = vi.fn();
const requireServerEnv = vi.fn();

vi.mock('@/lib/data/campaign', () => ({
  getCampaignSettings: () => getCampaignSettings(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => checkRateLimit(...args),
}));

vi.mock('@/lib/supabase/server', () => ({
  createServiceSupabaseClient: () => createServiceSupabaseClient(),
}));

vi.mock('@/lib/turnstile', () => ({
  verifyTurnstile: (...args: unknown[]) => verifyTurnstile(...args),
}));

vi.mock('@/lib/env', () => ({
  env: {
    allowedOrigin: 'https://greenrubycruises.com',
    turnstileEnabled: false,
    hashSalt: 'local-development-hash-salt-change-me',
  },
  requireServerEnv: () => requireServerEnv(),
}));

describe('canAcceptVotes', () => {
  it('allows votes during submission', () => {
    expect(canAcceptVotes('submission')).toBe(true);
  });

  it('blocks votes when ended', () => {
    expect(canAcceptVotes('ended')).toBe(false);
  });
});

describe('POST /api/votes phase gate', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    requireServerEnv.mockImplementation(() => undefined);
    verifyTurnstile.mockResolvedValue({ ok: true });
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 19 });
  });

  async function postVote(phase: CampaignPhase) {
    getCampaignSettings.mockResolvedValue({
      id: 1,
      phase,
      submission_start: '2026-07-10T00:00:00+07:00',
      submission_end: '2026-07-31T23:59:59+07:00',
      voting_start: '2026-07-15T00:00:00+07:00',
      voting_end: '2026-07-31T23:59:59+07:00',
    });

    const insert = vi.fn().mockResolvedValue({ error: null });
    const maybeSingleChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: '11111111-1111-4111-8111-111111111111',
          submitter_fingerprint_hash: 'other-hash',
          flagged_for_review: false,
          status: 'approved',
        },
        error: null,
      }),
    };

    createServiceSupabaseClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'submissions') return maybeSingleChain;
        if (table === 'votes') return { insert };
        return {};
      }),
    });

    const { POST } = await import('@/app/api/votes/route');
    const request = new NextRequest('https://greenrubycruises.com/slogan/api/votes', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://greenrubycruises.com',
      },
      body: JSON.stringify({
        submission_id: '11111111-1111-4111-8111-111111111111',
        fingerprint: 'visitor-abc',
      }),
    });

    return POST(request);
  }

  it('accepts vote when phase is submission', async () => {
    const response = await postVote('submission');
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it('rejects vote when phase is ended', async () => {
    const response = await postVote('ended');
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'Bình chọn đã đóng.' });
  });
});
