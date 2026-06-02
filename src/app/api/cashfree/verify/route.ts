import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const {
      orderId,
      eventData,
      organizerId,
      tier,
      amount,
    } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const isProduction = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "production";
    const baseUrl = isProduction 
      ? `https://api.cashfree.com/pg/orders/${orderId}` 
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    // Verify payment status directly with Cashfree
    const cfResponse = await fetch(baseUrl, {
      method: "GET",
      headers: {
        "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
        "x-api-version": "2023-08-01",
      },
    });

    const cfData = await cfResponse.json();

    if (!cfResponse.ok) {
      console.error("Cashfree order verification fetch error:", cfData);
      return NextResponse.json({ error: cfData.message || "Failed to verify order with Cashfree" }, { status: cfResponse.status });
    }

    if (cfData.order_status !== "PAID") {
      return NextResponse.json({ 
        error: `Payment verification failed. Current status: ${cfData.order_status}` 
      }, { status: 400 });
    }

    // Payment is verified — create the event in database
    const supabase = createServerClient();

    const { data: event, error: eventErr } = await supabase
      .from("events")
      .insert({
        ...eventData,
        organizer_id: organizerId,
        listing_tier: tier,
        listing_paid: true,
        is_published: true,
        is_featured: tier === "featured",
      })
      .select()
      .single();

    if (eventErr || !event) {
      console.error("Event insertion error:", eventErr);
      return NextResponse.json({ error: "Failed to create event in database" }, { status: 500 });
    }

    // Record payment in event_listing_payments. 
    // We map cashfree IDs into the existing razorpay columns to avoid DB migration.
    const { error: paymentErr } = await supabase
      .from("event_listing_payments")
      .insert({
        event_id: event.id,
        organizer_id: organizerId,
        tier,
        amount,
        payment_status: "paid",
        razorpay_order_id: orderId, // Map Cashfree Order ID
        razorpay_payment_id: cfData.payment_session_id || orderId, // Map Cashfree Session ID or Order ID
      });

    if (paymentErr) {
      console.error("Payment ledger insertion error:", paymentErr);
      // We don't fail the request completely since the event was already created, but we log the error
    }

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (err: unknown) {
    console.error("Payment verification route failed:", err);
    const message = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
