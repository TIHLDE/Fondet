import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import groupBy from '../util/groupBy';
import { Application, Member, SheetsData } from './interfaces';

const sheet_id = functions.config().google_sheets.sheet_id;
const api_key = functions.config().google_sheets.api_key;

export const updateSheetsData = functions.https.onRequest(async (_, res) => {
  const doc = new GoogleSpreadsheet(sheet_id);
  doc.useApiKey(api_key);
  await doc.loadInfo();

  Promise.all([getPreviousApplications(doc), getCurrentMembers(doc), getPreviousMembers(doc)])
    .then(([previousApplications, currentMembers, previousMembers]) => {
      const sheetsData: SheetsData = {
        previousApplications,
        currentMembers,
        previousMembers: Object.fromEntries(previousMembers),
      };

      return admin
        .storage()
        .bucket()
        .file('database/sheet.json')
        .save(JSON.stringify(sheetsData), {
          gzip: true,
          contentType: 'application/json',
        })
        .then(() => {
          functions.logger.info('Updated data from Google Sheets.');
          res.sendStatus(204);
        });
    })
    .catch((error) => {
      functions.logger.error(error);
      res.sendStatus(500);
    });
});

async function getPreviousApplications(doc: GoogleSpreadsheet): Promise<Application[]> {
  const rows = await doc.sheetsByTitle['Søknader'].getRows();

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

async function getCurrentMembers(doc: GoogleSpreadsheet): Promise<Member[]> {
  const rows = await doc.sheetsByTitle['Medlemmer'].getRows();

  return rows
    .filter((row) => row['Synlig'])
    .map((row) => ({
      name: row['Navn'],
      title: row['Tittel'],
      imageUrl: row['Url bilde'],
    }));
}

async function getPreviousMembers(doc: GoogleSpreadsheet): Promise<Map<string, Member[]>> {
  const rows = await doc.sheetsByTitle['Tidligere medlemmer'].getRows();

  const previousMembersList: Member[] = rows
    .filter((row) => row['Synlig'])
    .map((row) => ({
      name: row['Navn'],
      title: row['Tittel'],
      imageUrl: row['Url bilde'],
      year: row['År'],
    }));

  return new Map([...groupBy(previousMembersList, (m: Member) => m.year ?? 'Ingen år')].reverse());
}
