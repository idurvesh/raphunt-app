"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { EVENT_TIER_PRICES } from "@/types/database";

const PLANS = [
  {
    id: "basic",
    name: "Basic Listing",
    emoji: "📌",
    price: EVENT_TIER_PRICES.basic,
    description: "Ideal for local events and cyphers.",
    features: [
      "Listed in the main Events feed",
      "Filterable by City & Genre",
      "Show 'Interested' buttons for fans",
      "Instant active listing post verification",
    ],
    cta: "List Basic Event",
    popular: false,
    color: "border-border",
    badgeColor: "bg-surface-2 text-white",
  },
  {
    id: "premium",
    name: "Premium Promotion",
    emoji: "✨",
    price: EVENT_TIER_PRICES.premium,
    description: "Boost your event visibility to active fans.",
    features: [
      "Everything in Basic Listing",
      "✨ Premium badge highlight on card",
      "Appears higher in city search results",
      "Thicker card border to stand out",
      "Email notification to local fans",
    ],
    cta: "Go Premium",
    popular: true,
    color: "border-yellow-600/60 bg-yellow-950/5",
    badgeColor: "bg-yellow-500 text-black",
  },
  {
    id: "featured",
    name: "Featured Banner",
    emoji: "⭐",
    price: EVENT_TIER_PRICES.featured,
    description: "Maximum exposure across the entire platform.",
    features: [
      "Everything in Premium Promotion",
      "⭐ Pinned at the top of all events",
      "Main landing page promo placement",
      "High-contrast accent card styling",
      "Dedicated social media mention",
    ],
    cta: "Go Featured",
    popular: false,
    color: "border-accent/60 bg-accent/5",
    badgeColor: "bg-accent text-white",
  },
];

export default function CheckoutLandingPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
          Choose Your <span className="text-accent">Listing Tier</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto text-base md:text-lg">
          Promote your event to the largest dedicated Indian Hip-Hop community. Secure checkout with UPI, Net Banking, and Cards.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
              plan.popular ? "shadow-2xl shadow-yellow-950/20" : ""
            } ${plan.color}`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full bg-yellow-500 text-black uppercase tracking-wider">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-2xl mr-2">{plan.emoji}</span>
                  <h3 className="text-xl font-bold text-white inline-block">{plan.name}</h3>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${plan.badgeColor}`}>
                  ONE-TIME
                </span>
              </div>

              <p className="text-sm text-muted">{plan.description}</p>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">₹{plan.price.toLocaleString("en-IN")}</span>
                <span className="text-sm text-muted">/ event</span>
              </div>

              <hr className="border-border" />

              <ul className="space-y-3 text-sm">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-muted">
                    <span className="text-green-500 font-bold shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link href={user ? "/events/create" : "/login?redirect=/events/create"}>
                <Button
                  className="w-full"
                  variant={plan.popular ? "primary" : "secondary"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Safety & Compliance Badge */}
      <div className="max-w-2xl mx-auto text-center bg-surface border border-border rounded-2xl p-6 space-y-3">
        <p className="text-sm font-semibold text-white">💳 Safe & Secure Transactions</p>
        <p className="text-xs text-muted leading-relaxed">
          Payments are processed via secure RBI-licensed aggregators in India. Your billing info is encrypted over SSL. By proceeding, you agree to our{" "}
          <Link href="/terms" className="text-accent hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/refund-policy" className="text-accent hover:underline">
            Refund Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
