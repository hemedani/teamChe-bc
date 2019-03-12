var http = require('http');

var uname = 'afarin_79368';
var pword = 'OgGrxilsuuETRePM';

const xml = (massage, phoneNumber) => (`
<soapenv:Envelope 
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
  xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soapenv:Body>
    <ns1:enqueue soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" 
      xmlns:ns1="urn:SOAPSmsQueue">
      <domain xsi:type="soapenc:string" 
        xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">magfa
      </domain>
      <messages soapenc:arrayType="soapenc:string[1]" xsi:type="soapenc:Array" 
        xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
        <messages xsi:type="soapenc:string">${massage}</messages>
      </messages>
      <recipientNumbers soapenc:arrayType="soapenc:string[1]" xsi:type="soapenc:Array" 
        xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
        <recipientNumbers xsi:type="soapenc:string">${phoneNumber}</recipientNumbers>
      </recipientNumbers>
      <senderNumbers soapenc:arrayType="soapenc:string[1]" xsi:type="soapenc:Array" 
        xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">
        <senderNumbers xsi:type="soapenc:string">98300079368</senderNumbers>
      </senderNumbers>
    </ns1:enqueue>
  </soapenv:Body>
</soapenv:Envelope>
`)

const http_options = {
  hostname: 'sms.magfa.com',
  port: 80,
  path: '/services/urn:SOAPSmsQueue?wsdl',
  method: 'POST',
  headers: {
    "Content-Type": "text/xml;charset=UTF-8",
    "SOAPAction": "",
    'Authorization' : 'Basic ' + new Buffer(uname + ':' + pword).toString('base64'),
    'Content-Length': xml.length
  }
}

var req = http.request(http_options, (res) => {
  // console.log(`STATUS: ${res.statusCode}`);
  // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });

  res.on('end', () => {
    console.log('No more data in response.')
  })
});

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});

req.write(xml);
req.end();