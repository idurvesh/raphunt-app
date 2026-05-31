"use client";

import { getYouTubeId, isSpotifyUrl, getSpotifyEmbed } from "@/lib/utils";
import type { Launch } from "@/types/database";

interface LaunchPlayerProps {
  launch: Pick<Launch, "media_url" | "youtube_url" | "spotify_url">;
}

function YouTubePlayer({ url }: { url: string }) {
  const ytId = getYouTubeId(url);
  if (!ytId) return null;
  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-surface-2">
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

function SpotifyPlayer({ url }: { url: string }) {
  const embedUrl = getSpotifyEmbed(url);
  return (
    <div className="w-full rounded-2xl overflow-hidden">
      <iframe
        src={embedUrl}
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="w-full"
        style={{ borderRadius: "16px" }}
      />
    </div>
  );
}

export function LaunchPlayer({ launch }: LaunchPlayerProps) {
  const ytUrl = launch.youtube_url || (getYouTubeId(launch.media_url) ? launch.media_url : null);
  const spUrl = launch.spotify_url || (isSpotifyUrl(launch.media_url) ? launch.media_url : null);

  // Both platforms available
  if (ytUrl && spUrl) {
    return (
      <div className="space-y-3">
        <YouTubePlayer url={ytUrl} />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Also on</span>
          <SpotifyPlayer url={spUrl} />
        </div>
      </div>
    );
  }

  if (ytUrl) return <YouTubePlayer url={ytUrl} />;
  if (spUrl) return <SpotifyPlayer url={spUrl} />;

  return (
    <div className="w-full bg-surface-2 rounded-2xl p-4 flex items-center justify-center h-32 text-muted">
      <a href={launch.media_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
        Open track
      </a>
    </div>
  );
}
