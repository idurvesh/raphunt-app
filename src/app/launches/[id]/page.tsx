"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LaunchPlayer } from "@/components/launch/LaunchPlayer";
import { CommentThread } from "@/components/comments/CommentThread";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { formatCount, timeAgo } from "@/lib/utils";
import type { Launch } from "@/types/database";
import Link from "next/link";

export default function LaunchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from("launches")
      .select("*, profiles(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setLaunch(data as Launch);
        setUpvotes(data?.upvotes_count ?? 0);
      });

    if (user) {
      supabase
        .from("upvotes")
        .select("id")
        .eq("user_id", user.id)
        .eq("launch_id", id)
        .maybeSingle()
        .then(({ data }) => setUpvoted(!!data));
    }
  }, [id, user]);

  async function toggleUpvote() {
    if (!user) return window.location.assign("/login");
    if (loading || !launch) return;
    setLoading(true);
    if (upvoted) {
      await supabase.from("upvotes").delete().eq("user_id", user.id).eq("launch_id", id);
      setUpvotes((v) => v - 1);
      setUpvoted(false);
    } else {
      await supabase.from("upvotes").insert({ user_id: user.id, launch_id: id });
      setUpvotes((v) => v + 1);
      setUpvoted(true);
    }
    setLoading(false);
  }

  if (!launch) return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-surface rounded-2xl h-32 animate-pulse" />
      ))}
    </div>
  );

  const artist = launch.profiles;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <LaunchPlayer launch={launch} />

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-black">{launch.title}</h1>
          <button
            onClick={toggleUpvote}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
              upvoted
                ? "bg-accent/20 border-accent text-accent"
                : "bg-surface-2 border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            ▲ {formatCount(upvotes)}
          </button>
        </div>

        <Link href={`/artists/${artist?.username}`} className="flex items-center gap-3 hover:opacity-80">
          <Avatar src={artist?.avatar_url} name={artist?.display_name} size="md" />
          <div>
            <p className="font-semibold flex items-center gap-1">
              {artist?.display_name ?? artist?.username}
              {artist?.is_verified && <span className="text-accent text-xs">✓</span>}
            </p>
            <p className="text-xs text-muted">@{artist?.username}</p>
          </div>
        </Link>

        <div className="flex flex-wrap gap-2">
          {launch.genre && <Badge>{launch.genre}</Badge>}
          {launch.language && <Badge variant="muted">{launch.language}</Badge>}
          {launch.city && <Badge variant="muted">📍 {launch.city}</Badge>}
          {launch.is_sponsored && <Badge variant="yellow">Sponsored</Badge>}
          {launch.is_featured && <Badge variant="accent">Featured</Badge>}
        </div>

        {launch.description && (
          <p className="text-muted text-sm leading-relaxed">{launch.description}</p>
        )}

        <p className="text-xs text-muted">{timeAgo(launch.created_at)}</p>
      </div>

      <div className="border-t border-border pt-6">
        <CommentThread launchId={id} />
      </div>
    </div>
  );
}
