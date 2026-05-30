"use client";

import { getYouTubeId, isSpotifyUrl, getSpotifyEmbed } from "@/lib/utils";

interface LaunchPlayerProps {
  mediaUrl: string;
}

export function LaunchPlayer({ mediaUrl }: LaunchPlayerProps) {
  const ytId = getYouTubeId(mediaUrl);

  if (ytId) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-surface-2">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  if (isSpotifyUrl(mediaUrl)) {
    const embedUrl = getSpotifyEmbed(mediaUrl);
    return (
      <div className="w-full rounded-2xl overflow-hidden bg-surface-2">
        <iframe
          src={embedUrl}
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-surface-2 rounded-2xl p-4 flex items-center justify-center h-32 text-muted">
      <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
        Open track ↗
      </a>
    </div>
  );
}
