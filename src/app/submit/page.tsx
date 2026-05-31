"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { getYouTubeId, isSpotifyUrl } from "@/lib/utils";

const GENRES = [
  { value: "trap", label: "Trap" },
  { value: "drill", label: "Drill" },
  { value: "boom_bap", label: "Boom Bap" },
  { value: "conscious", label: "Conscious" },
  { value: "gully", label: "Gully Rap" },
  { value: "desi_hiphop", label: "Desi Hip-Hop" },
  { value: "lofi_hiphop", label: "Lo-fi Hip-Hop" },
  { value: "old_school", label: "Old School" },
  { value: "battle_rap", label: "Battle Rap" },
  { value: "freestyle", label: "Freestyle" },
  { value: "spoken_word", label: "Spoken Word" },
  { value: "other", label: "Other" },
];

const LANGUAGES = [
  { value: "hindi", label: "Hindi" },
  { value: "english", label: "English" },
  { value: "marathi", label: "Marathi" },
  { value: "punjabi", label: "Punjabi" },
  { value: "tamil", label: "Tamil" },
  { value: "telugu", label: "Telugu" },
  { value: "bengali", label: "Bengali" },
  { value: "kannada", label: "Kannada" },
  { value: "malayalam", label: "Malayalam" },
  { value: "bhojpuri", label: "Bhojpuri" },
  { value: "haryanvi", label: "Haryanvi" },
  { value: "gujarati", label: "Gujarati" },
  { value: "odia", label: "Odia" },
  { value: "urdu", label: "Urdu" },
  { value: "other", label: "Other" },
];

export default function SubmitPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  function handleYouTubeChange(url: string) {
    setYoutubeUrl(url);
    const ytId = getYouTubeId(url);
    if (ytId) setThumbnail(`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`);
    else if (!url) setThumbnail("");
  }

  function handleSpotifyChange(url: string) {
    setSpotifyUrl(url);
    // Auto-fill title from Spotify URL path if title empty
    if (!title && url.includes("spotify.com/track/")) {
      // e.g. open.spotify.com/track/xxxxx?si=yyy
      // We can't fetch metadata client-side without API, just keep it clean
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    if (profile.role !== "artist" && profile.role !== "admin") {
      setError("Only verified artists can submit tracks.");
      return;
    }

    // At least one URL required
    const primaryUrl = youtubeUrl.trim() || spotifyUrl.trim();
    if (!primaryUrl) {
      setError("Please add at least a YouTube or Spotify link.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: err } = await supabase.from("launches").insert({
      artist_id: user.id,
      title,
      description: description || null,
      media_url: primaryUrl,
      spotify_url: spotifyUrl.trim() || null,
      youtube_url: youtubeUrl.trim() || null,
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
            <p className="text-muted text-sm">We&apos;ll email you once approved. Usually within 48 hours.</p>
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

        {/* YouTube */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <span className="text-red-500">▶</span> YouTube URL
          </label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => handleYouTubeChange(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
            placeholder="https://youtube.com/watch?v=..."
          />
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt="thumbnail" className="mt-2 rounded-xl w-full max-h-40 object-cover" />
          )}
        </div>

        {/* Spotify */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <span className="text-green-500">♫</span> Spotify URL
          </label>
          <input
            type="url"
            value={spotifyUrl}
            onChange={(e) => handleSpotifyChange(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
            placeholder="https://open.spotify.com/track/..."
          />
        </div>

        <p className="text-xs text-muted -mt-2">Add at least one link. Both is better — fans can listen on their preferred platform.</p>

        {/* Title */}
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

        {/* Description */}
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

        {/* Genre + Language */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
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
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
            placeholder="Mumbai, Delhi, Pune..."
          />
        </div>

        {error && <p className="text-accent text-sm">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading || (!youtubeUrl && !spotifyUrl)}>
          {loading ? "Dropping..." : "🚀 Drop It"}
        </Button>
      </form>
    </div>
  );
}
