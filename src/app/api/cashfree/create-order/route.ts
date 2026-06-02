import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, receipt, email = "customer@example.com", userId = "anonymous" } = await req.json();

    const isProduction = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === "production";
    const baseUrl = isProduction 
      ? "https://api.cashfree.com/pg/orders" 
      : "https://sandbox.cashfree.com/pg/orders";

    const requestBody = {
      order_amount: amount, // Cashfree expects standard currency units (e.g. Rupees, not Paise)
      order_currency: "INR",
      order_id: receipt || `cf_order_${Date.now()}`,
      customer_details: {
        customer_id: userId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50) || "anonymous_user",
        customer_email: email,
        customer_phone: "9999999999", // Fallback required phone number
      },
      order_meta: {
        // We handle verification inside modal callback, but return_url is required by Cashfree
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/events?order_id={order_id}`
      }
    };

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree order creation error from gateway:", data);
      return NextResponse.json({ error: data.message || "Failed to create Cashfree order" }, { status: response.status });
    }

    return NextResponse.json({ 
      paymentSessionId: data.payment_session_id, 
      orderId: data.order_id,
      amount, 
      currency: "INR" 
    });
  } catch (err: unknown) {
    console.error("Cashfree order creation failed:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
