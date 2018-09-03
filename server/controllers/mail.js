'use strict';
const nodemailer = require('nodemailer');
const {mysql} = require('../qcloud')

async function sendMail(accepter, options, callback) {
    // let account = await nodemailer.createTestAccount();
    let account;
    await mysql("email_config_info").select("*").then((res) => {
        if (res && res[0]) {
            account = res[0];
        }
    })
    console.log('sending message...');
    let transporter = nodemailer.createTransport(
        {
            host: account.host,
            port: account.port,
            secure: account.secure,
            auth: {
                user: account.user,
                pass: account.pass
            },
            logger: false,
            debug: false
        },
        {
            // sender info
            from: account.email,
            headers: {
                'X-Laziness-level': 1000
            }
        }
    );
    // Message object
    let message = {
        // Subject of the message
        subject: options.subject || '新分配的任务',
        // plaintext body
        text: options.text||"Test",
        // HTML body
        html:
        '<p><b>任务ID：</b>' + options.taskId + '</p>' +
        '<p><b>任务级别：</b>' + options.level + '级</p>' +
        '<p><b>任务分配人：</b>' + options.notifyName + '</p>' +
        '<p><b>任务计划（小时）：</b>' + options.planHour + '</p>' +
        '<p><b>分配时间：</b>' + options.assignTime + '</p>' +
        '<p><b>任务名称：</b>' + options.taskName + '</p>' +
        '<p><b>任务说明：</b>' + options.taskDescribe + '</p>' +
        '<br/><img src="cid:C00001"/>',

        // '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
        // '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:a@example.com"/></p>',
        // An array of attachments
        to: accepter,
        attachments: [
            // String attachment
            // {
            //     filename: 'notes.txt',
            //     content: 'Some notes about this e-mail',
            //     contentType: 'text/plain' // optional, would be detected from the filename
            // },
            // Binary Buffer attachment
            // {
            //     filename: 'image.jpg',
            //     content: Buffer.from(
            //         'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
            //         '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
            //         'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
            //         'base64'
            //     ),
            //
            //     cid: 'note@example.com' // should be as unique as possible
            // },

            // File Stream attachment
            {
                filename: 'C00001.jpg',
                path: __dirname + '/assets/default.jpg',
                cid: 'C00001'
            }
        ]
    };
    let info = await transporter.sendMail(message);
    console.log('Message sent successfully!');
    console.log(info);
    // console.log(nodemailer.getTestMessageUrl(info));
    let response = {};
    if (info && info.response == '250 Ok: queued as ') {
        response.code = 1;
        response.msg = info.messageId;
    } else {
        response.code = -1;
        response.msg == "ERROR";
    }
    callback(response);
    // only needed when using pooled connections
    transporter.close();
}

// sendMail("liu_weipinglove@163.com", null).catch(err => {
//     console.error(err.message);
//     process.exit(1);
// });
module.exports = {
    sendMail
}


