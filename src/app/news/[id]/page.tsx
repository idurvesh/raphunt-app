"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils";
import type { News } from "@/types/database";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<News | null>(null);

  useEffect(() => {
    supabase
      .from("news")
      .select("*, profiles(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => setArticle(data as News));
  }, [id]);

  if (!article) return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4 animate-pulse">
      <div className="h-8 bg-surface rounded-xl w-2/3" />
      <div className="h-48 bg-surface rounded-2xl" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-3">
        {article.is_sponsored && <Badge variant="yellow">Sponsored</Badge>}
        <h1 className="text-3xl font-black">{article.title}</h1>
        <div className="flex items-center gap-3">
          <Avatar src={article.profiles?.avatar_url} name={article.profiles?.display_name} size="sm" />
          <div>
            <p className="text-sm font-semibold">{article.profiles?.display_name ?? article.profiles?.username}</p>
            <p className="text-xs text-muted">{timeAgo(article.created_at)}</p>
          </div>
        </div>
      </div>

      {article.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.cover_image_url} alt={article.title} className="w-full rounded-2xl object-cover max-h-64" />
      )}

      <div className="prose prose-invert max-w-none">
        <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{article.content}</p>
      </div>
    </div>
  );
}
