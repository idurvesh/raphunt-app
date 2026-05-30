"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { timeAgo } from "@/lib/utils";
import type { Review } from "@/types/database";
import Link from "next/link";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("*, profiles(id, username, display_name), launches(id, title)")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        setReviews((data as Review[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-black">⭐ Reviews</h1>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Link key={review.id} href={`/reviews/${review.id}`}>
              <div className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  <span className="text-xs text-muted">for <span className="text-white">{review.launches?.title}</span></span>
                </div>
                <h3 className="font-bold">{review.title}</h3>
                <p className="text-muted text-sm mt-1">{review.content.slice(0, 150)}…</p>
                <p className="text-xs text-muted mt-2">by {review.profiles?.display_name} · {timeAgo(review.created_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-3">⭐</p>
          <p>No reviews yet.</p>
        </div>
      )}
    </div>
  );
}
