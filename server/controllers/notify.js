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
    assert.ok(params.taskId, "taskId is null");
    notifyInfo.receiverUid = params.receiverUid;
    notifyInfo.receiverName = params.receiverName;
    notifyInfo.receiverMail = params.receiverMail;
    notifyInfo.notifyUid = params.notifyUid;
    notifyInfo.notifyName = params.notifyName;
    notifyInfo.taskId = params.taskId;
    notifyInfo.stat = 0;
    notifyInfo.id = uuidGenerator().replace(/-/g, '');
    notifyInfo.version = 1;
    notifyInfo.create_time = dateUtil.nowTime();
    notifyInfo.update_time = notifyInfo.create_time;
    await  mysql("notify_message_info").insert(notifyInfo).then(res => {
        console.log(res);
        notifyInfo.taskName = params.taskName;
        notifyInfo.taskId = params.taskId;
        notifyInfo.level = params.level;
        notifyInfo.taskName = params.taskName;
        notifyInfo.taskDescribe = params.taskDescribe;
        notifyInfo.assignTime = params.assignTime;
        notifyInfo.planHour = params.planHour;
        mailSend.sendMail(params.receiverMail, notifyInfo, async function (response) {
            let update = {};
            if (response.code == 1) {
                update.stat = 1;
            } else {
                update.stat = -1;
            }
            await mysql("notify_message_info").update(update).where({id: notifyInfo.id});
        }).catch(err => {
            console.error(err.message);
            // process.exit(1);
        });
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