import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const SOAP_ENDPOINT = 'https://example.com/soap'; // TODO: Replace with actual endpoint
const USERNAME = 'YOUR_USERNAME'; // TODO: Replace with actual username
const PASSWORD = 'YOUR_PASSWORD'; // TODO: Replace with actual password

export async function getBuyerWaybills(createDateStart: string, createDateEnd: string) {
  const soapEnvelope = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <get_buyer_waybills xmlns="http://tempuri.org/">
          <su>${USERNAME}</su>
          <sp>${PASSWORD}</sp>
          <create_date_s>${createDateStart}</create_date_s>
          <create_date_e>${createDateEnd}</create_date_e>
        </get_buyer_waybills>
      </soap:Body>
    </soap:Envelope>
  `;

  const { data } = await axios.post(SOAP_ENDPOINT, soapEnvelope, {
    headers: {
      'Content-Type': 'text/xml',
      'SOAPAction': 'http://tempuri.org/get_buyer_waybills',
    },
  });
  return parseResponse(data);
}

export async function parseResponse(xml: string): Promise<any[]> {
  const result = await parseStringPromise(xml, { explicitArray: false });
  // Return the waybill array directly if present
  try {
    const waybills = result['soap:Envelope']['soap:Body']['get_buyer_waybillsResponse']['get_buyer_waybillsResult']['waybills']['waybill'];
    return Array.isArray(waybills) ? waybills : [waybills];
  } catch {
    return [];
  }
}

export async function saveWaybill(data: Record<string, any>) {
  // Construct SOAP envelope for save_waybill
  const waybillFields = Object.entries(data)
    .map(([key, value]) => `<${key}>${value}</${key}>`)
    .join('');
  const soapEnvelope = `
    <soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">
      <soap:Body>
        <save_waybill xmlns=\"http://tempuri.org/\">
          <su>${USERNAME}</su>
          <sp>${PASSWORD}</sp>
          ${waybillFields}
        </save_waybill>
      </soap:Body>
    </soap:Envelope>
  `;
  const { data: xml } = await axios.post(SOAP_ENDPOINT, soapEnvelope, {
    headers: {
      'Content-Type': 'text/xml',
      'SOAPAction': 'http://tempuri.org/save_waybill',
    },
  });
  return parseResponse(xml);
} 