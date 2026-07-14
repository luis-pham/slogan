import { describe, expect, it } from 'vitest';
import { countVietnameseWords, normalizeText } from '@/lib/word-count';

describe('Vietnamese word counting', () => {
  it('counts accented Vietnamese words', () => {
    expect(countVietnameseWords('Du thuyền xanh giữa vịnh ngọc')).toBe(6);
  });

  it('normalizes repeated whitespace', () => {
    expect(normalizeText('  Green   Ruby\nCruises  ')).toBe('Green Ruby Cruises');
    expect(countVietnameseWords('  Green   Ruby\nCruises  ')).toBe(3);
  });

  it('counts numbers as words when used in a slogan', () => {
    expect(countVietnameseWords('1 hành trình 0 dấu vết')).toBe(6);
  });
});
