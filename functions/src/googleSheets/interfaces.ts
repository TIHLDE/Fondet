export interface SheetsData {
  previousApplications: Application[];
  currentMembers: Member[];
  previousMembers: Record<string, Member[]>;
}

export interface Application {
  applicant: string;
  purpose: string;
  dateReceived: string;
  approved: string;
  requestedSum: string;
  approvedSum: string;
  applicationUrl: string;
  decisionUrl: string;
}

export interface Member {
  name: string;
  title: string;
  imageUrl: string;
  year?: string;
}
