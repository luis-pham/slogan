'use client';

import { countVietnameseWords } from '@/lib/word-count';

type WordCounterProps = {
  value: string;
  maxWords: number;
  label: string;
};

export function WordCounter({ value, maxWords, label }: WordCounterProps) {
  const count = countVietnameseWords(value);
  const overLimit = count > maxWords;

  return (
    <p className={overLimit ? 'field-helper field-helper-error' : 'field-helper'}>
      {label}: {count}/{maxWords} chữ
    </p>
  );
}
