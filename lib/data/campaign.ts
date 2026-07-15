import { unstable_noStore as noStore } from 'next/cache';
import { createServiceSupabaseClient } from '@/lib/supabase/server';
import type { CampaignSettings } from '@/lib/types';

const fallbackCampaign: CampaignSettings = {
  id: 1,
  phase: 'submission',
  submission_start: '2026-07-01T00:00:00+07:00',
  submission_end: '2026-07-31T23:59:59+07:00',
  voting_start: '2026-08-01T00:00:00+07:00',
  voting_end: '2026-08-03T23:59:59+07:00',
};

export async function getCampaignSettings() {
  noStore();

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from('campaign_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return fallbackCampaign;
    }

    return data as CampaignSettings;
  } catch {
    return fallbackCampaign;
  }
}
