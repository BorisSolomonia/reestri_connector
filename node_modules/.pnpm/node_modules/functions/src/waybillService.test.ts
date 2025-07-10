import { parseResponse } from './waybillService';

const sampleXml = `
<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">
  <soap:Body>
    <get_buyer_waybillsResponse xmlns=\"http://tempuri.org/\">
      <get_buyer_waybillsResult>
        <waybills>
          <waybill>
            <waybillNumber>123</waybillNumber>
            <date>2024-01-01</date>
          </waybill>
          <waybill>
            <waybillNumber>456</waybillNumber>
            <date>2024-01-02</date>
          </waybill>
        </waybills>
      </get_buyer_waybillsResult>
    </get_buyer_waybillsResponse>
  </soap:Body>
</soap:Envelope>
`;

describe('parseResponse', () => {
  it('parses waybills from SOAP XML', async () => {
    const result = await parseResponse(sampleXml);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0].waybillNumber).toBe('123');
    expect(result[1].waybillNumber).toBe('456');
  });
}); 