import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/content.json");

function readData() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: Record<string, unknown>) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(readData());
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const data = readData();
  if (body.reports !== undefined) {
    data.reports = body.reports;
  }
  if (body.applications !== undefined) {
    data.applications = body.applications;
  }
  writeData(data);
  return NextResponse.json({ success: true });
}
