import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", receipt, notes } = await req.json();

    const order = await getRazorpay().orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency,
      receipt,
      notes,
    });

    return NextResponse.json({ orderId: order.id, amount, currency });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
