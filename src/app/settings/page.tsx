"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
      setCity(profile.city ?? "");
      setInstagramHandle(profile.instagram_handle ?? "");
    }
  }, [profile, user, router]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({
      display_name: displayName,
      bio,
      city,
      instagram_handle: instagramHandle,
    }).eq("id", user.id);
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center text-muted">Loading…</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-black">Settings</h1>

      <div className="flex items-center gap-4">
        <Avatar src={profile.avatar_url} name={profile.display_name ?? profile.username} size="lg" />
        <div>
          <p className="font-bold">{profile.username}</p>
          <p className="text-sm text-muted capitalize">{profile.role}</p>
          {profile.is_verified && <p className="text-xs text-accent">✓ Verified</p>}
        </div>
      </div>

      <form onSubmit={save} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent resize-none"
            placeholder="Tell the scene who you are..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
            placeholder="Mumbai, Delhi..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Instagram Handle</label>
          <div className="flex">
            <span className="bg-surface border border-r-0 border-border rounded-l-xl px-3 flex items-center text-muted text-sm">@</span>
            <input
              type="text"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value.replace("@", ""))}
              className="flex-1 bg-surface-2 border border-border rounded-r-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
              placeholder="yourhandle"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={saving}>
          {saved ? "✓ Saved!" : saving ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
