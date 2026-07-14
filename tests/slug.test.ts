import { describe, expect, it } from 'vitest';
import { generateSubmissionSlug } from '@/lib/slug';

describe('submission slug', () => {
  it('uses a non-sequential public prefix', () => {
    expect(generateSubmissionSlug()).toMatch(/^gr-[23456789abcdefghijkmnopqrstuvwxyz]{8}$/);
  });

  it('does not collide across rapid calls', () => {
    const slugs = new Set(Array.from({ length: 500 }, () => generateSubmissionSlug()));
    expect(slugs.size).toBe(500);
  });
});
