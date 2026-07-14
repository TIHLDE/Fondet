import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/content.json");

export async function GET() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return NextResponse.json(JSON.parse(raw));
}
