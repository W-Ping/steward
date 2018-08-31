const {mysql} = require('../qcloud')
const assert = require('assert')
const dateUtil = require('../utils/dateUtil')
const uuidGenerator = require('uuid/v4')
const mailSend = require('./mail')

/**
 *
 * @param params
 * @returns {Promise<void>}
 */
async function save(params, callback) {
    let notifyInfo = {};
    assert.ok(params.receiverUid, "receiverUid is null");
    assert.ok(params.receiverName, "receiverName is null");
    assert.ok(params.notifyUid, "notifyUid is null");
    assert.ok(params.notifyName, "notifyName is null");
    notifyInfo.receiverUid = params.receiverUid;
    notifyInfo.receiverName = params.receiverName;
    notifyInfo.notifyUid = params.notifyUid;
    notifyInfo.notifyName = params.notifyName;
    notifyInfo.notifyType = params.notifyType;
    notifyInfo.notifyValue = params.notifyValue;
    notifyInfo.bizType = params.bizType;
    notifyInfo.stat = 0;
    notifyInfo.id = uuidGenerator().replace(/-/g, '');
    notifyInfo.version = 1;
    notifyInfo.create_time = dateUtil.nowTime();
    notifyInfo.update_time = notifyInfo.create_time;
    await  mysql("notify_message_info").insert(notifyInfo).then(res => {
        if (notifyInfo.notifyType == 1) {
            notifyInfo.taskName = params.taskName;
            mailSend.sendMail(params.notifyValue, notifyInfo).catch(err => {
                console.error(err.message);
                process.exit(1);
            });
        }
        callback(res);
    }).catch(function (error) {
        console.error(error);
        callback(-1);
    })
}

async function update(notifyInfo) {

}

module.exports = {
    save,
    update
}