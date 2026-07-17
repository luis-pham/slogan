import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import type { CampaignPhase } from '@/lib/types';
import { canAcceptVotes } from '@/lib/campaign-phase';
import { VOTE_SPIKE_THRESHOLD, flagSubmissionIfVoteSpike } from '@/lib/vote-guard';

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

describe('flagSubmissionIfVoteSpike', () => {
  it('flags submission when recent votes hit threshold', async () => {
    const update = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });

    const supabase = {
      from: vi.fn((table: string) => {
        if (table === 'votes') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ count: VOTE_SPIKE_THRESHOLD, error: null }),
              }),
            }),
          };
        }

        if (table === 'submissions') {
          return { update };
        }

        return {};
      }),
    };

    const result = await flagSubmissionIfVoteSpike(
      supabase as never,
      '11111111-1111-4111-8111-111111111111',
    );

    expect(result).toEqual({ flagged: true, recentVotes: VOTE_SPIKE_THRESHOLD });
    expect(update).toHaveBeenCalledWith({ flagged_for_review: true });
  });

  it('does not flag below threshold', async () => {
    const update = vi.fn();
    const supabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({ count: VOTE_SPIKE_THRESHOLD - 1, error: null }),
          }),
        }),
        update,
      })),
    };

    const result = await flagSubmissionIfVoteSpike(
      supabase as never,
      '11111111-1111-4111-8111-111111111111',
    );

    expect(result).toEqual({ flagged: false, recentVotes: VOTE_SPIKE_THRESHOLD - 1 });
    expect(update).not.toHaveBeenCalled();
  });
});

describe('POST /api/votes phase gate', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    requireServerEnv.mockImplementation(() => undefined);
    verifyTurnstile.mockResolvedValue({ ok: true });
    checkRateLimit.mockResolvedValue({ allowed: true, remaining: 4 });
  });

  function mockSupabase() {
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
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    };

    createServiceSupabaseClient.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'submissions') return maybeSingleChain;
        if (table === 'votes') {
          return {
            insert,
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockResolvedValue({ count: 1, error: null }),
              }),
            }),
          };
        }
        return {};
      }),
    });

    return insert;
  }

  async function postVote(phase: CampaignPhase, options?: { origin?: string | null }) {
    getCampaignSettings.mockResolvedValue({
      id: 1,
      phase,
      submission_start: '2026-07-10T00:00:00+07:00',
      submission_end: '2026-07-31T23:59:59+07:00',
      voting_start: '2026-07-15T00:00:00+07:00',
      voting_end: '2026-07-31T23:59:59+07:00',
    });

    mockSupabase();

    const headers: Record<string, string> = {
      'content-type': 'application/json',
    };

    if (options?.origin !== null) {
      headers.origin = options?.origin ?? 'https://greenrubycruises.com';
    }

    const { POST } = await import('@/app/api/votes/route');
    const request = new NextRequest('https://greenrubycruises.com/slogan/api/votes', {
      method: 'POST',
      headers,
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
    expect(checkRateLimit).toHaveBeenCalledTimes(2);
  });

  it('rejects vote when phase is ended', async () => {
    const response = await postVote('ended');
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'Bình chọn đã đóng.' });
  });

  it('rejects vote when origin header is missing', async () => {
    const response = await postVote('submission', { origin: null });
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'Nguồn yêu cầu không được phép.' });
  });
});
