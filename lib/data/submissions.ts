import { unstable_noStore as noStore } from 'next/cache';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import type { LeaderboardEntry, Submission } from '@/lib/types';

const sampleSubmissions: Submission[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    full_name: 'Linh Nguyễn',
    slug: 'gr-a9f2c1d4',
    slogan: 'Sang trọng không dấu vết',
    explanation: 'Một lời hứa nhẹ nhàng cho hành trình lưu lại trong lòng khách, không để lại dấu vết trên vịnh.',
    followed_channels: ['facebook', 'tiktok'],
    status: 'approved',
    vote_count: 18,
    is_seed: true,
    is_winner: false,
    flagged_for_review: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    full_name: 'Minh Trần',
    slug: 'gr-b8e3d2c5',
    slogan: 'Nơi bình yên chạm sắc ngọc',
    explanation: 'Câu slogan giữ tinh thần Green Ruby tĩnh tại, giàu hình ảnh và gần với vẻ đẹp vịnh Lan Hạ.',
    followed_channels: ['facebook', 'instagram'],
    status: 'approved',
    vote_count: 11,
    is_seed: true,
    is_winner: false,
    flagged_for_review: false,
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
];

export async function getApprovedSubmissions(order: 'votes' | 'newest' = 'votes', limit = 24) {
  try {
    const supabase = createServiceSupabaseClient();
    const query = supabase
      .from('submissions')
      .select('*')
      .eq('status', 'approved')
      .eq('flagged_for_review', false)
      .limit(limit);

    const { data, error } =
      order === 'newest'
        ? await query.order('created_at', { ascending: false })
        : await query.order('vote_count', { ascending: false }).order('created_at', { ascending: false });

    if (error || !data) {
      return sampleSubmissions.slice(0, limit);
    }

    return data as Submission[];
  } catch {
    return sampleSubmissions.slice(0, limit);
  }
}

export async function getFeaturedSubmissions() {
  const [newest, mostVoted] = await Promise.all([
    getApprovedSubmissions('newest', 3),
    getApprovedSubmissions('votes', 3),
  ]);

  return { newest, mostVoted };
}

export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const submissions = await getApprovedSubmissions('votes');
  return submissions.slice(0, limit).map((submission) => ({
    id: submission.id,
    full_name: submission.full_name,
    slug: submission.slug,
    slogan: submission.slogan,
    vote_count: submission.vote_count,
    created_at: submission.created_at,
  }));
}

export async function getSubmissionBySlug(slug: string) {
  noStore();

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('slug', slug)
      .in('status', ['pending', 'approved'])
      .single();

    if (error || !data) {
      return sampleSubmissions.find((submission) => submission.slug === slug) ?? null;
    }

    return data as Submission;
  } catch {
    return sampleSubmissions.find((submission) => submission.slug === slug) ?? null;
  }
}

export async function getAllSubmissionsForAdmin() {
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Submission[];
}

export async function getWinnerSubmissions() {
  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', 'approved')
      .eq('is_winner', true)
      .order('vote_count', { ascending: false });

    if (error || !data || data.length === 0) {
      return sampleSubmissions.slice(0, 1).map((submission) => ({
        ...submission,
        is_winner: true,
      }));
    }

    return data as Submission[];
  } catch {
    return sampleSubmissions.slice(0, 1).map((submission) => ({
      ...submission,
      is_winner: true,
    }));
  }
}
