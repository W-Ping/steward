/**
 *
 * @Description 邮件发送
 * 调用方法:sendMail('amor_zhang@qq.com','这是测试邮件', 'Hi Amor,这是一封测试邮件');
 *
 */
'use strict';
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
const {mysql} = require('../qcloud')

let mailConfig;
mysql("email_info").select("*").where({stat: 0}).then((res) => {
    console.log(res);
    if (res && res[0]) {
        mailConfig = res[0];
    }
})
/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, options) {
    smtpTransport = nodemailer.createTransport(smtpTransport({
        service: mailConfig.serviceType,
        auth: {
            user: mailConfig.email,
            pass: mailConfig.pwd
        },
    }));

    let html = '<Strong>任务推送人：</Strong>' + '<span>' + options.notifyName + '</span></br>' +
        '<Strong>任务名称：</Strong>' + '<span>' + options.taskName + '</span>';
    smtpTransport.sendMail({
        from: mailConfig.email,
        to: recipient,
        subject: subject,
        html: html

    }, function (error, response) {
        if (error) {
            mysql("email_info").update({stat: 2})
            console.log(error);
        } else {
            console.log('发送成功', response);
            mysql("email_info").update({stat: 2})
        }

    });
}

module.exports = {
    sendMail
}


