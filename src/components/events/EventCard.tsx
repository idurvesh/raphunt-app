"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { RaphuntEvent } from "@/types/database";

interface EventCardProps {
  event: RaphuntEvent;
  interested?: boolean;
  onInterest?: () => void;
  interestCount?: number;
}

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEventTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

export function EventCard({ event, interested, onInterest, interestCount = 0 }: EventCardProps) {
  const past = isPast(event.event_date);

  return (
    <div
      className={cn(
        "group bg-surface border rounded-2xl overflow-hidden transition-all hover:border-accent/50",
        event.listing_tier === "featured"
          ? "border-accent/40 bg-accent/5"
          : event.listing_tier === "premium"
          ? "border-yellow-700/50"
          : "border-border"
      )}
    >
      {/* Poster */}
      {event.poster_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.poster_url}
          alt={event.title}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-surface-2 to-surface flex items-center justify-center text-5xl">
          🎤
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Tier badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {event.listing_tier === "featured" && <Badge variant="accent">⭐ Featured</Badge>}
          {event.listing_tier === "premium" && <Badge variant="yellow">✨ Premium</Badge>}
          {event.status === "cancelled" && <Badge variant="accent">Cancelled</Badge>}
          {past && event.status === "upcoming" && <Badge variant="muted">Past</Badge>}
          {event.is_free && <Badge variant="green">Free Entry</Badge>}
        </div>

        <Link href={`/events/${event.id}`}>
          <h3 className="font-black text-lg leading-tight group-hover:text-accent transition-colors cursor-pointer">
            {event.title}
          </h3>
        </Link>

        <div className="space-y-1 text-sm text-muted">
          <p className="flex items-center gap-2">
            <span>📅</span>
            <span className="text-white font-medium">{formatEventDate(event.event_date)}</span>
            <span>·</span>
            <span>{formatEventTime(event.event_date)}</span>
          </p>
          <p className="flex items-center gap-2">
            <span>📍</span>
            <span>{event.venue}, {event.city}</span>
          </p>
          {!event.is_free && event.ticket_price_from && (
            <p className="flex items-center gap-2">
              <span>🎟️</span>
              <span className="text-green-400 font-semibold">from ₹{event.ticket_price_from.toLocaleString("en-IN")}</span>
            </p>
          )}
        </div>

        {/* Lineup chips */}
        {event.lineup && event.lineup.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {event.lineup.slice(0, 4).map((artist) => (
              <span key={artist} className="text-xs bg-surface-2 border border-border rounded-full px-2 py-0.5 text-muted">
                {artist}
              </span>
            ))}
            {event.lineup.length > 4 && (
              <span className="text-xs text-muted">+{event.lineup.length - 4} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Avatar src={event.profiles?.avatar_url} name={event.profiles?.display_name} size="sm" />
            <span className="text-xs text-muted">{event.profiles?.display_name ?? event.profiles?.username}</span>
          </div>

          <div className="flex items-center gap-2">
            {event.genre && <Badge variant="muted">{event.genre}</Badge>}
            <button
              onClick={(e) => { e.preventDefault(); onInterest?.(); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                interested
                  ? "bg-accent/20 border-accent text-accent"
                  : "bg-surface-2 border-border text-muted hover:border-accent hover:text-accent"
              )}
            >
              {interested ? "✓" : "+"} Interested {interestCount > 0 && `· ${interestCount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
