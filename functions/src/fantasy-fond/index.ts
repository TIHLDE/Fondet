import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Timestamp } from '@google-cloud/firestore';
import { google } from '@google-cloud/tasks/build/protos/protos';
import cloudTasks from '@google-cloud/tasks';
import axios from 'axios';
import * as moment from 'moment-timezone';
import { FantasyfundUpdateRequest, FantasyfundLeagueResponse, CollectionNames, FantasyfundData, FantasyFundConfig, FirebaseConfig } from './interfaces';

const cloudTasksClient = new cloudTasks.CloudTasksClient();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG!) as FirebaseConfig;
const cloud_tasks_key = functions.config().secrets.cloud_tasks_key;

function authenticatedRequest(handler: (req: functions.https.Request, resp: functions.Response) => void): functions.HttpsFunction {
  return functions.https.onRequest((req, res) => {
    if (req.headers.authorization !== `Bearer ${cloud_tasks_key}`) {
      functions.logger.error('UNAUTHORIZED');
      res.sendStatus(401);
    } else {
      handler(req, res);
    }
  });
}

export const updateFantasyfund = authenticatedRequest(async (req, res) => {
  const { id }: FantasyfundUpdateRequest = req.body;
  const timestamp = Timestamp.now();

  try {
    const { data: leagueResponse }: { data: FantasyfundLeagueResponse } = await axios.get(`https://investor.dn.no/FantasyFunds/LeagueFundList?leagueId=${id}`);
    const leagueData = leagueResponse.result;

    const fundDataRef = admin.firestore().collection(CollectionNames.FantasyfundData).doc(id.toString());

    const fantasyFundData = (await fundDataRef.get()).data() as FantasyfundData;

    fantasyFundData.name = leagueData.name;
    fantasyFundData.lastUpdated = timestamp;
    fantasyFundData.funds = fantasyFundData.funds || {};

    leagueData.funds.forEach((fund) => {
      const { 0: fundId, 3: profileId, 4: fundName } = fund;
      const value = leagueData.ress[fundId];

      if (value !== undefined) {
        const fundData = fantasyFundData.funds[fundId] || { values: [] };
        fundData.name = fundName;
        fundData.profileId = profileId;
        fundData.values.push({
          timestamp,
          value,
        });

        fantasyFundData.funds[fundId] = fundData;
      }
    });

    await fundDataRef.set(fantasyFundData);

    functions.logger.info(`Updated data for FantasyFund league: ${leagueData.name}`);
  } catch (error) {
    functions.logger.error(`Failed to update data for FantasyFund league with id: ${id}`, error);
  }
  res.sendStatus(204);
});

export const onFantasyfundLeagueCreate = functions.firestore.document(`${CollectionNames.FantasyfundConfig}/{id}`).onCreate(async (snapshot) => {
  const id = snapshot.id;
  const config = snapshot.data() as FantasyFundConfig;
  const timestamp = Timestamp.now();

  const fundDataRef = admin.firestore().collection(CollectionNames.FantasyfundData).doc(id);

  const fundData: Partial<FantasyfundData> = {
    start: config.start,
    end: config.end,
    funds: {},
    lastUpdated: timestamp,
  };

  await fundDataRef.set(fundData);
  await scheduleFantasyfundUpdates(id, config);
});

export const onFantasyfundLeagueDelete = functions.firestore.document(`${CollectionNames.FantasyfundConfig}/{id}`).onDelete(async (snapshot) => {
  const id = snapshot.id;
  const config = snapshot.data() as FantasyFundConfig;

  const fundDataRef = admin.firestore().collection(CollectionNames.FantasyfundData).doc(id);

  await fundDataRef.delete();
  await unScheduleFantasyfundUpdates(id, config);
});

export const onFantasyfundLeagueUpdate = functions.firestore.document(`${CollectionNames.FantasyfundConfig}/{id}`).onUpdate(async ({ before, after }) => {
  const id = after.id;
  const oldConfig = before.data() as FantasyFundConfig;
  const newConfig = after.data() as FantasyFundConfig;
  const timestamp = Timestamp.now();

  const fundDataRef = admin.firestore().collection(CollectionNames.FantasyfundData).doc(id);

  const fundData: Partial<FantasyfundData> = {
    start: newConfig.start,
    end: newConfig.end,
    lastUpdated: timestamp,
  };

  if (oldConfig.start.seconds !== newConfig.start.seconds || oldConfig.end.seconds !== newConfig.end.seconds) {
    await fundDataRef.update(fundData);
    await unScheduleFantasyfundUpdates(id, oldConfig);
    await scheduleFantasyfundUpdates(id, newConfig);
  }
});

async function scheduleFantasyfundUpdates(id: string, config: FantasyFundConfig): Promise<void> {
  const parent = cloudTasksClient.queuePath(firebaseConfig.projectId, 'europe-west2', 'fantasy-fond');

  const { start, end } = config;

  const startDate = start.toDate();
  const endDate = end.toDate();

  const START_HOUR = 9;
  const END_HOUR = 17;

  startDate.setHours(START_HOUR, 0, 0, 0);
  endDate.setHours(END_HOUR, 0, 0, 0);

  const currentDate = new Date(startDate.getTime());

  const schedulerPromises = [];

  while (currentDate.getTime() <= endDate.getTime()) {
    if ([0, 6].includes(currentDate.getDay())) {
      // Weekend
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    if (currentDate.getHours() > END_HOUR) {
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(START_HOUR);
      continue;
    }

    const Y = String(currentDate.getFullYear());
    const M = String(currentDate.getMonth() + 1).padStart(2, '0');
    const D = String(currentDate.getDate()).padStart(2, '0');
    const H = String(currentDate.getHours()).padStart(2, '0');

    const scheduleTime = moment.tz(`${Y}-${M}-${D} ${H}:00`, 'Europe/Oslo').unix();

    if (scheduleTime > Timestamp.now().seconds) {
      const task: google.cloud.tasks.v2.ITask = {
        httpRequest: {
          httpMethod: 'POST',
          url: `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/updateFantasyfund`,
          body: Buffer.from(JSON.stringify({ id: parseInt(id) })).toString('base64'),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cloud_tasks_key}`,
          },
        },
        scheduleTime: {
          seconds: scheduleTime,
        },
      };
      schedulerPromises.push(cloudTasksClient.createTask({ parent, task }).catch((e) => e));
    }

    currentDate.setHours(currentDate.getHours() + 1);
  }

  const schedulers = (await Promise.all(schedulerPromises)).filter((result) => !(result instanceof Error));
  const taskIds = schedulers.map((s) => s[0].name) as string[];
  const fundConfigRef = admin.firestore().collection(CollectionNames.FantasyfundConfig).doc(id);

  const fundConfigUpdate: Partial<FantasyFundConfig> = {
    updateScheduleIds: taskIds,
  };

  await fundConfigRef.update(fundConfigUpdate);
}

async function unScheduleFantasyfundUpdates(id: string, config: FantasyFundConfig): Promise<void> {
  await Promise.all(config.updateScheduleIds.map((name) => cloudTasksClient.deleteTask({ name }).catch((e) => e)));
  const fundConfigRef = admin.firestore().collection(CollectionNames.FantasyfundConfig).doc(id);
  const fundConfigUpdate: Partial<FantasyFundConfig> = {
    updateScheduleIds: [],
  };
  await fundConfigRef.update(fundConfigUpdate);
}
