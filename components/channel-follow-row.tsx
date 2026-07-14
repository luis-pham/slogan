'use client';

import {
  IconArrowRight,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandYoutube,
  IconCheck,
} from '@tabler/icons-react';
import { SOCIAL_CHANNELS } from '@/lib/constants';
import type { FollowedChannel } from '@/lib/types';

const channelIcons = {
  IconBrandTiktok,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
};

type SocialChannel = (typeof SOCIAL_CHANNELS)[number];

type ChannelFollowRowProps = {
  channel: SocialChannel;
  checked: boolean;
  onToggle: (channelId: FollowedChannel) => void;
};

const DEEP_LINK_FALLBACK_MS = 1500;

export function ChannelFollowRow({ channel, checked, onToggle }: ChannelFollowRowProps) {
  const Icon = channelIcons[channel.icon];

  function handleFollow() {
    if (channel.deepLink) {
      const fallbackTimer = window.setTimeout(() => {
        window.open(channel.webUrl, '_blank', 'noopener,noreferrer');
      }, DEEP_LINK_FALLBACK_MS);

      const cancelFallbackIfAppOpened = () => {
        if (document.hidden) {
          window.clearTimeout(fallbackTimer);
        }
      };

      document.addEventListener('visibilitychange', cancelFallbackIfAppOpened, { once: true });
      window.location.href = channel.deepLink;
    } else {
      window.open(channel.webUrl, '_blank', 'noopener,noreferrer');
    }

    if (!checked) {
      onToggle(channel.id);
    }
  }

  return (
    <div className="channel-follow-row">
      <button
        type="button"
        className="channel-follow-toggle"
        aria-pressed={checked}
        onClick={() => onToggle(channel.id)}
      >
        {checked ? (
          <IconCheck className="channel-check-icon" size={18} aria-hidden="true" />
        ) : (
          <span className="channel-checkbox-box" aria-hidden="true" />
        )}
        <Icon size={18} aria-hidden="true" />
        <span>{channel.label}</span>
      </button>

      {!checked ? (
        <button type="button" className="channel-follow-cta" onClick={handleFollow}>
          Theo dõi <IconArrowRight size={14} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
