const {SUCCESS, FAILED, CNF} = require('./constants')
const {mysql} = require('../qcloud')
const debug = require('debug')
const assert = require('assert')
const db = require('../tools/db')
const dateUtil = require('../utils/dateUtil')
const uuidGenerator = require('uuid/v4')
const linkman = require('./linkman')
const notifyJs = require('./notify')

/**
 * 删除任务
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function del(ctx, next) {
    let {uid, id} = ctx.query
    assert.ok(id, '删除id不能为空')
    assert.ok(uid, '用户uid不能为空')
    await mysql(CNF.DB_TABLE.task_info).del().where({id: id, uid: uid}).whereIn('stat', [0, 3]).then(function (res) {
        SUCCESS(ctx, res)
    }).catch(function (error) {
        console.error(error)
        FAILED(ctx, error)
    })
}

/**
 * 创建任务
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function create(ctx, next) {
    let taksInfo = ctx.request.body
    assert.ok(taksInfo && taksInfo.uid, "用户uid不存在")
    await db.create(CNF.DB_TABLE.task_info, taksInfo, function (res) {
        assert.notEqual(res, -1, 'create task fail')
        SUCCESS(ctx, res)
    }).catch(function (error) {
        console.error(error)
        FAILED(ctx, error)
    })
}

/**
 * 更新任务信息
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function update(ctx, next) {
    let reqinfo = ctx.request.body
    let taksInfo = {}
    if (reqinfo.taskName) {
        taksInfo.taskName = reqinfo.taskName
    }
    if (reqinfo.startTime) {
        taksInfo.startTime = reqinfo.startTime;
    }
    if (reqinfo.endTime) {
        taksInfo.endTime = reqinfo.endTime;
    }
    if (reqinfo.planHour) {
        taksInfo.planHour = reqinfo.planHour;
    }
    if (reqinfo.taskDescribe) {
        taksInfo.taskDescribe = reqinfo.taskDescribe;
    }
    if (reqinfo.level) {
        taksInfo.level = reqinfo.level;
    }
    if (reqinfo.taskName) {
        taksInfo.taskName = reqinfo.taskName;
    }
    if (reqinfo.handlerUid) {
        taksInfo.handlerUid = reqinfo.handlerUid;
    }
    if (reqinfo.handlerName) {
        taksInfo.handlerName = reqinfo.handlerName;
    }
    preUpdateTask(reqinfo, taksInfo)
    let condition = {
        version: reqinfo.version,
        id: reqinfo.id
    }
    await
        db.update(CNF.DB_TABLE.task_info, taksInfo, condition, function (res) {
            assert.notEqual(res, -1, 'update task fail')
            SUCCESS(ctx, res)
        }).catch(function (error) {
            console.error(error)
            FAILED(ctx, error)
        })
}

/**
 *
 * @param taksInfo
 * @returns {Promise<*>}
 */
