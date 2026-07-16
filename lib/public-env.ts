const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  turnstileSiteKey: process.env.CAMPAIGN_TURNSTILE_SITE_KEY ?? '',
  turnstileEnabled: process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === 'true',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://greenrubycruises.com',
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
};

export { publicEnv };
