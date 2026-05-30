"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { EventListingTier } from "@/types/database";
import { EVENT_TIER_PRICES } from "@/types/database";

const GENRES = ["trap", "drill", "boom_bap", "conscious", "other"];
const CITIES = ["Mumbai", "Delhi", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Pune", "Ahmedabad", "Other"];

const TIER_INFO: Record<EventListingTier, { label: string; emoji: string; perks: string[] }> = {
  basic: {
    label: "Basic",
    emoji: "📌",
    perks: ["Listed in Events feed", "City filter visible", "Interested button"],
  },
  premium: {
    label: "Premium",
    emoji: "✨",
    perks: ["Everything in Basic", "✨ Premium badge", "Higher in city results", "Bold card border"],
  },
  featured: {
    label: "Featured",
    emoji: "⭐",
    perks: ["Everything in Premium", "⭐ Pinned at top of all events", "Highlighted accent card", "Best visibility"],
  },
};

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<"details" | "tier" | "confirm">("details");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [eventDate, setEventDate] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [lineupInput, setLineupInput] = useState("");
  const [ticketPriceFrom, setTicketPriceFrom] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [tier, setTier] = useState<EventListingTier>("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lineup = lineupInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  async function handleSubmit() {
    if (!user) return;
    setLoading(true);
    setError("");

    // Create event
    const { data: event, error: err } = await supabase
      .from("events")
      .insert({
        organizer_id: user.id,
        title,
        description: description || null,
        venue,
        city,
        event_date: eventDate,
        ticket_url: ticketUrl || null,
        poster_url: posterUrl || null,
        genre: (genre as typeof genre) || null,
        lineup: lineup.length > 0 ? lineup : null,
        ticket_price_from: isFree ? null : parseInt(ticketPriceFrom) || null,
        is_free: isFree,
        listing_tier: tier,
        listing_paid: false, // set to true after payment confirmation
        is_featured: tier === "featured",
      })
      .select()
      .single();

    if (err || !event) {
      setError(err?.message ?? "Failed to create event");
      setLoading(false);
      return;
    }

    // Create pending payment record
    await supabase.from("event_listing_payments").insert({
      event_id: event.id,
      organizer_id: user.id,
      tier,
      amount: EVENT_TIER_PRICES[tier],
    });

    setLoading(false);
    // In production, redirect to Razorpay here. For now go to event page.
    router.push(`/events/${event.id}?new=1`);
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <p className="text-2xl mb-4">🔒</p>
        <p className="text-muted">Please <a href="/login" className="text-accent hover:underline">sign in</a> to list an event.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2 text-sm">
        {(["details", "tier", "confirm"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              step === s ? "bg-accent text-white" : "bg-surface-2 text-muted border border-border"
            )}>
              {i + 1}
            </span>
            <span className={step === s ? "text-white font-semibold" : "text-muted"}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 2 && <span className="text-border">→</span>}
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-black">🎪 List an Event</h1>

      {/* ─── Step 1: Details ─── */}
      {step === "details" && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
              placeholder="e.g. Mumbai Cypher Vol. 3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent resize-none"
              placeholder="Describe the event, vibe, what to expect..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Venue *</label>
              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
                placeholder="Club / Hall name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
              >
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date & Time *</label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lineup (comma-separated)</label>
            <input
              value={lineupInput}
              onChange={(e) => setLineupInput(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
              placeholder="MC Name, Artist B, DJ XYZ"
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
                <option value="">Any genre</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ticket Price (INR from)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={isFree ? "" : ticketPriceFrom}
                  onChange={(e) => setTicketPriceFrom(e.target.value)}
                  disabled={isFree}
                  className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent disabled:opacity-40"
                  placeholder="499"
                />
              </div>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="accent-accent" />
                <span className="text-sm text-muted">Free Entry</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ticket Link (BookMyShow / Paytm etc.)</label>
            <input
              type="url"
              value={ticketUrl}
              onChange={(e) => setTicketUrl(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
              placeholder="https://bookmyshow.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Poster URL</label>
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-accent"
              placeholder="https://... (direct image link)"
            />
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              if (!title || !venue || !city || !eventDate) {
                setError("Please fill in all required fields.");
                return;
              }
              setError("");
              setStep("tier");
            }}
          >
            Next: Choose Listing Tier →
          </Button>
          {error && <p className="text-accent text-sm">{error}</p>}
        </div>
      )}

      {/* ─── Step 2: Tier selection ─── */}
      {step === "tier" && (
        <div className="space-y-5">
          <p className="text-muted text-sm">Choose how prominently your event is listed. All plans are one-time listing fees — no subscription.</p>

          <div className="space-y-3">
            {(["basic", "premium", "featured"] as EventListingTier[]).map((t) => {
              const info = TIER_INFO[t];
              const price = EVENT_TIER_PRICES[t];
              return (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={cn(
                    "w-full text-left rounded-2xl border p-5 transition-all",
                    tier === t
                      ? t === "featured"
                        ? "border-accent bg-accent/10"
                        : t === "premium"
                        ? "border-yellow-600 bg-yellow-900/10"
                        : "border-white bg-surface-2"
                      : "border-border bg-surface hover:border-muted"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base">
                      {info.emoji} {info.label}
                    </span>
                    <span className={cn(
                      "text-xl font-black",
                      t === "featured" ? "text-accent" : t === "premium" ? "text-yellow-400" : "text-white"
                    )}>
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {info.perks.map((p) => (
                      <li key={p} className="text-sm text-muted flex items-center gap-2">
                        <span className="text-green-400">✓</span> {p}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStep("details")}>← Back</Button>
            <Button className="flex-1" onClick={() => setStep("confirm")}>
              Next: Confirm →
            </Button>
          </div>
        </div>
      )}

      {/* ─── Step 3: Confirm & pay ─── */}
      {step === "confirm" && (
        <div className="space-y-5">
          <div className="bg-surface border border-border rounded-2xl divide-y divide-border">
            {[
              ["Event", title],
              ["Venue", `${venue}, ${city}`],
              ["Date", new Date(eventDate).toLocaleString("en-IN")],
              ["Lineup", lineup.join(", ") || "—"],
              ["Tickets", isFree ? "Free Entry" : ticketPriceFrom ? `from ₹${parseInt(ticketPriceFrom).toLocaleString("en-IN")}` : "TBA"],
              ["Listing Tier", `${TIER_INFO[tier].emoji} ${TIER_INFO[tier].label}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-start px-5 py-3 gap-4">
                <span className="text-muted text-sm shrink-0">{label}</span>
                <span className="text-sm font-semibold text-right">{value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center px-5 py-4 bg-surface-2">
              <span className="font-bold">Total Listing Fee</span>
              <span className="text-2xl font-black text-accent">
                ₹{EVENT_TIER_PRICES[tier].toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-4 text-sm text-yellow-300">
            ⚠️ Payment integration (Razorpay) coming soon. For now, your event will be submitted and our team will reach out to collect payment before it goes live.
          </div>

          {error && <p className="text-accent text-sm">{error}</p>}

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setStep("tier")}>← Back</Button>
            <Button className="flex-1" size="lg" disabled={loading} onClick={handleSubmit}>
              {loading ? "Submitting…" : `Submit Event — ₹${EVENT_TIER_PRICES[tier].toLocaleString("en-IN")}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
