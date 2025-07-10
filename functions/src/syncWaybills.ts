import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getBuyerWaybills } from './waybillService';
import { Request, Response } from 'express';

admin.initializeApp();
const db = admin.firestore();

export const syncWaybills = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async () => {
    await sync();
  });

export const syncWaybillsHttp = functions.https.onRequest(async (req: Request, res: Response) => {
  try {
    await sync();
    res.status(200).send('Waybills synced');
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

async function sync() {
  // TODO: Set actual date range logic
  const createDateStart = '2024-01-01';
  const createDateEnd = '2024-12-31';
  const waybills = await getBuyerWaybills(createDateStart, createDateEnd);
  for (const waybill of waybills) {
    const waybillNumber = waybill.waybillNumber || waybill.number;
    if (!waybillNumber) continue;
    await db.collection('waybills').doc(waybillNumber).set(waybill, { merge: true });
  }
} 