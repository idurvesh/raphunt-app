import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventData,
      organizerId,
      tier,
      amount,
    } = await req.json();

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Payment verified — create the event
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
      return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }

    // Record payment
    await supabase.from("event_listing_payments").insert({
      event_id: event.id,
      organizer_id: organizerId,
      tier,
      amount,
      payment_status: "paid",
      razorpay_order_id,
      razorpay_payment_id,
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (err) {
    console.error("Payment verification failed:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
