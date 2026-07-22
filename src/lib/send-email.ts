// E-post sendes via Photon sitt e-post-API (POST /api/email/send), samme
// infrastruktur som resten av TIHLDE. Photon eier avsenderadresse, mal og
// SMTP-oppsett; Fondet trenger bare URL + API-nøkkel.

// Innholdsblokker slik Photon sitt CustomEmail-skjema definerer dem.
export type EmailContentBlock =
  | { type: "title"; content: string }
  | { type: "text"; content: string }
  | { type: "button"; text: string; url: string };

interface Mail {
  to: string;
  subject: string;
  content: EmailContentBlock[];
}

export function mailConfigured(): boolean {
  return !!process.env.PHOTON_API_URL && !!process.env.PHOTON_EMAIL_API_KEY;
}

// Photon rendrer hver text-blokk som ett HTML-avsnitt, så linjeskift inni en
// blokk kollapser. Del derfor flerlinjetekst opp i én blokk per linje.
export function textBlocks(text: string): EmailContentBlock[] {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ type: "text" as const, content: line }));
}

// Sender via Photon. Callers bør sjekke mailConfigured() først hvis de vil
// feile med en tydelig melding i stedet.
export async function sendMail(mail: Mail): Promise<void> {
  const base = (process.env.PHOTON_API_URL || "").replace(/\/+$/, "");
  const res = await fetch(`${base}/api/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PHOTON_EMAIL_API_KEY}`,
    },
    body: JSON.stringify({
      to: mail.to,
      subject: mail.subject,
      content: mail.content,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Photon email API svarte ${res.status}: ${body}`);
  }
}

// Sends the magic link. With no mail transport configured the link is printed
// to the server console instead (local dev), except in production where a
// missing transport is a real error.
export async function sendLoginEmail(email: string, url: string): Promise<void> {
  if (!mailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "No mail transport configured: set PHOTON_API_URL and PHOTON_EMAIL_API_KEY",
      );
    }
    console.log(`[auth] innloggingslenke for ${email}: ${url}`);
    return;
  }
  await sendMail({
    to: email,
    subject: "Innlogging til TIHLDE Fondet",
    content: [
      { type: "title", content: "Innlogging til TIHLDE Fondet" },
      {
        type: "text",
        content:
          "Bruk knappen under for å logge inn på TIHLDE Fondet. Lenken er gyldig i 15 minutter.",
      },
      { type: "button", text: "Logg inn", url },
      {
        type: "text",
        content: "Hvis du ikke ba om denne e-posten, kan du se bort fra den.",
      },
    ],
  });
}
