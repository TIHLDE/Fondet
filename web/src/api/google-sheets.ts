import { GoogleSpreadsheet } from 'google-spreadsheet';
import groupBy from 'utils/groupBy';

const doc = new GoogleSpreadsheet('1u6bBCsJAUlSKctGSSM26biK9-IQ8Lvf8vrzBJRsunGQ');
doc.useApiKey('AIzaSyBgmnwf2-FfY_6OfddaZPyqz0c4jkJ8Eas');

let sheetLoaded = false;
function loadInfo(): Promise<void> | void {
  if (sheetLoaded) return;
  return doc.loadInfo().then(() => {
    sheetLoaded = true;
  });
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

let applications: Application[] | undefined = undefined;

async function getPreviousApplications(): Promise<Application[]> {
  if (applications === undefined) {
    await loadInfo();
    const sheet = doc.sheetsByTitle['Søknader'];
    const rows = await sheet.getRows();

    applications = rows
      .filter((row) => row['Synlig'])
      .map((row) => ({
        applicant: row['Søker'],
        purpose: row['Formål'],
        dateReceived: row['Dato mottatt'],
        approved: row['Resultat'],
        requestedSum: row['Sum søkt'],
        approvedSum: row['Sum innvilget'],
        applicationUrl: row['Url søknad'],
        decisionUrl: row['Url beslutningsgrunnlag'],
      }))
      .reverse();
  }
  return applications;
}

export interface Member {
  name: string;
  title: string;
  imageUrl: string;
  year?: string;
}

let currentMembers: Member[] | undefined = undefined;

async function getCurrentMembers(): Promise<Member[]> {
  if (currentMembers === undefined) {
    await loadInfo();
    const sheet = doc.sheetsByTitle['Medlemmer'];
    const rows = await sheet.getRows();

    currentMembers = rows
      .filter((row) => row['Synlig'])
      .map((row) => ({
        name: row['Navn'],
        title: row['Tittel'],
        imageUrl: row['Url bilde'],
      }));
  }
  return currentMembers;
}

let previousMembers: Map<string, Member[]> | undefined = undefined;

async function getPreviousMembers(): Promise<Map<string, Member[]>> {
  if (previousMembers === undefined) {
    await loadInfo();
    const sheet = doc.sheetsByTitle['Tidligere medlemmer'];
    const rows = await sheet.getRows();

    const previousMembersList = rows
      .filter((row) => row['Synlig'])
      .map((row) => ({
        name: row['Navn'],
        title: row['Tittel'],
        imageUrl: row['Url bilde'],
        year: row['År'],
      }));

    previousMembers = new Map([...groupBy(previousMembersList, (m: Member) => m.year ?? 'N/A')].reverse());
  }
  return previousMembers;
}

const Api = {
  getPreviousApplications,
  getCurrentMembers,
  getPreviousMembers,
};

export default Api;