async function preUpdateTask(reqinfo, taksInfo) {
    var taksInfo = taksInfo || {}
    if (reqinfo && reqinfo.stat == 0) {//任务撤销
        taksInfo.startTime = null;
        taksInfo.planEndTime = null;
        taksInfo.stat = reqinfo.uid != reqinfo.uid ? 3 : 0;
        await db.getById(CNF.DB_TABLE.task_info, reqinfo.id, async function (res) {
            if (res[0].uid !== reqinfo.uid) {//不是自己创建的任务 撤回到分配状态
                taksInfo.stat = 3;
            } else {
                taksInfo.stat = 0;
            }
            db.update(CNF.DB_TABLE.task_handle_info, {stat: 0}, {
                taskId: reqinfo.id,
                handlerUid: reqinfo.uid
            }, function (resp) {
                console.log("更新任务处理表状态", resp)
            })
        })

    } else if (reqinfo && reqinfo.stat == 1) {    // 启动任务
        var nowTime = dateUtil.nowTime();
        taksInfo.stat = 1;
        taksInfo.startTime = nowTime;
        await db.getById(CNF.DB_TABLE.task_info, reqinfo.id, async function (res) {
            taksInfo.planEndTime = dateUtil.dateAdd(nowTime, res[0].planHour || 0);
            if (res[0].stat == 0 && res[0].uid == reqinfo.uid) {//自己创建的任务 启动
                taksInfo.handlerUid = res[0].uid;
                taksInfo.handlerName = res[0].realName;
                taksInfo.assignTime = nowTime;
            } else if (res[0].stat == 3 && res[0].uid != reqinfo.uid) {//其他人分配给我的任务 启动
                let handleInfo = {
                    stat: 1
                }
                db.update(CNF.DB_TABLE.task_handle_info, handleInfo, {
                    taskId: reqinfo.id,
                    handlerUid: reqinfo.uid
                }, function (resp) {
                    console.log("更新任务处理表状态")
                })
            } else {

            }
        })
    } else if (reqinfo && reqinfo.stat == 2) { // 任务完成
        taksInfo.endTime = dateUtil.nowTime();
        taksInfo.stat = 2;
        let handleInfo = {
            stat: 2
        }
        db.update(CNF.DB_TABLE.task_handle_info, handleInfo, {
            taskId: reqinfo.id,
            handlerUid: reqinfo.uid
        }, function (resp) {
            console.log("更新任务处理表状态", resp);
        })
    } else if (reqinfo && reqinfo.stat == 3) {//任务分配
        taksInfo.assignTime = dateUtil.nowTime();
        taksInfo.stat = 3;
        taksInfo.handlerName = reqinfo.handlerName;
        //新增 linkman
        if (!reqinfo.handlerUid) {
            let linkUid = uuidGenerator().replace(/-/g, '');
            let linkmanInfo = {
                uid: reqinfo.uid,
                linkUid: linkUid,
                linkmanName: reqinfo.handlerName,
                linkmanMail: reqinfo.handlerMail
            }
            taksInfo.handlerUid = linkUid;
            linkman.save(linkmanInfo, function (res) {
                console.log(res);
            })
        } else {
            taksInfo.handlerUid = reqinfo.handlerUid;
            //更新linkman
            await  mysql("user_linkman_info").select("*").where({linkUid: reqinfo.handlerUid}).then(async (res) => {
                if (res && res[0]) {
                    if (res[0].linkmanName !== reqinfo.handlerName || res[0].linkmanMail !== reqinfo.handlerMail) {
                        let updateLinkman = {
                            linkmanMail: reqinfo.handlerMail,
                            linkmanName: reqinfo.handlerName,
                            version: res[0].version + 1
                        }
                        await mysql("user_linkman_info").update(updateLinkman).where({linkUid: reqinfo.handlerUid}).then(res => {
                            console.log("更新linkman", res);
                        });
                    }
                }
            })
        }
        //创建或更新任务处理记录
        db.getById(CNF.DB_TABLE.task_info, reqinfo.id, async function (result) {
            if (result && result[0]) {
                var task = result[0];
                await mysql("task_handle_info").select("*").where({
                    handlerUid: reqinfo.handlerUid,
                    taskId: task.id
                }).then(async (res) => {
                    if (res && res[0]) {
                        let updateHandleInfo = {
                            handlerMail: reqinfo.handlerMail,
                            handlerName: reqinfo.handlerName,
                            taskName: task.taskName
                        }
                        await   mysql("task_handle_info").update(updateHandleInfo).where({
                            taskId: task.id,
                            handlerUid: taksInfo.handlerUid
                        }).then(update => {
                            console.log("更新任务分配结果", update)
                        })
                    } else {
                        var params = {
                            taskId: task.id,
                            taskName: task.taskName,
                            taskCreateTime: task.create_time,
                            assignerUid: task.uid,
                            assignerName: task.realName,
                            handlerUid: taksInfo.handlerUid,
                            handlerName: reqinfo.handlerName,
                            handlerMail: reqinfo.handlerMail || '',
                            stat: 0
                        }
                        db.create(CNF.DB_TABLE.task_handle_info, params, function (resp) {
                            console.log("创建任务分配结果", resp)
                        })
                    }
                })
            }
        })
    }
    return taksInfo
}

