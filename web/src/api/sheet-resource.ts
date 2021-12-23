import { GoogleSpreadsheet } from 'google-spreadsheet';
import BaseResource from './base-resource';

export default abstract class SheetResource<T> extends BaseResource<T> {
  protected doc: GoogleSpreadsheet;

  constructor(doc: GoogleSpreadsheet) {
    super();
    this.doc = doc;
  }

  public async get(): Promise<T> {
    if (this.data === undefined) {
      try {
        this.doc.sheetCount;
      } catch {
        await this.doc.loadInfo();
      }

      this.data = await this.fetch();
    }
    return this.data;
  }
}
