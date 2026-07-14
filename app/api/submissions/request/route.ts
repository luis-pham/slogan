import { NextRequest, NextResponse } from 'next/server';
import { getCampaignSettings } from '@/lib/data/campaign';
import { assertSameOrigin, getClientIp } from '@/lib/request';
import { checkRateLimit } from '@/lib/rate-limit';
import { hashFingerprint, hashIp, hashWithSalt } from '@/lib/hash';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import { submissionRequestSchema } from '@/lib/validation';
import { verifyTurnstile } from '@/lib/turnstile';
import { requireServerEnv } from '@/lib/env';

const pendingWindowMinutes = 10;

export async function POST(request: NextRequest) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  try {
    requireServerEnv();
    const body = submissionRequestSchema.parse(await request.json());
    const turnstile = await verifyTurnstile(body.turnstileToken);

    if (!turnstile.ok) {
      return NextResponse.json({ error: turnstile.message }, { status: 403 });
    }

    const campaign = await getCampaignSettings();
    if (campaign.phase !== 'submission') {
      return NextResponse.json(
        { error: 'Hiện chưa mở nhận bài dự thi.' },
        { status: 403 },
      );
    }

    const supabase = createServiceSupabaseClient();
    const ipHash = hashIp(getClientIp(request));
    const emailKey = hashWithSalt(`otp:${body.email}`);

    const otpRateLimit = await checkRateLimit(supabase, {
      action: 'send_otp',
      key: emailKey,
      ipHash,
      limit: 3,
      windowSeconds: 60 * 60,
    });

    if (!otpRateLimit.allowed) {
      return NextResponse.json(
        { error: 'Bạn đã yêu cầu quá nhiều mã OTP. Vui lòng thử lại sau một giờ.' },
        { status: 429 },
      );
    }

    const submitRateLimit = await checkRateLimit(supabase, {
      action: 'submit',
      key: ipHash,
      ipHash,
      limit: 5,
      windowSeconds: 60,
    });

    if (!submitRateLimit.allowed) {
      return NextResponse.json(
        { error: 'Có quá nhiều lượt gửi từ mạng này. Vui lòng chờ một phút rồi thử lại.' },
        { status: 429 },
      );
    }

    const { data: existing } = await supabase
      .from('submissions')
      .select('slug')
      .ilike('email', body.email)
      .neq('status', 'rejected')
      .maybeSingle();

    if (existing?.slug) {
      return NextResponse.json(
        { error: 'Email này đã có bài dự thi.', slug: existing.slug },
        { status: 409 },
      );
    }

    const now = Date.now();
    const expiresAt = new Date(now + pendingWindowMinutes * 60 * 1000).toISOString();

    await supabase.from('pending_submissions').delete().lt('expires_at', new Date(now).toISOString());
    await supabase.from('pending_submissions').delete().ilike('email', body.email);

    const { data: pending, error: pendingError } = await supabase
      .from('pending_submissions')
      .insert({
        email: body.email,
        full_name: body.full_name,
        slogan: body.slogan,
        explanation: body.explanation,
        followed_channels: body.followed_channels,
        fingerprint_hash: hashFingerprint(body.fingerprint),
        ip_hash: ipHash,
        expires_at: expiresAt,
      })
      .select('id')
      .single();

    if (pendingError || !pending) {
      return NextResponse.json(
        { error: pendingError?.message ?? 'Không thể lưu tạm bài dự thi.' },
        { status: 400 },
      );
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: body.email,
      options: { shouldCreateUser: true },
    });

    if (otpError) {
      await supabase.from('pending_submissions').delete().eq('id', pending.id);
      return NextResponse.json({ error: otpError.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, pending_id: pending.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Không thể gửi mã xác nhận.' },
      { status: 400 },
    );
  }
}
