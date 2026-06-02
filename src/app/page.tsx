"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-lg mx-auto space-y-8">
        {/* Logo */}
        <div className="space-y-2">
          <h1 className="font-display font-black text-6xl md:text-8xl tracking-tighter">
            <span className="text-accent">RAP</span>HUNT
          </h1>
          <p className="text-muted text-lg md:text-xl font-inter">
            Indian hip-hop drops. Discover. Upvote. Repeat.
          </p>
        </div>

        {/* Launch date */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted font-semibold">Launching</p>
          <p className="font-display font-black text-4xl md:text-5xl text-white">June 15, 2026</p>
          <p className="text-muted text-sm">
            Free artist verification. Unlimited drops. Community-powered charts.
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link
            href="/signup"
            className="inline-block w-full bg-accent hover:bg-accent/90 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all"
          >
            Get Early Access
          </Link>
          <p className="text-muted text-xs">
            Artists — sign up now, get verified, and drop your tracks on day one.
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            ["🎤", "Free Artist Verification"],
            ["📀", "Unlimited Track Drops"],
            ["⬆", "Community Upvoting"],
          ].map(([emoji, text]) => (
            <div key={text} className="bg-surface border border-border rounded-xl p-3 flex items-center gap-2">
              <span>{emoji}</span>
              <span className="text-muted">{text}</span>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <p className="text-xs text-muted">
          Made for desi hip-hop. For fans, by fans.
        </p>
      </div>
    </div>
  );
}
