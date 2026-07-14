export const SOCIAL_CHANNELS = [
  {
    id: 'tiktok',
    label: 'TikTok',
    webUrl: 'https://www.tiktok.com/@greenrubyofficial',
    deepLink: 'tiktok://user?username=greenrubyofficial',
    icon: 'IconBrandTiktok',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    webUrl: 'https://www.facebook.com/greenrubyofficial',
    deepLink: 'fb://facewebmodal/f?href=https://www.facebook.com/greenrubyofficial',
    icon: 'IconBrandFacebook',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    webUrl: 'https://www.instagram.com/greenrubyofficial',
    deepLink: 'instagram://user?username=greenrubyofficial',
    icon: 'IconBrandInstagram',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    webUrl: 'https://www.youtube.com/@greenrubyofficial',
    deepLink: null,
    icon: 'IconBrandYoutube',
  },
] as const;
