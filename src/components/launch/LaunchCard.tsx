"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Launch } from "@/types/database";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { formatCount, timeAgo } from "@/lib/utils";

interface LaunchCardProps {
  launch: Launch;
}

export function LaunchCard({ launch }: LaunchCardProps) {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(launch.upvotes_count);
  const [upvoted, setUpvoted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleUpvote(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) return window.location.assign("/login");
    if (loading) return;

    setLoading(true);
    if (upvoted) {
      await supabase.from("upvotes").delete().eq("user_id", user.id).eq("launch_id", launch.id);
      setUpvotes((v) => v - 1);
      setUpvoted(false);
    } else {
      await supabase.from("upvotes").insert({ user_id: user.id, launch_id: launch.id });
      setUpvotes((v) => v + 1);
      setUpvoted(true);
    }
    setLoading(false);
  }

  const artist = launch.profiles;
  const thumbnail = launch.thumbnail_url ?? `https://img.youtube.com/vi/default/mqdefault.jpg`;

  return (
    <Link href={`/launches/${launch.id}`}>
      <div className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all hover:bg-surface-2">
        <div className="relative aspect-video bg-surface-2">
          <Image
            src={thumbnail}
            alt={launch.title}
            fill
            className="object-cover"
            unoptimized
          />
          {launch.is_sponsored && (
            <span className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs px-2 py-0.5 rounded-full border border-yellow-800">
              Sponsored
            </span>
          )}
          {launch.is_featured && (
            <span className="absolute top-2 left-2 bg-accent/80 text-white text-xs px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3">
            <Avatar src={artist?.avatar_url} name={artist?.display_name ?? artist?.username} size="sm" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate group-hover:text-accent transition-colors">
                {launch.title}
              </h3>
              <p className="text-sm text-muted flex items-center gap-1">
                {artist?.display_name ?? artist?.username}
                {artist?.is_verified && <span className="text-accent text-xs">✓</span>}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {launch.genre && <Badge variant="default">{launch.genre}</Badge>}
              {launch.language && <Badge variant="muted">{launch.language}</Badge>}
              {launch.city && <Badge variant="muted">📍 {launch.city}</Badge>}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">{timeAgo(launch.created_at)}</span>
              <button
                onClick={toggleUpvote}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${
                  upvoted
                    ? "bg-accent/20 border-accent text-accent"
                    : "bg-surface-2 border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                ▲ {formatCount(upvotes)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
