import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/require-admin";
import { readJson, writeJson } from "@/lib/data-store";
import type { Member, MembersFile } from "@/data/members";
import { memberFields } from "../helpers";

type Params = { params: { id: string } };

function findMember(data: MembersFile, id: string): Member | undefined {
  return [...data.allMembers, ...data.previousMembers].find((m) => m.id === id);
}

export async function PATCH(request: NextRequest, { params }: Params) {
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

  const data = readJson<MembersFile>("members");
  const member = findMember(data, params.id);
  if (!member) {
    return NextResponse.json({ error: "Fant ikke medlemmet" }, { status: 404 });
  }

  Object.assign(member, parsed.value);
  // endYear: null clears it, which moves the person back to current members.
  if ((body as Record<string, unknown>).endYear === null) delete member.endYear;
  if (member.linkedin === "") delete member.linkedin;
  writeJson("members", data);
  return NextResponse.json(member);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await requireAdmin(request))) return unauthorized();

  const data = readJson<MembersFile>("members");
  if (!findMember(data, params.id)) {
    return NextResponse.json({ error: "Fant ikke medlemmet" }, { status: 404 });
  }
  data.allMembers = data.allMembers.filter((m) => m.id !== params.id);
  data.previousMembers = data.previousMembers.filter(
    (m) => m.id !== params.id,
  );
  writeJson("members", data);
  return NextResponse.json({ ok: true });
}