/**
 * 查询任务明细
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function get(ctx, next) {
    let {id, uid} = ctx.query
    assert.ok(id, "id不存在")
    await mysql(CNF.DB_TABLE.task_info).select('task_info.*', 'task_handle_info.handlerUid', 'task_handle_info.handlerName', 'task_handle_info.handlerMail').leftJoin(CNF.DB_TABLE.task_handle_info, function () {
        this.on('task_info.id', '=', 'task_handle_info.taskId').on('task_info.handlerUid', '=', 'task_handle_info.handlerUid')
    }).whereRaw("task_info.id=?", [id]).then(function (res) {
        SUCCESS(ctx, convert(res, uid));
    }).catch(function (error) {
        console.error(error)
        FAILED(ctx, error)
    })
    // await db.getById(CNF.DB_TABLE.task_info, id, function (res) {
    //     SUCCESS(ctx, convert(res));
    // }).catch(function (error) {
    //     console.error(error)
    //     FAILED(ctx, error)
    // })
}

/**
 * 查询任务列表
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function query(ctx, next) {
    let condition = ctx.request.body
    assert.ok(condition && condition.uid, "用户uid不存在")
    if (condition.stat == 0) {//待办
        //查询我创建待办的任务和分配给我的任务
        await mysql(CNF.DB_TABLE.task_info).select("*").where({handlerUid: condition.uid, stat: 3}).orWhere({
            stat: 3,
            uid: condition.uid
        }).orWhere({
            stat: 0,
            uid: condition.uid
        }).then(async function (res) {
            SUCCESS(ctx, convert(res, condition.uid))
        }).catch(function (error) {
            console.error(error)
            FAILED(ctx, error)
        })
    } else if (condition.stat == 1 || condition.stat == 2) {//处理中或处理完成
        await mysql(CNF.DB_TABLE.task_info).select("*").where({
            handlerUid: condition.uid,
            stat: condition.stat
        }).then(function (res) {
            SUCCESS(ctx, convert(res, condition.uid))
        }).catch(function (error) {
            console.error(error)
            FAILED(ctx, error)
        })

    }

}

function convert(res, uid) {
    if (res && res.length > 0) {
        res.forEach(function (item, index) {
            if (item.create_time) {
                item.create_time = dateUtil.formatTime(new Date(item.create_time))
            }
            if (item.update_time) {
                item.update_time = dateUtil.formatTime(new Date(item.update_time))
            }
            if (item.assignTime) {
                item.assignTime = dateUtil.formatTime(new Date(item.assignTime))
            }
            if (item.planEndTime) {
                item.planEndTime = dateUtil.formatTime(new Date(item.planEndTime))
                // 剩余时间负数说明超时了
                item.remainTime = dateUtil.dateDiff(item.planEndTime, dateUtil.nowTime()) + dateUtil.dateUnit()
            }
            if (item.endTime) {
                item.endTime = dateUtil.formatTime(new Date(item.endTime))
            }
            if (item.startTime) {
                item.startTime = dateUtil.formatTime(new Date(item.startTime))
            }
            //判断是否是自己的任务标识
            if (item.uid == uid) {
                item.isOwn = true;
            } else {
                item.isOwn = false;
            }
            if (item.level == 1) {
                item.levelText = '一级'
            } else if (item.level == 2) {
                item.levelText = '二级'
            } else if (item.level == 3) {
                item.levelText = '三级'
            }
        })
    }
    return res
}

async function notify(ctx, next) {
    let {taskId} = ctx.request.body;
    await mysql("task_info").select("*").innerJoin("task_handle_info", function () {
        this.on("task_handle_info.taskId", "=", "task_info.id").on("task_handle_info.handlerUid", "=", "task_info.handlerUid")
    }).whereRaw("task_info.id=?", [taskId]).then(async (res) => {
        if (res && res[0]) {
            let notifyInfo = {};
            notifyInfo.receiverUid = res[0].handlerUid;
            notifyInfo.receiverName = res[0].handlerName;
            notifyInfo.receiverMail = res[0].handlerMail;
            notifyInfo.notifyUid = res[0].uid;
            notifyInfo.notifyName = res[0].realName;
            notifyInfo.taskId = res[0].taskId;
            notifyInfo.level=res[0].level;
            notifyInfo.taskName=res[0].taskName;
            notifyInfo.taskDescribe=res[0].taskDescribe;
            notifyInfo.assignTime=res[0].assignTime;
            notifyInfo.planHour=res[0].planHour;
            await notifyJs.save(notifyInfo, function (result) {
                assert.notEqual(result, -1, 'notifyInfo task fail')
                SUCCESS(ctx, result);
            }).catch(function (error) {
                FAILED(ctx, error);
            });
        }
    })
}

module.exports = {
    del,
    create,
    update,
    get,
    notify,
    query
}
