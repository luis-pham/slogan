import { createServiceSupabaseClient } from '@/lib/supabase/server';
import type { CampaignSettings } from '@/lib/types';

const fallbackCampaign: CampaignSettings = {
  id: 1,
  phase: 'submission',
  submission_start: new Date().toISOString(),
  submission_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  voting_start: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
  voting_end: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
};

export async function getCampaignSettings() {
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
