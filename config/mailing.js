const config = require('./index');
const nodemailer = require('nodemailer');

let SERVICE_PROVIDER; 
let SENDER_MAIL; 
let SENDER_PASSWORD;
let RECEIVER_MAIL;

if(config.env == "development" || config.env == "test"){
 	SERVICE_PROVIDER = 'gmail'; 
 	SENDER_MAIL = 'assetnodejs@gmail.com';
 	SENDER_PASSWORD = 'asset.1.com';
 	RECEIVER_MAIL = 'tuemail@gmail.com'; 
}else{
	SERVICE_PROVIDER = 'gmail'; 
	SENDER_MAIL = 'asskjfdslk@gmail.com';
	SENDER_PASSWORD = 'sssset.1.com';
	RECEIVER_MAIL = 'tuemail@gmail.com'; //change this for production email report 
}

var transporter = nodemailer.createTransport({
  service: SERVICE_PROVIDER,
  auth: {
    user: SENDER_MAIL,
    pass: SENDER_PASSWORD
  }
});

module.exports.sendEmail = function(subject,html){
	var mailOptions = {
		from: SENDER_MAIL, 
		to: RECEIVER_MAIL,
		subject: subject,
		html: html
	};
	transporter.sendMail(mailOptions, function (err, info) {
	  if(err)console.log(err)
	  else console.log(info);
	});
}