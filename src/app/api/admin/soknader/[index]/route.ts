import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/require-admin";
import { readJson, writeJson } from "@/lib/data-store";
import type { Soknad } from "@/data/soknader";
import { parseSoknad, sortByDatoDesc } from "../helpers";

type Params = { params: Promise<{ index: string }> };

function rowAt(rows: Soknad[], raw: string): number {
  const i = Number(raw);
  if (!Number.isInteger(i) || i < 0 || i >= rows.length) return -1;
  return i;
}

// Replaces the whole row; the admin form always sends every field.
export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await requireAdmin(request))) return unauthorized();
  const { index } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }
  const row = parseSoknad(body);
  if (!row) {
    return NextResponse.json(
      { error: "Ugyldig rad. Alle felt må fylles ut, dato som DD.MM.ÅÅÅÅ" },
      { status: 400 },
    );
  }

  const rows = readJson<Soknad[]>("soknader");
  const i = rowAt(rows, index);
  if (i < 0) {
    return NextResponse.json({ error: "Fant ikke raden" }, { status: 404 });
  }
  rows[i] = row;
  writeJson("soknader", sortByDatoDesc(rows));
  return NextResponse.json(row);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await requireAdmin(request))) return unauthorized();
  const { index } = await params;

  const rows = readJson<Soknad[]>("soknader");
  const i = rowAt(rows, index);
  if (i < 0) {
    return NextResponse.json({ error: "Fant ikke raden" }, { status: 404 });
  }
  rows.splice(i, 1);
  writeJson("soknader", rows);
  return NextResponse.json({ ok: true });
}
