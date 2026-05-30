"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { timeAgo } from "@/lib/utils";
import type { Comment } from "@/types/database";

interface CommentThreadProps {
  launchId: string;
}

export function CommentThread({ launchId }: CommentThreadProps) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase
      .from("comments")
      .select("*, profiles(*)")
      .eq("launch_id", launchId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .then(({ data }) => setComments((data as Comment[]) ?? []));
  }, [launchId]);

  async function postComment() {
    if (!user || !content.trim()) return;
    setLoading(true);
    const { data } = await supabase
      .from("comments")
      .insert({ user_id: user.id, launch_id: launchId, content: content.trim() })
      .select("*, profiles(*)")
      .single();
    if (data) setComments((prev) => [data as Comment, ...prev]);
    setContent("");
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Comments</h3>

      {user ? (
        <div className="flex gap-3">
          <Avatar src={profile?.avatar_url} name={profile?.display_name} size="sm" />
          <div className="flex-1 flex gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="flex-1 bg-surface-2 border border-border rounded-xl px-3 py-2 text-sm text-white placeholder-muted resize-none focus:outline-none focus:border-accent"
            />
            <Button size="sm" onClick={postComment} disabled={loading || !content.trim()}>
              Post
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">
          <a href="/login" className="text-accent hover:underline">Sign in</a> to comment.
        </p>
      )}

      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar src={comment.profiles?.avatar_url} name={comment.profiles?.display_name} size="sm" />
            <div className="flex-1 bg-surface-2 rounded-xl px-3 py-2 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold">{comment.profiles?.display_name ?? comment.profiles?.username}</span>
                <span className="text-xs text-muted">{timeAgo(comment.created_at)}</span>
              </div>
              <p className="text-sm text-white/90">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
