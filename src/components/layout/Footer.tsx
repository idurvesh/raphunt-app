"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto w-full">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo & Description */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-display font-black text-2xl tracking-tighter">
                <span className="text-accent">RAP</span>HUNT
              </span>
            </Link>
            <p className="text-muted text-sm max-w-sm">
              Discover and support the best new Indian hip-hop drops, events, and reviews. The premier launchpad for Desi Hip-Hop artists.
            </p>
            <div className="text-xs text-muted pt-2">
              © {new Date().getFullYear()} RapHunt. All rights reserved.
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/launches" className="text-muted hover:text-white transition-colors">Launches</Link>
              </li>
              <li>
                <Link href="/charts" className="text-muted hover:text-white transition-colors">Charts</Link>
              </li>
              <li>
                <Link href="/events" className="text-muted hover:text-white transition-colors">Events</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white tracking-wider uppercase">Legal & Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-muted hover:text-white transition-colors">Refund & Cancellation</Link>
              </li>
              <li>
                <Link href="/shipping-delivery" className="text-muted hover:text-white transition-colors">Shipping & Delivery</Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-border my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>Designed and built for the Indian Hip-Hop Community.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
