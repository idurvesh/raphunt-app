"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LaunchCard } from "@/components/launch/LaunchCard";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import type { Profile, Launch } from "@/types/database";

export default function ArtistPage() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single()
      .then(({ data }) => {
        setProfile(data);
        if (data) {
          supabase
            .from("launches")
            .select("*, profiles(*)")
            .eq("artist_id", data.id)
            .order("created_at", { ascending: false })
            .then(({ data: l }) => setLaunches((l as Launch[]) ?? []));

          supabase
            .from("follows")
            .select("*", { count: "exact" })
            .eq("following_id", data.id)
            .then(({ count }) => setFollowerCount(count ?? 0));

          if (user) {
            supabase
              .from("follows")
              .select("*")
              .eq("follower_id", user.id)
              .eq("following_id", data.id)
              .maybeSingle()
              .then(({ data: f }) => setFollowing(!!f));
          }
        }
      });
  }, [username, user]);

  async function toggleFollow() {
    if (!user || !profile) return window.location.assign("/login");
    if (following) {
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", profile.id);
      setFollowing(false);
      setFollowerCount((n) => n - 1);
    } else {
      await supabase.from("follows").insert({ follower_id: user.id, following_id: profile.id });
      setFollowing(true);
      setFollowerCount((n) => n + 1);
    }
  }

  if (!profile) return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4 animate-pulse">
      <div className="h-32 bg-surface rounded-2xl" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-start gap-5">
        <Avatar src={profile.avatar_url} name={profile.display_name ?? profile.username} size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-black">{profile.display_name ?? profile.username}</h1>
            {profile.is_verified && <Badge variant="accent">✓ Verified Artist</Badge>}
          </div>
          <p className="text-muted text-sm">@{profile.username}</p>
          {profile.city && <p className="text-sm text-muted mt-1">📍 {profile.city}</p>}
          {profile.bio && <p className="text-sm mt-2">{profile.bio}</p>}

          <div className="flex items-center gap-4 mt-3">
            <div className="text-center">
              <p className="font-bold">{launches.length}</p>
              <p className="text-xs text-muted">Tracks</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{followerCount}</p>
              <p className="text-xs text-muted">Followers</p>
            </div>
            {user?.id !== profile.id && (
              <Button
                variant={following ? "secondary" : "primary"}
                size="sm"
                onClick={toggleFollow}
              >
                {following ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-lg mb-4">Drops</h2>
        {launches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {launches.map((launch) => <LaunchCard key={launch.id} launch={launch} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-muted">
            <p className="text-3xl mb-2">🎤</p>
            <p>No tracks dropped yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
