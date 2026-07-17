import type { SupabaseClient } from '@supabase/supabase-js';

/** Số vote trong cửa sổ ngắn để coi là spike bất thường. */
export const VOTE_SPIKE_THRESHOLD = 40;
export const VOTE_SPIKE_WINDOW_SECONDS = 5 * 60;

/** Rate limit vote theo IP. */
export const VOTE_RATE_LIMIT_PER_MINUTE = 5;
export const VOTE_RATE_LIMIT_PER_HOUR = 30;

export async function flagSubmissionIfVoteSpike(
  supabase: SupabaseClient,
  submissionId: string,
) {
  const since = new Date(Date.now() - VOTE_SPIKE_WINDOW_SECONDS * 1000).toISOString();

  const { count, error } = await supabase
    .from('votes')
    .select('id', { count: 'exact', head: true })
    .eq('submission_id', submissionId)
    .gte('created_at', since);

  if (error) {
    throw error;
  }

  if ((count ?? 0) < VOTE_SPIKE_THRESHOLD) {
    return { flagged: false, recentVotes: count ?? 0 };
  }

  const { error: updateError } = await supabase
    .from('submissions')
    .update({ flagged_for_review: true })
    .eq('id', submissionId)
    .eq('flagged_for_review', false);

  if (updateError) {
    throw updateError;
  }

  return { flagged: true, recentVotes: count ?? 0 };
}
