import { Resend } from "resend";

// Lazy init so build doesn't fail when RESEND_API_KEY is not set
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = "RapHunt <noreply@desiraphunt.com>";

export async function sendVerificationApprovedEmail(to: string, username: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "You're verified on RapHunt 🎤",
    html: `
      <div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;max-width:480px;margin:0 auto;border-radius:16px">
        <h1 style="color:#E63946;font-size:28px;margin:0 0 8px">RAPHUNT</h1>
        <h2 style="margin:0 0 16px">You're a verified artist ✅</h2>
        <p style="color:#888">Hey @${username}, your artist account has been verified.</p>
        <p style="color:#888">You can now drop tracks and reach the Indian hip-hop community.</p>
        <a href="https://desiraphunt.com/submit"
           style="display:inline-block;margin-top:24px;background:#E63946;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">
          Drop Your First Track →
        </a>
      </div>
    `,
  });
}

export async function sendNewDropEmail(to: string, artistName: string, trackTitle: string, trackId: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `${artistName} just dropped "${trackTitle}" 🔥`,
    html: `
      <div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;max-width:480px;margin:0 auto;border-radius:16px">
        <h1 style="color:#E63946;font-size:28px;margin:0 0 8px">RAPHUNT</h1>
        <h2 style="margin:0 0 16px">New drop 🔥</h2>
        <p style="color:#888"><strong style="color:#fff">${artistName}</strong> just dropped a new track.</p>
        <p style="color:#fff;font-size:20px;font-weight:bold">"${trackTitle}"</p>
        <a href="https://desiraphunt.com/launches/${trackId}"
           style="display:inline-block;margin-top:24px;background:#E63946;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">
          Listen & Upvote →
        </a>
      </div>
    `,
  });
}
