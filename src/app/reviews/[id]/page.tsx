"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/ui/Avatar";
import { timeAgo } from "@/lib/utils";
import type { Review } from "@/types/database";
import Link from "next/link";

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("*, profiles(*), launches(id, title)")
      .eq("id", id)
      .single()
      .then(({ data }) => setReview(data as Review));
  }, [id]);

  if (!review) return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse space-y-4">
      <div className="h-8 bg-surface rounded-xl w-2/3" />
      <div className="h-48 bg-surface rounded-2xl" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-2xl">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
        </div>
        <h1 className="text-3xl font-black">{review.title}</h1>
        <p className="text-muted">
          Review of{" "}
          <Link href={`/launches/${review.launch_id}`} className="text-accent hover:underline">
            {review.launches?.title}
          </Link>
        </p>
        <div className="flex items-center gap-3">
          <Avatar src={review.profiles?.avatar_url} name={review.profiles?.display_name} size="sm" />
          <div>
            <p className="text-sm font-semibold">{review.profiles?.display_name ?? review.profiles?.username}</p>
            <p className="text-xs text-muted">{timeAgo(review.created_at)}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{review.content}</p>
      </div>
    </div>
  );
}
