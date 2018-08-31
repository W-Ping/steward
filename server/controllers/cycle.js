const {SUCCESS, FAILED, CNF} = require("./constants")
const debug = require('debug');
const assert = require('assert');
const db = require("../tools/db")
const dateUtil = require("../utils/dateUtil")
const {mysql} = require("../qcloud");

/**
 * 创建
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function create(ctx, next) {
    let dayCycleInfo = ctx.request.body;
    dayCycleInfo.recordDate=dateUtil.formatUnixTime(new Date(),"Y-M-D");
    await db.create(CNF.DB_TABLE.cycle_info, dayCycleInfo, function (res) {
        assert.notEqual(res, -1, "create cycle_info fail");
        SUCCESS(ctx, res);
    }).catch(function (error) {
        console.error(error);
        FAILED(ctx, error);
    })
}

/**
 * 更新
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function update(ctx, next) {
    let reqinfo = ctx.request.body;
    let dayCycleInfo = {};
    if (reqinfo.attendanceTime) {
        dayCycleInfo.attendanceTime = reqinfo.attendanceTime;
    }
    if (reqinfo.closingTime) {
        dayCycleInfo.closingTime = reqinfo.closingTime;
    }
    if (reqinfo.sleepTime) {
        dayCycleInfo.sleepTime = reqinfo.sleepTime;
    }
    if (reqinfo.wakeUpTime) {
        dayCycleInfo.wakeUpTime = reqinfo.wakeUpTime;
    }
    if (reqinfo.remark) {
        dayCycleInfo.remark = reqinfo.remark;
    }
    let condition = {
        version: reqinfo.version,
        uid: reqinfo.uid,
        id: reqinfo.id
    }
    await db.update(CNF.DB_TABLE.cycle_info, dayCycleInfo, condition, function (res) {
        assert.notEqual(res, -1, "update day_cycle_info fail");
        SUCCESS(ctx, res);
    }).catch(function (error) {
        console.error(error);
        FAILED(ctx, error);
    })
}
/**
 *
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function query(ctx, next) {
    let reqinfo = ctx.request.body;
    let condition = {}
    if(condition.uid){
        condition.uid=reqinfo.uid;
    }
    if(reqinfo.recordDate){
        condition.recordDate=reqinfo.recordDate
    }
    if(reqinfo.timeType){
        condition.timeType=reqinfo.timeType
    }
    if(reqinfo.timeType){
        condition.timeType=reqinfo.timeType
    }
    if(reqinfo.id){
        condition.id=reqinfo.id
    }
    await db.geByCondition(CNF.DB_TABLE.cycle_info, condition, function (res) {
        assert.notEqual(res, -1, "query cycle_info fail");
        SUCCESS(ctx, res);
    }).catch(function (error) {
        console.error(error);
        FAILED(ctx, error);
    })
}
module.exports = {
    create,
    update,
    query
}