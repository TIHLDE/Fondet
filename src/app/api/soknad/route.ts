import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    sokerNavn,
    kontaktperson,
    telefon,
    epost,
    hvemSoker,
    onsketSum,
    hvaStotte,
    begrunnelse,
    konsekvenser,
    budsjett,
    tillegg,
  } = body;

  if (!sokerNavn || !kontaktperson || !telefon || !epost || !hvemSoker || !onsketSum || !hvaStotte || !begrunnelse) {
    return NextResponse.json({ error: "Mangler påkrevde felt" }, { status: 400 });
  }

  const sum = Number(onsketSum);
  if (isNaN(sum) || sum < 5000) {
    return NextResponse.json({ error: "Minimum søknadssum er 5 000 kr" }, { status: 400 });
  }

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
${hvemSoker}

Ønsket sum:
${Number(onsketSum).toLocaleString("nb-NO")} kr

Hva søkes det om støtte til?
${hvaStotte}

Begrunnelse for støtte:
${begrunnelse}

Konsekvenser dersom støtte ikke tildeles:
${konsekvenser || "Ikke oppgitt"}


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
      from: "TIHLDE-Fondet Søknad <onboarding@resend.dev>",
      to: "fondet@tihlde.org",
      replyTo: epost,
      subject: `Søknad om støtte fra ${sokerNavn} – ${Number(onsketSum).toLocaleString("nb-NO")} kr`,
      text: emailBody,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json({ error: "Kunne ikke sende søknad" }, { status: 500 });
  }
}
