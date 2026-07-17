import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/require-admin";
import { readJson, writeJson } from "@/lib/data-store";
import type { Member, MembersFile } from "@/data/members";
import { memberFields, slugify } from "./helpers";

// Raw members file for the admin UI, both current and previous members.
export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) return unauthorized();
  return NextResponse.json(readJson<MembersFile>("members"));
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }
  const parsed = memberFields(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { name, role, studie, startYear, endYear, linkedin } = parsed.value;
  if (!name || !role || !studie || !startYear) {
    return NextResponse.json(
      { error: "Navn, rolle, studie og startår er påkrevd" },
      { status: 400 },
    );
  }

  const id = slugify(name);
  if (!id) {
    return NextResponse.json({ error: "Ugyldig navn" }, { status: 400 });
  }
  const data = readJson<MembersFile>("members");
  const taken = [...data.allMembers, ...data.previousMembers].some(
    (m) => m.id === id,
  );
  if (taken) {
    return NextResponse.json(
      { error: `Det finnes allerede et medlem med id ${id}` },
      { status: 409 },
    );
  }

  const member: Member = {
    id,
    name,
    role,
    studie,
    startYear,
    image: "",
    ...(endYear ? { endYear } : {}),
    ...(linkedin ? { linkedin } : {}),
  };
  if (member.endYear) data.previousMembers.push(member);
  else data.allMembers.push(member);
  writeJson("members", data);
  return NextResponse.json(member, { status: 201 });
}
