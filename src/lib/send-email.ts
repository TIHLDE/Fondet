import { Resend } from "resend";
import nodemailer from "nodemailer";

interface Mail {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

// True when an SMTP server is configured. SMTP takes precedence over Resend
// so the site can send mail without a Resend-verified domain (issue #133).
export function smtpConfigured(): boolean {
  return !!process.env.SMTP_HOST;
}

export function mailConfigured(): boolean {
  return smtpConfigured() || !!process.env.RESEND_API_KEY;
}

function fromAddress(): string {
  return process.env.MAIL_FROM || "TIHLDE Fondet <fondet@tihlde.org>";
}

async function sendViaSmtp(mail: Mail): Promise<void> {
  const port = Number(process.env.SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Port 465 is implicit TLS; 587/25 start plain and upgrade via STARTTLS.
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  await transport.sendMail({
    from: fromAddress(),
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  });
}

async function sendViaResend(mail: Mail): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: fromAddress(),
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  });
  if (error) throw new Error(error.message);
}

// Sends through SMTP when configured, otherwise Resend. Callers should check
// mailConfigured() first if they want to fail with a clear error instead.
export async function sendMail(mail: Mail): Promise<void> {
  if (smtpConfigured()) {
    await sendViaSmtp(mail);
    return;
  }
  await sendViaResend(mail);
}

// Sends the magic link. With no mail transport configured the link is printed
// to the server console instead (local dev), except in production where a
// missing transport is a real error.
export async function sendLoginEmail(email: string, url: string): Promise<void> {
  if (!mailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("No mail transport configured: set SMTP_HOST or RESEND_API_KEY");
    }
    console.log(`[auth] innloggingslenke for ${email}: ${url}`);
    return;
  }
  await sendMail({
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
}
