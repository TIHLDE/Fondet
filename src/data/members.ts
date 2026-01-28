import membersData from "./members.json";

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

const all: Member[] = [
  ...(membersData.allMembers as Member[]),
  ...(membersData.previousMembers as Member[]),
];

export const allMembers: Member[] = all
  .filter((m) => !m.endYear)
  .sort((a, b) => a.startYear - b.startYear);
export const previousMembers: Member[] = all
  .filter((m) => !!m.endYear)
  .sort((a, b) => (b.endYear ?? 0) - (a.endYear ?? 0) || b.startYear - a.startYear);

export function getCurrentMembers(): Member[] {
  return allMembers;
}

export function getPreviousMembers(): Member[] {
  return previousMembers;
}

export function getGroupImage(): string {
  return membersData.groupImage ?? "";
}
