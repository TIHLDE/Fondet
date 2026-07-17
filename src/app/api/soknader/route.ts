import { NextResponse } from "next/server";
import { readJson } from "@/lib/data-store";
import type { Soknad } from "@/data/soknader";

export async function GET() {
  return NextResponse.json(readJson<Soknad[]>("soknader"));
}
