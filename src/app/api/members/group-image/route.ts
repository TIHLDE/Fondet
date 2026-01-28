import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/members.json");

export async function PUT(request: NextRequest) {
  const { groupImage } = await request.json();

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const data = JSON.parse(raw);
  data.groupImage = groupImage ?? "";
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({ success: true });
}
