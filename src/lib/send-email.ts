import { Resend } from "resend";

// Sends the magic link. Without RESEND_API_KEY the link is printed to the
// server console instead (local dev), except in production where a missing
// key is a real error.
export async function sendLoginEmail(email: string, url: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }
    console.log(`[auth] innloggingslenke for ${email}: ${url}`);
    return;
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: "TIHLDE Fondet <fondet@tihlde.org>",
    to: email,
    subject: "Innlogging til TIHLDE Fondet",
    text: [
      "Hei,",
      "",
      "Bruk denne lenken for å logge inn på TIHLDE Fondet. Den er gyldig i 15 minutter:",
      "",
      url,
      "",
      "Hvis du ikke ba om denne e-posten, kan du se bort fra den.",
    ].join("\n"),
  });
  if (error) throw new Error(error.message);
}
