import type { CampaignPhase } from '@/lib/types';

/** Votes are accepted while submissions are open; blocked after the contest ends. */
export function canAcceptVotes(phase: CampaignPhase) {
  return phase === 'submission';
}
