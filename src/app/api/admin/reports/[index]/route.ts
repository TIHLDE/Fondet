import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/require-admin";
import { readJson, writeJson } from "@/lib/data-store";
import { reportFields, type ContentFile } from "../helpers";

type Params = { params: Promise<{ index: string }> };

function entryAt(content: ContentFile, raw: string): number {
  const i = Number(raw);
  if (!Number.isInteger(i) || i < 0 || i >= content.reports.length) return -1;
  return i;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await requireAdmin(request))) return unauthorized();
  const { index } = await params;

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

  const content = readJson<ContentFile>("content");
  const i = entryAt(content, index);
  if (i < 0) {
    return NextResponse.json({ error: "Fant ikke raden" }, { status: 404 });
  }
  Object.assign(content.reports[i], parsed.value);
  writeJson("content", content);
  return NextResponse.json(content.reports[i]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await requireAdmin(request))) return unauthorized();
  const { index } = await params;

  const content = readJson<ContentFile>("content");
  const i = entryAt(content, index);
  if (i < 0) {
    return NextResponse.json({ error: "Fant ikke raden" }, { status: 404 });
  }
  content.reports.splice(i, 1);
  writeJson("content", content);
  return NextResponse.json({ ok: true });
}
