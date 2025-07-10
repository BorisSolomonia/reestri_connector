import * as functions from 'firebase-functions';
import { saveWaybill } from './waybillService';

export const saveWaybillCallable = functions.https.onCall(async (data, context) => {
  // data should contain the waybill fields required by the SOAP API
  try {
    const result = await saveWaybill(data);
    return { success: true, result };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}); 