import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/members.json");

function readData() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: Record<string, unknown>) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

interface MemberRecord {
  id: string;
  endYear?: number;
  startYear: number;
}

export async function GET() {
  const raw = readData();
  const all: MemberRecord[] = [...raw.allMembers, ...raw.previousMembers];
  const current = all
    .filter((m) => !m.endYear)
    .sort((a, b) => a.startYear - b.startYear);
  const previous = all
    .filter((m) => !!m.endYear)
    .sort((a, b) => (b.endYear ?? 0) - (a.endYear ?? 0) || b.startYear - a.startYear);
  return NextResponse.json({ groupImage: raw.groupImage ?? "", allMembers: current, previousMembers: previous });
}

export async function PUT(request: NextRequest) {
  const { member } = await request.json();

  if (!member?.id) {
    return NextResponse.json({ error: "Missing member.id" }, { status: 400 });
  }

  const data = readData();
  let found = false;
  let updated: MemberRecord | null = null;

  for (const listKey of ["allMembers", "previousMembers"] as const) {
    const arr = data[listKey] as MemberRecord[];
    const idx = arr.findIndex((m) => m.id === member.id);
    if (idx !== -1) {
      arr[idx] = { ...arr[idx], ...member };
      updated = arr[idx];
      found = true;
      break;
    }
  }

  if (!found) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  writeData(data);
  return NextResponse.json({ success: true, member: updated });
}
