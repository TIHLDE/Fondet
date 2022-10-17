import axios from 'axios';
import { collection, getFirestore, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import Resource from './resource';
import { NordnetData, SheetsData, FantasyfundData, CollectionNames } from './interfaces';
import { firebaseApp } from './firebase';
const firestore = getFirestore(firebaseApp);

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
      'https://firebasestorage.googleapis.com/v0/b/fondet.appspot.com/o/database%2Fnordnet.json?alt=media&token=6f7eb2d1-541a-4921-a959-1a23b69390fd',
    );
    return data;
  }
}

class FantasyfundResource extends Resource<FantasyfundData | null> {
  protected async fetch(): Promise<FantasyfundData | null> {
    const start = Timestamp.fromMillis(Timestamp.now().toMillis() + 86400000);
    const end = Timestamp.fromMillis(Timestamp.now().toMillis() - 86400000 * 2);

    const q = query(collection(firestore, CollectionNames.FantasyfundData), orderBy('start', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      const doc = snapshot.docs[0];
      const fantasyfundData = { id: doc.id, ...doc.data() } as FantasyfundData;

      // Filter out funds without sufficient data
      fantasyfundData.funds = Object.fromEntries(Object.entries(fantasyfundData.funds).filter(([, fund]) => fund.values.length > 1));

      if (
        fantasyfundData.start < start &&
        fantasyfundData.end > end &&
        fantasyfundData.funds &&
        Object.keys(fantasyfundData.funds).length > 1 && // Needs to  have data
        Math.max(...Object.values(fantasyfundData.funds).map((fund) => fund.values.length)) > 4 // Minimum half day of data
      ) {
        return fantasyfundData;
      }
    }
    return null;
  }
}

export * from './interfaces';
export default {
  Sheets: new SheetsResource(),
  Nordnet: new NordnetResource(),
  Fantasyfund: new FantasyfundResource(),
};
