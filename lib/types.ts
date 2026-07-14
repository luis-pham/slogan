export type CampaignPhase = 'submission' | 'voting' | 'ended';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type FollowedChannel = 'facebook' | 'tiktok' | 'instagram' | 'youtube';

export type CampaignSettings = {
  id: number;
  phase: CampaignPhase;
  submission_start: string;
  submission_end: string;
  voting_start: string;
  voting_end: string;
};

export type Submission = {
  id: string;
  email?: string;
  full_name: string;
  slug: string;
  slogan: string;
  explanation: string;
  followed_channels: FollowedChannel[];
  status: SubmissionStatus;
  vote_count: number;
  is_seed: boolean;
  is_winner: boolean;
  flagged_for_review: boolean;
  submitter_fingerprint_hash?: string;
  created_at: string;
};

export type LeaderboardEntry = Pick<
  Submission,
  'id' | 'full_name' | 'slug' | 'slogan' | 'vote_count' | 'created_at'
>;
