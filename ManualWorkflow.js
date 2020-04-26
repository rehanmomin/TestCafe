/*  Description: Validate  notification when it is set at customer level.
*/
import { Selector, t } from 'testcafe';
import loginPage from '../../main/page-objects/screening-direct/login-page.js'
import objScreening from '../../main/page-objects/screening-direct/screening/screening-page.js'
import objCriminal from '../../main/page-objects/screening-direct/products/criminal-products.js'
import objOrderEditor from '../../main/page-objects/screening-direct/screening/order-editor.js'
import fulfillOrder from '../../main/utils/order-fulfill-helper.js'
import objHelper from '../../main/utils/helper-methods.js'
import orderEditor from '../../main/page-objects/screening-direct/screening/order-editor.js'
import { DeployCodeHeader } from '../../main/utils/deploy-code-header.js' 
import emailCatcher from '../../main/page-objects/other/emailCatcher.js'
const customHeader = new DeployCodeHeader();

var data;
var path = require('path')
var testfile = path.basename(__filename).split('.')[0]
fixture `State Street`
.page `${process.env.BASE_URL}` //Getting the environment details
.requestHooks(customHeader);

test
  .before( async t => {
    data = config.getTestData(__dirname,__filename)
  })
(testfile+': Validate notification when it is set at customer level. ', async t =>{
  await t.maximizeWindow();
  await loginPage.sdLogin(await data.screeningUserName, await data.screeningUserPassword);
  await t.expect(objScreening.go_btn.exists).eql(true, 'User Successfully Logged in')
  await objScreening.manualOrderprovideSSN(await objHelper.generateSSN());
	await t.expect(objScreening.ssn_lbl.exists).eql(true,'Applicant SSN entered successfully')
	await objScreening.manualOrderStep1(data.screeningPackage,data.jobPosition);
	await t.expect(objScreening.lastname_txt.exists).eql(true,'Data entered successfully in Step 1-Create New Background Check')
  await t.expect(objScreening.lastname_txt.exists).eql(true,'STEP-2 Page has been loaded')
  console.log(data.orderOptions.email)
	await objScreening.manualOrderStep2(data.orderOptions.lastName,data.orderOptions.firstName,data.orderOptions.middleName,data.orderOptions.dob,data.orderOptions.addrline1,data.orderOptions.email);
	await t.expect(objScreening.next_btn.exists).eql(true,'STEP-3 Page has been loaded')
	await objScreening.manualOrderStep3();
	await t.expect(objOrderEditor.productDetails_dd.exists).eql(true,'Page is navigated to Order editor page and Order Editor Page is displayed')
  await t.expect(await objOrderEditor.getOrderStatus()).eql("Draft",'Intial Order status is -:'+await objOrderEditor.getOrderStatus())
  
  
  await t.click(objOrderEditor.productDetails_dd);
	await t.click(Selector('option').withText('Criminal - County')); 	
  await objCriminal.populateDataForCRFM();
  await t.expect(await objOrderEditor.getStatus_before_submit('County Criminal Record')).eql('Ready to Submit','Data Entered for CRFM successfully')
 
  await objOrderEditor.submitOrder();
  console.log("Text enterered here finally: "+await objOrderEditor.getOrderStatus())
  process.env.OrderID = await orderEditor.getOrderID()
	await t.expect(await objOrderEditor.getOrderStatus()).eql("Pending",'Order status is Pending')
  await t.expect(await objOrderEditor.getStatus_after_submit('County Criminal Record')).eql("Pending",'CRFM search Req status is Pending status');
  
  
	await t.expect(await objOrderEditor.getSalaryDetails()).eql('Between $25,000-$74,999')
  
  await fulfillOrder.fulfillOrder(`${process.env.OrderID}`, data.orderData)
  try{
    await objOrderEditor.waitUntilOrderStatusChanged(30, "Pending")
  }catch(err){
      console.log("Order status did not change even after waiting for 30 seconds")
      var orderid = `${process.env.orderID}`
      var orderScore = 12
      var orderStatus = 20
      var updateOrderScore = 'UPDATE BgOrders SET Score = \'' + orderScore + '\', Status = \'' + orderStatus + '\' WHERE BgOrderID = \'' + orderid + '\';'
      console.log("Order update query is " + updateOrderScore)
      var msSQLInstance = require('../../main/utils/ms-sql.js')
      await msSQLInstance.executeSQLQuery(updateOrderScore).then(res => {
      console.log(res)
  });
      await msSQLInstance.closeSQl();
  }
  await t.click(objOrderEditor.orderEditor_link)
  await t.expect(await objOrderEditor.getOrderStatus()).eql("Complete",'Order status is Complete')
  await objScreening.logout(); // logout check 
  await t.expect(await loginPage.username.exists).eql(true,'User has logged out successfully')

  await emailCatcher.notificationFromMailCatcher(data.emailCatcherURL,data.DistributionList);
});


