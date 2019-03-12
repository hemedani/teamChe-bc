const soap = require('soap');
const axios = require('axios');

const appConfig = {
	appTitle: 'درگاه پرداخت زرین پال مبتنی بر NodeJS',
	zarinpalMerchant: '8eb2c1fc-c712-11e8-abde-000c295eb8fc',
	//Developers Option
	zarinpalSoapServer: 'https://zarinpal.com/pg/services/WebGate/wsdl'
}

const request = (zpamount, zpemail, zpphone, zpdesc, redirect, zpcallback) => {
  const url = appConfig.zarinpalSoapServer;
  const args = {
    'MerchantID': appConfig.zarinpalMerchant,
    'Amount': zpamount,
    'Description': zpdesc,
    'Email': zpemail,
    'Mobile': zpphone,
    'CallbackURL': redirect
  };
  soap.createClient(url, (err, client) => {
    client.PaymentRequest(args, (err, result) => {
      const parseData = JSON.parse(JSON.stringify(result));
      if(Number(parseData.Status) === 100) {
        const status = true;
        const url = 'https://www.zarinpal.com/pg/StartPay/' + parseData.Authority;
        zpcallback({'status': status, 'url': url});
      } else {
        const status = false;
        const code = parseData.Status;
        zpcallback({'status': status, 'code': 'خطایی پیش آمد! ' + code});
      }
    });
  });
}
exports.testZarin = (req, res) => {

  const { zpamount, zpemail, zpphone, zpdesc, redirect } = req.body;
  
  return request(zpamount, zpemail, zpphone, zpdesc, redirect, (data) => {

    console.log('====================================');
    console.log(data);
    console.log('====================================');

    if(data.status) {
      res.send(data)
    } else {
      res.status(422).send({error: 'we have an issue', err: data.code})
    }

  })

}

exports.PaymentRequest = (inp) => {
  inp = { ...inp, MerchantID: appConfig.zarinpalMerchant};
  return new Promise((res, rej) => {
    return axios.post('https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json', inp)
      .then(resp => res({...resp.data, url: 'https://www.zarinpal.com/pg/StartPay/' + resp.data.Authority}))
      .catch(err => rej(err.response.data))
  });
}

exports.PaymentVerification = (inp) => {
  inp = { ...inp, MerchantID: appConfig.zarinpalMerchant};
  return new Promise((res, rej) => {
    return axios.post('https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json', inp)
      .then(resp => res(resp.data))
      .catch(err => rej(err.response.data))
  })
}