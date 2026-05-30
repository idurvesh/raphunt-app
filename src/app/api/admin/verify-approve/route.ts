import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { sendVerificationApprovedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { requestId, userId, instagramHandle } = await req.json();

  // Update verification request
  await supabase
    .from("verification_requests")
    .update({ status: "approved" })
    .eq("id", requestId);

  // Flip user to artist
  await supabase
    .from("profiles")
    .update({ role: "artist", is_verified: true, instagram_handle: instagramHandle })
    .eq("id", userId);

  // Get user email + username to send notification
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  const { data: authUser } = await supabase.auth.admin.getUserById(userId);
  const email = authUser?.user?.email;

  if (email && profile?.username) {
    try {
      await sendVerificationApprovedEmail(email, profile.username);
    } catch (e) {
      console.error("Email send failed:", e);
      // Don't fail the approval if email fails
    }
  }

  return NextResponse.json({ success: true });
}
