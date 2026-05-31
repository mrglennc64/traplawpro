// Pluggable email transport. Today the server has no mail provider configured,
// so sendMail logs and reports { sent: false }. The moment RESEND_API_KEY (or
// later SMTP_* support) is set in .env.local, magic-link delivery "turns on"
// with no other code change. No npm dependency — Resend is called over HTTP.
export interface MailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail(input: MailInput): Promise<{ sent: boolean; provider: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "TrapLawPro <noreply@traplawpro.com>";

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: input.to,
          subject: input.subject,
          html: input.html,
          text: input.text,
        }),
      });
      if (res.ok) return { sent: true, provider: "resend" };
      console.error("[mailer] resend failed", res.status, await res.text());
    } catch (e) {
      console.error("[mailer] resend error", e);
    }
    return { sent: false, provider: "resend" };
  }

  // No provider configured — do NOT leak the link to the client; just log it
  // server-side so it's diagnosable in dev/until a provider is added.
  console.warn(
    `[mailer] no email provider configured (set RESEND_API_KEY). Would send to ${input.to}: ${input.subject}`
  );
  return { sent: false, provider: "none" };
}
