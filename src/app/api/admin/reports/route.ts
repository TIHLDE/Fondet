import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/require-admin";
import { readJson, writeJson } from "@/lib/data-store";
import { reportFields, type ContentFile } from "./helpers";

// Adds a row to the report list on /reports. The PDF itself is uploaded
// separately via ./upload; entries can also point at external links.
export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }
  const parsed = reportFields(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { title, url, type } = parsed.value;
  if (!title || !url || !type) {
    return NextResponse.json(
      { error: "Tittel, lenke og kategori er påkrevd" },
      { status: 400 },
    );
  }

  const content = readJson<ContentFile>("content");
  content.reports.unshift({ title, url, type });
  writeJson("content", content);
  return NextResponse.json({ title, url, type }, { status: 201 });
}
