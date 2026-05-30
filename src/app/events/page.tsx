"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { RaphuntEvent } from "@/types/database";
import Link from "next/link";

const CITIES = ["Mumbai", "Delhi", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Pune", "Ahmedabad"];

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<RaphuntEvent[]>([]);
  const [interestMap, setInterestMap] = useState<Record<string, boolean>>({});
  const [interestCounts, setInterestCounts] = useState<Record<string, number>>({});
  const [cityFilter, setCityFilter] = useState("");
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityFilter, showUpcoming]);

  async function fetchEvents() {
    setLoading(true);
    const now = new Date().toISOString();

    let query = supabase
      .from("events")
      .select("*, profiles(id, username, display_name, avatar_url)")
      .eq("is_published", true)
      .order("listing_tier", { ascending: false }) // featured first
      .order("event_date", { ascending: true });

    if (cityFilter) query = query.eq("city", cityFilter);
    if (showUpcoming) query = query.gte("event_date", now);
    else query = query.lt("event_date", now);

    const { data } = await query.limit(40);
    const evs = (data as RaphuntEvent[]) ?? [];
    setEvents(evs);

    // fetch interest counts
    if (evs.length > 0) {
      const ids = evs.map((e) => e.id);
      const { data: counts } = await supabase
        .from("event_interests")
        .select("event_id")
        .in("event_id", ids);

      const countMap: Record<string, number> = {};
      (counts ?? []).forEach((r: { event_id: string }) => {
        countMap[r.event_id] = (countMap[r.event_id] ?? 0) + 1;
      });
      setInterestCounts(countMap);

      // fetch user interests
      if (user) {
        const { data: mine } = await supabase
          .from("event_interests")
          .select("event_id")
          .eq("user_id", user.id)
          .in("event_id", ids);
        const mineMap: Record<string, boolean> = {};
        (mine ?? []).forEach((r: { event_id: string }) => { mineMap[r.event_id] = true; });
        setInterestMap(mineMap);
      }
    }
    setLoading(false);
  }

  async function toggleInterest(eventId: string) {
    if (!user) return window.location.assign("/login");
    if (interestMap[eventId]) {
      await supabase.from("event_interests").delete().eq("user_id", user.id).eq("event_id", eventId);
      setInterestMap((m) => ({ ...m, [eventId]: false }));
      setInterestCounts((c) => ({ ...c, [eventId]: (c[eventId] ?? 1) - 1 }));
    } else {
      await supabase.from("event_interests").insert({ user_id: user.id, event_id: eventId });
      setInterestMap((m) => ({ ...m, [eventId]: true }));
      setInterestCounts((c) => ({ ...c, [eventId]: (c[eventId] ?? 0) + 1 }));
    }
  }

  // Separate featured from rest
  const featured = events.filter((e) => e.listing_tier === "featured");
  const rest = events.filter((e) => e.listing_tier !== "featured");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">🎪 Events</h1>
          <p className="text-muted text-sm mt-0.5">Live shows, cyphers & rap battles near you</p>
        </div>
        {user && (
          <Link href="/events/create">
            <Button size="sm">+ List an Event</Button>
          </Link>
        )}
      </div>

      {/* Pricing callout */}
      <div className="bg-surface-2 border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-2xl">💰</span>
        <div className="flex-1">
          <p className="font-semibold text-sm">Promote your event to thousands of hip-hop fans</p>
          <p className="text-xs text-muted mt-0.5">Basic ₹499 · Premium ₹999 · Featured ₹2,499 — one-time listing fee</p>
        </div>
        <Link href="/events/create">
          <Button variant="secondary" size="sm">List Event →</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpcoming(true)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all",
              showUpcoming ? "bg-accent border-accent text-white" : "border-border text-muted hover:text-white"
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setShowUpcoming(false)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all",
              !showUpcoming ? "bg-accent border-accent text-white" : "border-border text-muted hover:text-white"
            )}
          >
            Past
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setCityFilter("")}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all",
              !cityFilter ? "bg-accent/20 border-accent text-accent" : "border-border text-muted hover:text-white"
            )}
          >
            All Cities
          </button>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(cityFilter === c ? "" : c)}
              className={cn(
                "shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all",
                cityFilter === c ? "bg-accent/20 border-accent text-accent" : "border-border text-muted hover:text-white"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-5xl mb-3">🎪</p>
          <p className="font-semibold">No events {cityFilter ? `in ${cityFilter}` : ""} yet.</p>
          <p className="text-sm mt-1">Be the first to list one!</p>
          {user && (
            <Link href="/events/create" className="mt-4 inline-block">
              <Button>+ List an Event</Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Featured row */}
          {featured.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-bold text-sm text-accent uppercase tracking-widest">⭐ Featured Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    interested={interestMap[event.id]}
                    interestCount={interestCounts[event.id] ?? 0}
                    onInterest={() => toggleInterest(event.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  interested={interestMap[event.id]}
                  interestCount={interestCounts[event.id] ?? 0}
                  onInterest={() => toggleInterest(event.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
