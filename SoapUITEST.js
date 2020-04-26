

var soap = require('soap');

const wsdlOptions = {
  envelopeKey: "soapenv"
};
  var url = 'http://www.dneonline.com/calculator.asmx?WSDL';
  //var url = 'https://qaabsolve.sterlingdirect.com/Screening.svc?wsdl';
  var args1={_xml : "<tem:Add>"+
        "<tem:intA>5</tem:intA>"+
        "<tem:intB>5</tem:intB>"+
     "</tem:Add>"
    
  };
  var args = {
      intA : 1, 
      intB : 2
    };
  soap.createClient(url, wsdlOptions, function(err, client) {
    client.wsdl.xmlnsInEnvelope = 'xmlns:tem="http://tempuri.org/"';
        if (err) throw err;
        console.log(client.describe());
        client.Calculator.CalculatorSoap.Add(args , function(err, result) {
            console.log(result);
        });

        client.Calculator.CalculatorSoap.Add(args1, function(err, result, rawResponse, soapHeader, rawRequest) {
          console.log(result)
          console.log("********")
          console.log(rawResponse)
          console.log("********")
          console.log(soapHeader)
          console.log("********")
          console.log(rawRequest)
          // result is a javascript object
          // rawResponse is the raw xml response string
          // soapHeader is the response soap header as a javascript object
          // rawRequest is the raw xml request string
      });
  });

 