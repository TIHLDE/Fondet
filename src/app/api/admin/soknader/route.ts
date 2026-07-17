import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/require-admin";
import { readJson, writeJson } from "@/lib/data-store";
import type { Soknad } from "@/data/soknader";
import { parseSoknad, sortByDatoDesc } from "./helpers";

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return unauthorized();

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
  rows.push(row);
  writeJson("soknader", sortByDatoDesc(rows));
  return NextResponse.json(row, { status: 201 });
}
