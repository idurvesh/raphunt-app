"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, timeAgo } from "@/lib/utils";
import type { RaphuntEvent } from "@/types/database";

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}
function fmtTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<RaphuntEvent | null>(null);
  const [interested, setInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(0);

  useEffect(() => {
    supabase
      .from("events")
      .select("*, profiles(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => setEvent(data as RaphuntEvent));

    supabase
      .from("event_interests")
      .select("*", { count: "exact", head: true })
      .eq("event_id", id)
      .then(({ count }) => setInterestCount(count ?? 0));

    if (user) {
      supabase
        .from("event_interests")
        .select("id")
        .eq("user_id", user.id)
        .eq("event_id", id)
        .maybeSingle()
        .then(({ data }) => setInterested(!!data));
    }
  }, [id, user]);

  async function toggleInterest() {
    if (!user) return window.location.assign("/login");
    if (interested) {
      await supabase.from("event_interests").delete().eq("user_id", user.id).eq("event_id", id);
      setInterested(false);
      setInterestCount((n) => n - 1);
    } else {
      await supabase.from("event_interests").insert({ user_id: user.id, event_id: id });
      setInterested(true);
      setInterestCount((n) => n + 1);
    }
  }

  if (!event) return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 animate-pulse">
      <div className="h-64 bg-surface rounded-2xl" />
      <div className="h-8 bg-surface rounded-xl w-2/3" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Poster */}
      {event.poster_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.poster_url} alt={event.title} className="w-full rounded-2xl object-cover max-h-80" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-surface-2 to-surface rounded-2xl flex items-center justify-center text-7xl">
          🎤
        </div>
      )}

      {/* Tier / status badges */}
      <div className="flex flex-wrap gap-2">
        {event.listing_tier === "featured" && <Badge variant="accent">⭐ Featured Event</Badge>}
        {event.listing_tier === "premium" && <Badge variant="yellow">✨ Premium Listing</Badge>}
        {event.is_free && <Badge variant="green">Free Entry</Badge>}
        {event.status === "cancelled" && <Badge variant="accent">Cancelled</Badge>}
        {event.genre && <Badge>{event.genre}</Badge>}
      </div>

      {/* Title + CTA */}
      <div className="space-y-3">
        <h1 className="text-3xl font-black">{event.title}</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleInterest}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all",
              interested
                ? "bg-accent/20 border-accent text-accent"
                : "bg-surface-2 border-border text-muted hover:border-accent hover:text-accent"
            )}
          >
            {interested ? "✓ Interested" : "+ I'm Interested"} · {interestCount}
          </button>

          {event.ticket_url && (
            <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
              <Button>
                🎟️ Get Tickets {event.ticket_price_from && !event.is_free ? `from ₹${event.ticket_price_from.toLocaleString("en-IN")}` : ""}
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div className="bg-surface border border-border rounded-2xl divide-y divide-border">
        <div className="flex items-center gap-4 p-4">
          <span className="text-2xl w-8 text-center">📅</span>
          <div>
            <p className="font-semibold">{fmt(event.event_date)}</p>
            <p className="text-sm text-muted">{fmtTime(event.event_date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4">
          <span className="text-2xl w-8 text-center">📍</span>
          <div>
            <p className="font-semibold">{event.venue}</p>
            <p className="text-sm text-muted">{event.city}</p>
          </div>
        </div>
        {!event.is_free && event.ticket_price_from && (
          <div className="flex items-center gap-4 p-4">
            <span className="text-2xl w-8 text-center">🎟️</span>
            <div>
              <p className="font-semibold text-green-400">from ₹{event.ticket_price_from.toLocaleString("en-IN")}</p>
              <p className="text-sm text-muted">Ticket price</p>
            </div>
          </div>
        )}
        {event.is_free && (
          <div className="flex items-center gap-4 p-4">
            <span className="text-2xl w-8 text-center">🎟️</span>
            <p className="font-semibold text-green-400">Free Entry</p>
          </div>
        )}
      </div>

      {/* Lineup */}
      {event.lineup && event.lineup.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-lg">Lineup</h2>
          <div className="flex flex-wrap gap-2">
            {event.lineup.map((artist) => (
              <span key={artist} className="bg-surface-2 border border-border rounded-full px-4 py-1.5 text-sm font-medium">
                🎤 {artist}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="space-y-2">
          <h2 className="font-bold text-lg">About</h2>
          <p className="text-muted leading-relaxed whitespace-pre-wrap">{event.description}</p>
        </div>
      )}

      {/* Organizer */}
      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted mb-2">Organised by</p>
        <div className="flex items-center gap-3">
          <Avatar src={event.profiles?.avatar_url} name={event.profiles?.display_name} size="sm" />
          <div>
            <p className="font-semibold text-sm">{event.profiles?.display_name ?? event.profiles?.username}</p>
            <p className="text-xs text-muted">{timeAgo(event.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
