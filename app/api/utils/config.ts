
  const brevo = require('@getbrevo/brevo');
  let apiInstance = new brevo.TransactionalEmailsApi();
  

// Function to send verification email
export async function sendVerificationEmail(email: string, code: string, name: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Account Verification";
  sendSmtpEmail.htmlContent = `
  <html>
   <body>
    <h4 style="color: white;padding: 10px 20px; background: teal; font-size: 17px; border-radius: 8px; text-align: center;">ACCOUNT VERIFICATION</h4>
    <div style="color: gray; font-size: 14px; margin: 10px 0;">
     Dear ${name}, <br /> 
     It is pleasure to have you in contribution to Kamero Research Base, please verify your account to get started! 
     </div><br />
     <div style="background: silver; padding: 10px; font-size: 15px;">
      Verification code: <b>${code}</b>
     </div>
    <p style="margin: 10px 0; font-size: 14px; color: teal;">
     <br />
     Kamero Development Team
     <br />
     info@kamero.rw
     <br />
     +250781121117
    </p>
   </body>
  </html>`;
  sendSmtpEmail.sender = { "name": "Kamero Research Base", "email": "codereveur@gmail.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": "Student" }
  ];
  sendSmtpEmail.replyTo = { "email": "info@kamero.rw", "name": "Kamero" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('API called successfully. ');
  }, function (error: any) {
    console.error(error);
  });
  
}


// Function to send verification email
export async function sendChangePasswordVerificationEmail(email: string, code: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Email Verification";
  sendSmtpEmail.htmlContent = `
  <html>
   <body>
    <h4 style="color: white;padding: 10px 20px; background: teal; font-size: 17px; border-radius: 8px; text-align: center;">EMAIL VERIFICATION</h4>
    <div style="color: gray; font-size: 14px; margin: 10px 0;">
      Hello! <br/> Your request to change password has been proccessed, please verify your email
     </div><br />
     <div style="background: silver; padding: 15px; font-size: 17px;">
      Verification code: <b>${code}</b>
     </div>
    <p style="margin: 10px 0; font-size: 14px; color: teal;">
     <br />
     Kamero Development Team
     <br />
     info@kamero.rw
     <br />
     +250781121117
    </p>
   </body>
  </html>`;
  sendSmtpEmail.sender = { "name": "Kamero Research Base", "email": "codereveur@gmail.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": "Student" }
  ];
  sendSmtpEmail.replyTo = { "email": "info@kamero.rw", "name": "Kamero" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('API called successfully. ');
  }, function (error: any) {
    console.error(error);
  });
  
}

// Function to send verification email
export async function sendChangePasswordConfirmationEmail(email: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Password Change Confirmation";
  sendSmtpEmail.htmlContent = `
  <html>
   <body>
     
    <div style="font-size: 15px; margin: 10px 0; padding: 15px;">
      Hi! <br />
      Your password has been changed successfully! Please visit your dashboard to learn more <a href="https://onboarding.kamero.rw" style="color: teal"> dashboard </a>
    </div>
    <p style="margin: 10px 0; font-size: 14px; color: teal;">
     <br />
     Kamero Development Team
     <br />
     info@kamero.rw
     <br />
     +250781121117
    </p>
   </body>
  </html>`;
  sendSmtpEmail.sender = { "name": "Kamero Research Base", "email": "codereveur@gmail.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": "Student" }
  ];
  sendSmtpEmail.replyTo = { "email": "info@kamero.rw", "name": "Kamero" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('API called successfully. ');
  }, function (error: any) {
    console.error(error);
  });
  
}

// Function to send verification email
export async function sendAccountVerificationSMS(phone: string): Promise<void> {

let apiInstance = new brevo.TransactionalSMSApi()

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_SMS_API_KEY;

let sendTransacSms = new brevo.SendTransacSms();
sendTransacSms.sender = 'Kamero Research Base';
sendTransacSms.recipient = phone;
sendTransacSms.content = 'Your account verification code is : ';
sendTransacSms.type = 'transactional';
sendTransacSms.webUrl = 'https://supervisor.kamero.rw';

apiInstance.sendTransacSms(sendTransacSms).then(function(data: any) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error: any) {
  console.error(error);
});
}
// Function to send institution approval email
export async function sendAccountCreationEmail(email: string, name: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = `Account Creation, Role and Permissions for ${name}`;
  sendSmtpEmail.htmlContent = `
  <html>
   <body>
     
    <div style="font-size: 15px; margin: 10px 0; background: #14b8a6; color: white; border: 1px solid teal; border-radius: 9px; padding: 15px;">
      Hello ${name}, <br />
      Your account for has been created successfully at Kamero Research Base! <br>
      <h4><u>Role and permissions</u></h4>
      <ul>
      <li> Research Supervision: <span style="color: green;"><b>Granted</b> </span></li>
      <li> Adding research: <span style="color: green;"><b>Granted</b></span></li>
      <li> Approve, reject, edit, hold researches: <span style="color: green;"><b>Granted</b></span></li>
      <li> Deleting research: <span style="color: red;"><b>Denied</b></span></li>
      <li> Adding department: <span style="color: green;"><b>Granted</b></span></li>
      <li> Login: <span style="color: green;"><b>Granted</b></span></li>
      <li> Deleting account: <span style="color: red;"><b>Denied</b></span></li>
      </ul> 
      Please visit your dashboard to learn more <a href="https://krbonboarding.vercel.app"> dashboard </a>
      <br>
      For more information reach your institution administration for assistance
    </div>
    <p style="margin: 10px 0; font-size: 14px; color: teal;">
     <br />
     Kamero Development Team
     <br />
     info@kamero.rw
     <br />
     +250781121117
    </p>
   </body>
  </html>`;
  sendSmtpEmail.sender = { "name": "Kamero Research Base", "email": "dev@kamero.rw" };
  sendSmtpEmail.to = [
    { "email": email, "name": "Supervisor" }
  ];
  sendSmtpEmail.replyTo = { "email": "dev@kamero.rw", "name": "Kamero" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('API called successfully. ');
  }, function (error: any) {
    console.error(error);
  });
  
}
