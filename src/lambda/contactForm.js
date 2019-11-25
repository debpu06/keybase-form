var nodemailer = require('nodemailer');

export function handler(event, context, callback) {
    const data = JSON.parse(event.body);

    callback(null, {
        statusCode: 200, 
        body: JSON.stringify({ message: data })
    });
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: 'youremail@gmail.com',
    //       pass: 'yourpassword'
    //     }
    //   });

    // var mailOptions = {
    //     from: 'youremail@gmail.com',
    //     to: 'myfriend@yahoo.com',
    //     subject: 'Sending Email using Node.js',
    //     text: 'That was easy!'
    //   };

    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //       callback(null, {
    //           statusCode: 500, 
    //           body: JSON.stringify({ mailer: info.response })
    //       });
    //     } else {
    //         callback(null, {
    //             statusCode: 200, 
    //             body: JSON.stringify({ message: "Message sent" })
    //         });
    //     }
    //   });
}