"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SubmissionsPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (profile && profile.role !== "admin") router.push("/");
  }, [profile, router]);

  if (loading) return (<div className="min-h-screen flex items-center justify-center text-muted">Loading…</div>);
  if (!profile || profile.role !== "admin") return (<div className="min-h-screen flex items-center justify-center text-center px-4"><div><p className="text-4xl mb-4">🔒</p><h2 className="text-xl font-bold">Admin Access Only</h2></div></div>);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-6">Flagged Content</h1>
      <div className="text-center py-16 text-muted">
        <p className="text-4xl mb-3">🚩</p>
        <p>No flagged content to review.</p>
      </div>
    </div>
  );
}
