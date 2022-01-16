import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import groupBy from '../util/groupBy';
import { Application, Member, SheetsData } from './interfaces';

const sheet_id = functions.config().google_sheets.sheet_id;
const sa_client_email = functions.config().google_sheets.sa_client_email;
const sa_private_key = functions.config().google_sheets.sa_private_key;
const apps_script_key = functions.config().google_sheets.apps_script_key;

function authenticatedRequest(handler: (req: functions.https.Request, resp: functions.Response) => void): functions.HttpsFunction {
  return functions.https.onRequest((req, res) => {
    if (req.headers.authorization !== `Bearer ${apps_script_key}`) {
      functions.logger.error('UNAUTHORIZED');
      res.sendStatus(401);
    } else {
      handler(req, res);
    }
  });
}

export const uploadFile = authenticatedRequest((req, res) => {
  const contentType = req.headers['content-type'];
  const data = req.rawBody;
  const filename = `files/${uuidv4()}`;
  const token = uuidv4();

  const bucket = admin.storage().bucket();
  const file = bucket.file(filename);
  file
    .save(data, {
      contentType,
      gzip: true,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    })
    .then(() => res.status(200).send(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${token}`))
    .catch((error) => {
      functions.logger.error(error);
      res.sendStatus(500);
    });
});

export const updateSheetsData = authenticatedRequest(async (_, res) => {
  const doc = new GoogleSpreadsheet(sheet_id);
  doc.useServiceAccountAuth({
    client_email: sa_client_email,
    private_key: sa_private_key,
  });
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
