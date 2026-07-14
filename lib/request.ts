import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

export function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || '0.0.0.0';
  }

  return request.headers.get('x-real-ip') ?? '0.0.0.0';
}

export function assertSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!origin) {
    return null;
  }

  if (origin !== env.allowedOrigin) {
    return NextResponse.json(
      { error: 'Nguồn yêu cầu không được phép.' },
      { status: 403 },
    );
  }

  return null;
}
