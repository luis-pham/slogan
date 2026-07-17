import { NextRequest, NextResponse } from 'next/server';
import type { PostgrestError } from '@supabase/supabase-js';
import { getCampaignSettings } from '@/lib/data/campaign';
import { canAcceptVotes } from '@/lib/campaign-phase';
import { assertSameOrigin, getClientIp } from '@/lib/request';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { voteSchema } from '@/lib/validation';
import { hashFingerprint, hashIp, hashWithSalt } from '@/lib/hash';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { requireServerEnv } from '@/lib/env';
import {
  flagSubmissionIfVoteSpike,
  VOTE_RATE_LIMIT_PER_HOUR,
  VOTE_RATE_LIMIT_PER_MINUTE,
} from '@/lib/vote-guard';

function isUniqueViolation(error: PostgrestError | null) {
  return error?.code === '23505';
}

export async function POST(request: NextRequest) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  try {
    requireServerEnv();
    const body = voteSchema.parse(await request.json());
    const turnstile = await verifyTurnstile(body.turnstileToken);

    if (!turnstile.ok) {
      return NextResponse.json({ error: turnstile.message }, { status: 403 });
    }

    const campaign = await getCampaignSettings();
    if (!canAcceptVotes(campaign.phase)) {
      return NextResponse.json(
        { error: 'Bình chọn đã đóng.' },
        { status: 403 },
      );
    }

    const supabase = createServiceSupabaseClient();
    const ipHash = hashIp(getClientIp(request));
    const fingerprintHash = hashFingerprint(body.fingerprint);
    const hourlyKey = hashWithSalt(`vote_hour:${ipHash}`);

    const minuteRateLimit = await checkRateLimit(supabase, {
      action: 'vote',
      key: ipHash,
      ipHash,
      limit: VOTE_RATE_LIMIT_PER_MINUTE,
      windowSeconds: 60,
    });

    if (!minuteRateLimit.allowed) {
      return NextResponse.json(
        { error: 'Có quá nhiều lượt bình chọn từ mạng này. Vui lòng chờ một phút rồi thử lại.' },
        { status: 429 },
      );
    }

    const hourlyRateLimit = await checkRateLimit(supabase, {
      action: 'vote',
      key: hourlyKey,
      ipHash,
      limit: VOTE_RATE_LIMIT_PER_HOUR,
      windowSeconds: 60 * 60,
    });

    if (!hourlyRateLimit.allowed) {
      return NextResponse.json(
        { error: 'Bạn đã bình chọn quá nhiều trong một giờ. Vui lòng thử lại sau.' },
        { status: 429 },
      );
    }

    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select('id, submitter_fingerprint_hash, flagged_for_review, status')
      .eq('id', body.submission_id)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Không tìm thấy bài dự thi.' }, { status: 404 });
    }

    if (submission.status !== 'approved' || submission.flagged_for_review) {
      return NextResponse.json(
        { error: 'Bài dự thi này hiện không thể bình chọn.' },
        { status: 403 },
      );
    }

    if (submission.submitter_fingerprint_hash === fingerprintHash) {
      return NextResponse.json(
        { error: 'Bạn không thể bình chọn cho bài dự thi của chính mình.' },
        { status: 403 },
      );
    }

    const { error } = await supabase.from('votes').insert({
      submission_id: body.submission_id,
      fingerprint_hash: fingerprintHash,
      ip_hash: ipHash,
    });

    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: 'Bạn đã bình chọn cho bài dự thi này.' },
        { status: 409 },
      );
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    try {
      await flagSubmissionIfVoteSpike(supabase, body.submission_id);
    } catch {
      // Best-effort: vote đã ghi nhận, không fail request vì bước giám sát.
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Không thể ghi nhận bình chọn.' },
      { status: 400 },
    );
  }
}
