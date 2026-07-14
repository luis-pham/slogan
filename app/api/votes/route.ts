import { NextRequest, NextResponse } from 'next/server';
import type { PostgrestError } from '@supabase/supabase-js';
import { getCampaignSettings } from '@/lib/data/campaign';
import { assertSameOrigin, getClientIp } from '@/lib/request';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { voteSchema } from '@/lib/validation';
import { hashFingerprint, hashIp } from '@/lib/hash';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { requireServerEnv } from '@/lib/env';

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
    if (campaign.phase !== 'voting') {
      return NextResponse.json(
        { error: 'Hiện chưa mở bình chọn.' },
        { status: 403 },
      );
    }

    const supabase = createServiceSupabaseClient();
    const ipHash = hashIp(getClientIp(request));
    const fingerprintHash = hashFingerprint(body.fingerprint);

    const rateLimit = await checkRateLimit(supabase, {
      action: 'vote',
      key: ipHash,
      ipHash,
      limit: 20,
      windowSeconds: 60,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Có quá nhiều lượt bình chọn từ mạng này. Vui lòng chờ một phút rồi thử lại.' },
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Không thể ghi nhận bình chọn.' },
      { status: 400 },
    );
  }
}
