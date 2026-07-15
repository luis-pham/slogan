import { NextRequest, NextResponse } from 'next/server';
import type { PostgrestError } from '@supabase/supabase-js';
import { sendSubmissionConfirmationEmail } from '@/lib/email';
import { assertSameOrigin } from '@/lib/request';
import { generateSubmissionSlug } from '@/lib/slug';
import { createServerSupabaseClient, createServiceSupabaseClient } from '@/lib/supabase/server';
import { submissionConfirmSchema } from '@/lib/validation';
import { requireServerEnv } from '@/lib/env';

type PendingSubmission = {
  id: string;
  email: string;
  full_name: string;
  slogan: string;
  explanation: string;
  followed_channels: string[];
  fingerprint_hash: string;
  verify_attempts: number;
  expires_at: string;
};

function isUniqueViolation(error: PostgrestError | null) {
  return error?.code === '23505';
}

export async function POST(request: NextRequest) {
  const originError = assertSameOrigin(request);
  if (originError) return originError;

  try {
    requireServerEnv();
    const body = submissionConfirmSchema.parse(await request.json());
    const serviceClient = createServiceSupabaseClient();

    const { data: pending, error: pendingError } = await serviceClient
      .from('pending_submissions')
      .select('*')
      .eq('id', body.pending_id)
      .ilike('email', body.email)
      .maybeSingle<PendingSubmission>();

    if (pendingError) {
      return NextResponse.json({ error: pendingError.message }, { status: 400 });
    }

    if (!pending) {
      return NextResponse.json(
        { error: 'Không tìm thấy phiên gửi bài. Vui lòng gửi lại biểu mẫu.' },
        { status: 404 },
      );
    }

    if (new Date(pending.expires_at).getTime() < Date.now()) {
      await serviceClient.from('pending_submissions').delete().eq('id', pending.id);
      return NextResponse.json(
        { error: 'Mã xác nhận đã hết hạn. Vui lòng gửi lại biểu mẫu.' },
        { status: 410 },
      );
    }

    if (pending.verify_attempts >= 5) {
      return NextResponse.json(
        { error: 'Bạn đã nhập sai quá nhiều lần. Vui lòng gửi lại biểu mẫu để lấy mã mới.' },
        { status: 429 },
      );
    }

    const authClient = await createServerSupabaseClient();
    const { error: otpError } = await authClient.auth.verifyOtp({
      email: body.email,
      token: body.otp_code,
      type: 'email',
    });

    if (otpError) {
      await serviceClient
        .from('pending_submissions')
        .update({ verify_attempts: pending.verify_attempts + 1 })
        .eq('id', pending.id);

      return NextResponse.json(
        { error: 'Mã OTP không đúng hoặc đã hết hạn. Hãy kiểm tra lại và thử lần nữa.' },
        { status: 401 },
      );
    }

    const { data: existing } = await serviceClient
      .from('submissions')
      .select('slug')
      .ilike('email', pending.email)
      .neq('status', 'rejected')
      .maybeSingle();

    if (existing?.slug) {
      await serviceClient.from('pending_submissions').delete().eq('id', pending.id);
      return NextResponse.json(
        { error: 'Email này đã có bài dự thi.', slug: existing.slug },
        { status: 409 },
      );
    }

    let slug = generateSubmissionSlug();
    let insertError: PostgrestError | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { error } = await serviceClient.from('submissions').insert({
        email: pending.email,
        full_name: pending.full_name,
        slug,
        slogan: pending.slogan,
        explanation: pending.explanation,
        followed_channels: pending.followed_channels,
        submitter_fingerprint_hash: pending.fingerprint_hash,
        status: 'approved',
      });

      insertError = error;
      if (!isUniqueViolation(error)) {
        break;
      }

      slug = generateSubmissionSlug();
    }

    if (insertError) {
      if (isUniqueViolation(insertError)) {
        return NextResponse.json(
          { error: 'Email này đã có bài dự thi.' },
          { status: 409 },
        );
      }

      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    await serviceClient.from('pending_submissions').delete().eq('id', pending.id);

    try {
      await sendSubmissionConfirmationEmail({
        to: pending.email,
        fullName: pending.full_name,
        slogan: pending.slogan,
        slug,
      });
    } catch {
      // Best-effort: submission is already saved, don't fail the request over email delivery.
    }

    return NextResponse.json({ ok: true, slug });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Không thể xác nhận bài dự thi.' },
      { status: 400 },
    );
  }
}
