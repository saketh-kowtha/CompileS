const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'emailID',
    pass: 'password'
  }
});

const sendMail =  function(From, to, subject, text){
    var mailOptions = {
      from: From,
      to: to,
      subject: subject,
      html: text
    };

    let promise = new Promise(function(resolve, reject){
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            reject(error);
          } else {
            resolve("ok");
          }
        });
    })
    return promise
}

  module.exports.sendMail = sendMail