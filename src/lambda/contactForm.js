const nodemailer = require('nodemailer');

export function handler(event, context, callback) {
    const data = JSON.parse(event.body);

    // callback(null, {
    //     statusCode: 200, 
    //     body: JSON.stringify({ message: data })
    // });
    var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_SENDER_ADDRESS,
                pass: process.env.GMAIL_SENDER_PASSWORD
              }
      });

    var mailOptions = {
        from: "dboland1812@gmail.com",
        to: process.env.MESSAGE_INBOX,
        subject: 'Secure email from contact form' + Date.now(),
        text: data.content
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          callback(null, { statusCode: 200, body: JSON.stringify({ message: "sorry, there was an error in submitting the form" }) });
        } else {
            callback(null, {
                statusCode: 200, 
                body: JSON.stringify({ message: "successful submission" })
            });
        }
      });
}