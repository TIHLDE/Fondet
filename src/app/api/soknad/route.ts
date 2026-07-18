import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { validateSoknad } from "@/lib/soknad-validation";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    sokerNavn,
    kontaktperson,
    telefon,
    epost,
    onsketSum,
    hvaStotte,
    begrunnelse,
    konsekvenser,
    budsjett,
    tillegg,
  } = body;

  const validationError = validateSoknad(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "E-postutsending er ikke konfigurert" }, { status: 503 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  const budsjettLines = (budsjett as { utgift: string; sum: string }[])
    .filter((b) => b.utgift && b.sum)
    .map((b) => `  ${b.utgift}: ${b.sum} kr`)
    .join("\n");

  const dato = new Date().toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const emailBody = `Fra:
${sokerNavn}

Kontaktperson: ${kontaktperson}
Telefon: ${telefon}
Epost: ${epost}
Dato: ${dato}

Til:
TIHLDE-Fondet
Epost: fondet@tihlde.org


═══════════════════════════════════════
  SØKNADSSKJEMA FOR STØTTE FRA TIHLDE-FONDET
═══════════════════════════════════════


FORMÅL
──────

Hvem søker?
${sokerNavn}

Ønsket sum:
${Number(onsketSum).toLocaleString("nb-NO")} kr

Hva søkes det om støtte til?
${hvaStotte}

Begrunnelse for støtte:
${begrunnelse}

Konsekvenser dersom støtte ikke tildeles:
${konsekvenser}


BUDSJETT
────────
${budsjettLines || "  Ingen poster oppgitt"}

  Total sum: ${Number(onsketSum).toLocaleString("nb-NO")} kr


TILLEGGSINFORMASJON
───────────────────
${tillegg || "Ingen"}
`;

  try {
    await resend.emails.send({
      from: "TIHLDE-Fondet Søknad <fondet@tihlde.org>",
      to: "fondet@tihlde.org",
      replyTo: epost,
      subject: `Søknad om støtte fra ${sokerNavn}: ${Number(onsketSum).toLocaleString("nb-NO")} kr`,
      text: emailBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json({ error: "Kunne ikke sende søknad" }, { status: 500 });
  }
}
