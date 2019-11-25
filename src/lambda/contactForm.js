var nodemailer = require('nodemailer');

export function handler(event, context, callback) {
    const data = JSON.parse(event.body);

    callback(null, {
        statusCode: 200, 
        body: JSON.stringify({ message: data })
    });
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_SENDER_ADDRESS,
          pass: process.env.GMAIL_SENDER_PASSWORD
        }
      });

    var mailOptions = {
        from: data.sender,
        to: process.env.MESSAGE_INBOX,
        subject: 'Secure email from contact form',
        text: data.content
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          callback(null, {
              statusCode: 500, 
              body: JSON.stringify({ mailer: info.response })
          });
        } else {
            callback(null, {
                statusCode: 200, 
                body: JSON.stringify({ message: "Message sent" })
            });
        }
      });
}