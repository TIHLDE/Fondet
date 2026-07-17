import { NextResponse } from "next/server";
import { readJson } from "@/lib/data-store";

// Volume-first data: without this the route is static-optimized at build
// time and admin edits never show.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(readJson("content"));
}
