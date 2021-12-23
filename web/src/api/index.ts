import { GoogleSpreadsheet } from 'google-spreadsheet';

import groupBy from 'utils/groupBy';

import { Application, Member } from './interfaces';
import SheetResource from './sheet-resource';

const doc = new GoogleSpreadsheet('1u6bBCsJAUlSKctGSSM26biK9-IQ8Lvf8vrzBJRsunGQ');
doc.useApiKey('AIzaSyBgmnwf2-FfY_6OfddaZPyqz0c4jkJ8Eas');

class PreviousApplicationsResource extends SheetResource<Application[]> {
  protected async fetch(): Promise<Application[]> {
    const rows = await this.doc.sheetsByTitle['Søknader'].getRows();

    return rows
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
}

class CurrentMembersResource extends SheetResource<Member[]> {
  protected async fetch(): Promise<Member[]> {
    const rows = await this.doc.sheetsByTitle['Medlemmer'].getRows();

    return rows
      .filter((row) => row['Synlig'])
      .map((row) => ({
        name: row['Navn'],
        title: row['Tittel'],
        imageUrl: row['Url bilde'],
      }));
  }
}

class PreviousMembersResource extends SheetResource<Map<string, Member[]>> {
  protected async fetch(): Promise<Map<string, Member[]>> {
    const rows = await this.doc.sheetsByTitle['Tidligere medlemmer'].getRows();

    const previousMembersList = rows
      .filter((row) => row['Synlig'])
      .map((row) => ({
        name: row['Navn'],
        title: row['Tittel'],
        imageUrl: row['Url bilde'],
        year: row['År'],
      }));

    return new Map([...groupBy(previousMembersList, (m: Member) => m.year ?? 'Ingen år')].reverse());
  }
}

export * from './interfaces';

export default {
  PreviousApplications: new PreviousApplicationsResource(doc),
  CurrentMembers: new CurrentMembersResource(doc),
  PreviousMembers: new PreviousMembersResource(doc),
};
