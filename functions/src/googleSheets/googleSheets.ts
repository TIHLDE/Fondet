import { Request, Response } from 'express';
import { HttpFunction } from '@google-cloud/functions-framework';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import groupBy from '../util/groupBy';
import { Application, Member } from './interfaces';

export const updateSheetsData: HttpFunction = async (_: Request, res: Response) => {
  const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
  doc.useApiKey(process.env.SHEETS_API_KEY ?? '');

  await doc.loadInfo();

  Promise.all([getPreviousApplications(doc), getCurrentMembers(doc), getPreviousMembers(doc)])
    .then(([previousApplications, currentMembers, previousMembers]) => {
      // TODO: Upload to storage
      res.status(200).send({
        previousApplications,
        currentMembers,
        previousMembers: Object.fromEntries(previousMembers),
      });
    })
    .catch((error) => {
      // TODO: Log error
      console.log(error);
      res.sendStatus(500);
    });
};

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
