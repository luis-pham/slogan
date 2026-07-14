const WORD_REGEX = /[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu;

export function normalizeText(input: string) {
  return input
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countVietnameseWords(input: string) {
  const normalized = normalizeText(input);

  if (!normalized) {
    return 0;
  }

  return Array.from(normalized.matchAll(WORD_REGEX)).length;
}

export function clampWords(input: string, maxWords: number) {
  const matches = Array.from(normalizeText(input).matchAll(WORD_REGEX));
  return matches.slice(0, maxWords).map((match) => match[0]).join(' ');
}
