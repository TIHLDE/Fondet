import { GoogleSpreadsheet } from 'google-spreadsheet';

const doc = new GoogleSpreadsheet('1u6bBCsJAUlSKctGSSM26biK9-IQ8Lvf8vrzBJRsunGQ');
doc.useApiKey('AIzaSyBgmnwf2-FfY_6OfddaZPyqz0c4jkJ8Eas');

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

class GoogleSheetsApi {
  public static async getPreviousApplications(): Promise<Application[]> {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Søknader'];
    const rows = await sheet.getRows();

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

export default GoogleSheetsApi;
