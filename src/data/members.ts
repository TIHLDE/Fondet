import { readJson } from "@/lib/data-store";

export interface Member {
  id: string;
  name: string;
  role: string;
  image: string;
  startYear: number;
  endYear?: number;
  studie: string;
  linkedin?: string;
}

export interface MembersFile {
  groupImage?: string;
  allMembers: Member[];
  previousMembers: Member[];
}

function load(): Member[] {
  const data = readJson<MembersFile>("members");
  return [...data.allMembers, ...data.previousMembers];
}

// Fondsforvalter leads, Eldste follows, the rest by longest membership.
const ROLE_ORDER = ["Fondsforvalter", "Eldste"];

function roleRank(role: string): number {
  const i = ROLE_ORDER.indexOf(role);
  return i === -1 ? ROLE_ORDER.length : i;
}

export function getCurrentMembers(): Member[] {
  return load()
    .filter((m) => !m.endYear)
    .sort(
      (a, b) =>
        roleRank(a.role) - roleRank(b.role) || a.startYear - b.startYear,
    );
}

export function getPreviousMembers(): Member[] {
  return load()
    .filter((m) => !!m.endYear)
    .sort(
      (a, b) => (b.endYear ?? 0) - (a.endYear ?? 0) || b.startYear - a.startYear,
    );
}

export function getGroupImage(): string {
  return readJson<MembersFile>("members").groupImage ?? "";
}
