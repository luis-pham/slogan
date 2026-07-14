import { customAlphabet } from 'nanoid';

const alphabet = '23456789abcdefghijkmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);

export function generateSubmissionSlug() {
  return `gr-${nanoid()}`;
}
