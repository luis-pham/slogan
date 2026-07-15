import 'server-only';
import { Resend } from 'resend';
import { env } from '@/lib/env';

type SubmissionConfirmationEmailParams = {
  to: string;
  fullName: string;
  slogan: string;
  slug: string;
};

export async function sendSubmissionConfirmationEmail({
  to,
  fullName,
  slogan,
  slug,
}: SubmissionConfirmationEmailParams) {
  if (!env.resendApiKey) {
    return;
  }

  const resend = new Resend(env.resendApiKey);
  const entryUrl = `${env.siteUrl}/slogan/entry/${slug}`;

  await resend.emails.send({
    from: env.emailFrom,
    to,
    subject: 'Chúc mừng! Bài dự thi slogan Green Ruby của bạn đã gửi thành công',
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #0D2B1A;">
        <h1 style="font-size: 20px;">Chúc mừng ${fullName} đã gửi bài thi thành công!</h1>
        <p>Bài dự thi của bạn đã được ghi nhận và hiển thị công khai:</p>
        <blockquote style="font-style: italic; font-size: 18px; border-left: 3px solid #C8A84B; padding-left: 12px; margin: 16px 0;">
          &ldquo;${slogan}&rdquo;
        </blockquote>
        <p>Chia sẻ đường dẫn riêng để nhận bình chọn khi giai đoạn bình chọn mở:</p>
        <p><a href="${entryUrl}" style="color: #0D2B1A; font-weight: bold;">${entryUrl}</a></p>
        <p style="margin-top: 24px; font-size: 13px; color: #4a4a4a;">Green Ruby Cruises — Luxury Without Trace</p>
      </div>
    `,
  });
}
