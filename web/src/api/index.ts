import axios from 'axios';
import Resource from './resource';
import { NordnetData, SheetsData } from './interfaces';

class SheetsResource extends Resource<SheetsData> {
  protected async fetch(): Promise<SheetsData> {
    const { data }: { data: SheetsData } = await axios.get(
      'https://firebasestorage.googleapis.com/v0/b/fondet.appspot.com/o/database%2Fsheet.json?alt=media&token=368f5be7-1f6d-4dbd-8274-d257b2d42ad5',
    );
    return data;
  }
}

class NordnetResource extends Resource<NordnetData> {
  protected async fetch(): Promise<NordnetData> {
    const { data }: { data: NordnetData } = await axios.get(
      'https://firebasestorage.googleapis.com/v0/b/fondet.appspot.com/o/database%2Fnordnet.json?alt=media',
    );
    return data;
  }
}

export * from './interfaces';

export default {
  Sheets: new SheetsResource(),
  Nordnet: new NordnetResource(),
};
