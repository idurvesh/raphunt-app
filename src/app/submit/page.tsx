"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { getYouTubeId } from "@/lib/utils";

const GENRES = ["trap", "drill", "boom_bap", "conscious", "other"];
const LANGUAGES = ["hindi", "english", "tamil", "bengali", "punjabi", "other"];

export default function SubmitPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [city, setCity] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if this fan has a pending verification request
  useEffect(() => {
    if (user && profile && profile.role === "fan") {
      supabase
        .from("verification_requests")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .maybeSingle()
        .then(({ data }) => setHasPendingRequest(!!data));
    }
  }, [user, profile]);

  function handleUrlChange(url: string) {
    setMediaUrl(url);
    const ytId = getYouTubeId(url);
    if (ytId) setThumbnail(`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    if (profile.role !== "artist" && profile.role !== "admin") {
      setError("Only verified artists can submit tracks.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: err } = await supabase.from("launches").insert({
      artist_id: user.id,
      title,
      description,
      media_url: mediaUrl,
      thumbnail_url: thumbnail || null,
      genre: genre || null,
      language: language || null,
      city: city || null,
    });

    if (err) setError(err.message);
    else router.push("/");
    setLoading(false);
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="text-2xl mb-4">🔒</p>
        <p className="text-muted">Please <a href="/login" className="text-accent hover:underline">sign in</a> to submit a track.</p>
      </div>
    </div>
  );

  if (profile && profile.role !== "artist" && profile.role !== "admin") return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-4xl mb-4">🎤</p>
        {hasPendingRequest ? (
          <>
            <h2 className="text-xl font-bold mb-2">Verification Pending ⏳</h2>
            <p className="text-muted mb-2">Your artist verification request is under review.</p>
            <p className="text-muted text-sm">We&apos;ll email you at <strong className="text-white">desiraphunt.com</strong> once approved. Usually within 48 hours.</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2">Artist Account Required</h2>
            <p className="text-muted mb-4">You need a verified artist account to submit tracks.</p>
            <a href="/verify-artist"><Button>Get Verified</Button></a>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-black">Drop a Track 🎤</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">YouTube or Spotify URL *</label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
            placeholder="https://youtube.com/watch?v=..."
            required
          />
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt="thumbnail preview" className="mt-2 rounded-xl w-full max-h-40 object-cover" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Track Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
            placeholder="Track name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent resize-none"
            placeholder="Tell fans about the track..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
            >
              <option value="">Select language</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
            placeholder="Mumbai, Delhi, Kolkata..."
          />
        </div>

        {error && <p className="text-accent text-sm">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Submitting…" : "🚀 Drop It"}
        </Button>
      </form>
    </div>
  );
}
