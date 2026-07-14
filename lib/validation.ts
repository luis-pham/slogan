import { z } from 'zod';
import { countVietnameseWords, normalizeText } from '@/lib/word-count';

export const followedChannelSchema = z.enum(['facebook', 'tiktok', 'instagram', 'youtube']);

export const emailSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  turnstileToken: z.string().optional(),
});

export const otpSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  otp_code: z.string().regex(/^\d{6}$/, 'OTP phải là mã gồm 6 số.'),
});

export const submissionSchema = z.object({
  full_name: z.string().min(2).max(80).transform(normalizeText),
  slogan: z
    .string()
    .min(2)
    .max(120)
    .transform(normalizeText)
    .refine((value) => countVietnameseWords(value) <= 10, {
      message: 'Slogan phải có tối đa 10 chữ.',
    }),
  explanation: z
    .string()
    .min(10)
    .max(600)
    .transform(normalizeText)
    .refine((value) => countVietnameseWords(value) <= 50, {
      message: 'Phần giải thích phải có tối đa 50 chữ.',
    }),
  followed_channels: z.array(followedChannelSchema).min(1),
  fingerprint: z.string().min(8),
  turnstileToken: z.string().optional(),
});

export const submissionRequestSchema = submissionSchema.extend({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
});

export const submissionConfirmSchema = z.object({
  pending_id: z.string().uuid(),
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  otp_code: z.string().regex(/^\d{6}$/, 'OTP phải là mã gồm 6 số.'),
});

export const voteSchema = z.object({
  submission_id: z.string().uuid(),
  fingerprint: z.string().min(8),
  turnstileToken: z.string().optional(),
});
