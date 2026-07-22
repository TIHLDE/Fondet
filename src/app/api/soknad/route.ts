import { NextRequest, NextResponse } from "next/server";
import {
  mailConfigured,
  sendMail,
  textBlocks,
  type EmailContentBlock,
} from "@/lib/send-email";
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

  if (!mailConfigured()) {
    return NextResponse.json({ error: "E-postutsending er ikke konfigurert" }, { status: 503 });
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

  const sum = Number(onsketSum).toLocaleString("nb-NO");

  const content: EmailContentBlock[] = [
    { type: "title", content: "Søknad om støtte fra TIHLDE-Fondet" },
    { type: "text", content: `Fra: ${sokerNavn}` },
    { type: "text", content: `Kontaktperson: ${kontaktperson}` },
    { type: "text", content: `Telefon: ${telefon} — E-post: ${epost}` },
    { type: "text", content: `Dato: ${dato}` },
    { type: "title", content: "Formål" },
    { type: "text", content: `Ønsket sum: ${sum} kr` },
    { type: "text", content: "Hva søkes det om støtte til?" },
    ...textBlocks(hvaStotte),
    { type: "text", content: "Begrunnelse for støtte:" },
    ...textBlocks(begrunnelse),
    { type: "text", content: "Konsekvenser dersom støtte ikke tildeles:" },
    ...textBlocks(konsekvenser),
    { type: "title", content: "Budsjett" },
    ...textBlocks(budsjettLines || "Ingen poster oppgitt"),
    { type: "text", content: `Total sum: ${sum} kr` },
    { type: "title", content: "Tilleggsinformasjon" },
    ...textBlocks(tillegg || "Ingen"),
  ];

  try {
    await sendMail({
      to: "fondet@tihlde.org",
      subject: `Søknad om støtte fra ${sokerNavn}: ${sum} kr`,
      content,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send email:", err);
    return NextResponse.json({ error: "Kunne ikke sende søknad" }, { status: 500 });
  }
}
