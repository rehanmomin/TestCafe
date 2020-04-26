/* Validate order is placed successfully using seamless integration
    Package code: 107184 - PreEmp Non Driver Paper - Contact Center
*/
import loginPage from "../../main/page-objects/screening-direct/login-page.js"
import helper from '../../main/utils/helper-methods.js'
import screeningPage from '../../main/page-objects/screening-direct/screening/screening-page.js'
import orderEditor from '../../main/page-objects/screening-direct/screening/order-editor.js'
import adverseAction from '../../main/page-objects/screening-direct/screening/adverse-action.js'
import loginSIP from '../../main/page-objects/SIP/login.js'
import trackingEvent from '../../main/page-objects/SIP/tracking-event-search.js'
import {   DeployCodeHeader } from '../../main/utils/deploy-code-header.js'

const customHeader = new DeployCodeHeader()
import fulfillOrder from '../../main/utils/order-fulfill-helper.js'
import { Selector } from "testcafe"

var data;
var path = require('path')
var testfile = path.basename(__filename).split('.')[0]
var Fakerator = require("fakerator");
var fakerator = Fakerator()

fixture `Safelite`
    .page `${process.env.BASE_URL}`
    .requestHooks(customHeader)

test
    .before(async t => {
        data = config.getTestData(__dirname, __filename)
    })
    (testfile + ': Safelite - Seamless Integration Pre-emp non Driver Paper - Contact Center', async t => {
        let ssn = await helper.randomnumber()
        console.log("ssn value is " + ssn)
        var fname = fakerator.names.firstName()
        var lname = fakerator.names.lastName()

        await new Promise((resolve, reject) => {
            //create an order using integration for that user using package
            var request = require("request");
            var idValue = 0;
            var body = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soap:Body><CreateBackgroundCheck xmlns="http://service.common.sif.sterling.com"><BackgroundCheck xmlns="http://ns.hr-xml.org/2006-02-28" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.hr-xml.org/2006-02-28" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" userId="ADPRMTP" password="adprmtp789" account="ADPRM"><BackgroundSearchPackage><ProcessingInformation><AccessCredential type="UserName">safeliteINTTEST</AccessCredential><AccessCredential type="Password">password456@</AccessCredential><AccessCredential type="Account">safelite</AccessCredential></ProcessingInformation><ReferenceId><IdValue>Test001002</IdValue></ReferenceId><Organization><OrganizationName>Safelite</OrganizationName><OrganizationId><IdValue>001122</IdValue></OrganizationId><AdditionalItems type="x:stsField" qualifier="x:stsProjectedSalary"><Text>unable to provide</Text></AdditionalItems><AdditionalItems type="x:stsField" qualifier="x:stsMisc1"><Text>Yes</Text></AdditionalItems><AdditionalItems type="x:stsField" qualifier="x:stsMisc5"><Text>001120</Text></AdditionalItems><AdditionalItems type="x:stsField" qualifier="x:stsMisc12"><Text>CSR3 - Trainee-C1930</Text></AdditionalItems></Organization><PersonalData><PersonName><GivenName>' + lname + '</GivenName><MiddleName/><FamilyName primary="true">' + fname + '</FamilyName></PersonName><PostalAddress type="streetAddress"><CountryCode>US</CountryCode><PostalCode>43227</PostalCode><Region>OH</Region><Municipality>Columbus</Municipality><DeliveryAddress><AddressLine>4069 e Livingston aveapt 115</AddressLine></DeliveryAddress></PostalAddress><ContactMethod><Telephone><FormattedNumber>6145896378</FormattedNumber></Telephone><InternetEmailAddress>test@test.com</InternetEmailAddress></ContactMethod><DemographicDetail><GovernmentId countryCode="US" issuingAuthority="SSN">' + ssn + '</GovernmentId><GovernmentId countryCode="US" jurisdiction="OH" issuingAuthority="DMV" validTo="2021-07-04">TL961146</GovernmentId><DateOfBirth>1990-07-04</DateOfBirth><GenderCode>2</GenderCode></DemographicDetail></PersonalData><Screenings><PackageId><IdValue>107184</IdValue></PackageId><Screening type="ssn"><SearchOther><AdditionalItems type="x:stsField" qualifier="x:stsCrimOff"><Text>True</Text></AdditionalItems></SearchOther></Screening><Screening type="criminal" qualifier="county"><Region>OH</Region><SearchCriminal><Municipality>Columbus</Municipality><PostalCode>43227</PostalCode></SearchCriminal></Screening><Screening type="criminal" qualifier="nationWide"></Screening><Screening type="criminal" qualifier="statewide"><Region>OH</Region></Screening><Screening type="education"><SearchEducation><EducationHistory><SchoolOrInstitution schoolType=""><School><SchoolName>Northland High School</SchoolName></School><PostalAddress><CountryCode>US</CountryCode><Region>OH</Region><PostalCode/><Municipality>Columbus</Municipality><DeliveryAddress><AddressLine/></DeliveryAddress></PostalAddress><Degree degreeType="high school or equivalent"><DegreeDate><StringDate>Did Not Graduate</StringDate></DegreeDate><DatesOfAttendance><StartDate><StringDate/></StartDate><EndDate><StringDate/></EndDate></DatesOfAttendance></Degree></SchoolOrInstitution></EducationHistory></SearchEducation></Screening><Screening type="education"><SearchEducation><EducationHistory><SchoolOrInstitution schoolType=""><School><SchoolName>Independence University</SchoolName></School><PostalAddress><CountryCode>US</CountryCode><Region>OH</Region><PostalCode/><Municipality>Columbus</Municipality><DeliveryAddress><AddressLine/></DeliveryAddress></PostalAddress><Degree degreeType="bachelors"><DegreeDate><StringDate>Did Not Graduate</StringDate></DegreeDate><DatesOfAttendance><StartDate><StringDate/></StartDate><EndDate><StringDate/></EndDate></DatesOfAttendance></Degree></SchoolOrInstitution></EducationHistory></SearchEducation></Screening><Screening type="license" qualifier="mvPersonal"></Screening><Screening type="other" qualifier="OFAC"></Screening><Screening type="other" qualifier="x:stsGLOBEX"></Screening><Screening type="credit"><SearchOther><AdditionalItems type="x:stsField" qualifier="x:stsCrimOff"><Text>True</Text></AdditionalItems></SearchOther></Screening></Screenings></BackgroundSearchPackage></BackgroundCheck></CreateBackgroundCheck></soap:Body></soap:Envelope>'
            request.post({
                    url: "https://integration.int.sterlingts.com/services/ConsumerService/4c6ba274-0e3a-4fe3-86eb-570830f21d40",
                    method: "POST",
                    body: body
                },
                async function (error, response, body) {
                    console.log(response.statusCode);
                    console.log(body);
                    var parseString = require('xml2js').parseString;
                    parseString(body, function (err, result) {
                        const xpath = require("xml2js-xpath");
                        idValue = xpath.find(result, `//IdValue[@name='BackgroundCheckOrderNumber']`)[0];
                        var isException = xpath.find(result, `//EntityNoException`)[0];
                        console.log("No exception recieved while placing order: " + isException)
                        console.log(idValue['_']);
                        idValue = idValue['_']
                        process.env.OrderID = idValue;
                    })
                    resolve("success")
                }) // end of function inside post, end of post
        })
        await fulfillOrder.fulfillOrder(`${process.env.OrderID}`, data.orderData)
        await t.maximizeWindow()
        await loginPage.sdLogin(await helper.decryptString(data.screeningUserName), await helper.decryptString(data.screeningUserPassword));
        await screeningPage.searchOrderBy('OrderID', `${process.env.OrderID}`)
        await t.click(orderEditor.candidateName_link)
            .click(orderEditor.orderEditor_link)
        try{
            await orderEditor.waitUntilOrderStatusChanged(30, "Pending")
        }catch(err){
            console.log("Order status did not change even after waiting for 30 seconds")
            var orderid = `${process.env.orderID}`
            var orderScore = 19
            var orderStatus = 23
            var updateOrderScore = 'UPDATE BgOrders SET Score = \'' + orderScore + '\', Status = \'' + orderStatus + '\' WHERE BgOrderID = \'' + orderid + '\';'
            console.log("Order update query is " + updateOrderScore)
            var msSQLInstance = require('../../main/utils/ms-sql.js')
            await msSQLInstance.executeSQLQuery(updateOrderScore).then(res => {
            console.log(res)
        });
            await msSQLInstance.closeSQl();
        }

        await t
            .expect(orderEditor.viewDetail_btn.exists && orderEditor.viewDetail_btn.visible).eql(true, 'View detail button does not displayed to the user')
            .click(orderEditor.viewDetail_btn)
        await adverseAction.initiateAdverseActionFairChance('test@sterlingts.com')
        await screeningPage.searchOrderBy('OrderID', `${process.env.OrderID}`)
        await t.click(orderEditor.candidateName_link)
        await t.expect(await orderEditor.getStatus_after_submit('Managed Adverse Action')).eql("Queue", 'SVCAA search is not added')
        await orderEditor.validateAdverseActionLogs('Pre-Adverse Action process is initiated')
        await screeningPage.logout()
        await t.navigateTo(`${process.env.SIP_URL}`)
        await loginSIP.loginSIPui(await helper.decryptString(data.sipUiUser), await helper.decryptString(data.sipUiPassword))
        await trackingEvent.clickTrackingevent()
        await trackingEvent.searchEventByOrderId(`${process.env.OrderID}`)
        var flag = await trackingEvent.isEventTypeStatusExists(['SEND REQUEST TO OMS',
            'ORDER RESULTS NOTIFICATION', 'SCREENING_ORDER_RESULT'
        ], 'SUCCESS')
        await t.expect(flag).eql(true)
        await loginSIP.logoutSIPui()
        // })
    }) //end of test
