const db = require("../tools/db")
const {SUCCESS, FAILED, CNF} = require("./constants")
const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v4')
const assert = require('assert')
/**
 *  根据uid查询用户信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function get(ctx, next) {
    let {uid} = ctx.query;
    await db.geByCondition(CNF.DB_TABLE.user_info, {uid: uid}, function (res) {
        SUCCESS(ctx, res);
    });

}

/**
 * 创建用户信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function create(ctx, next) {
    let {userinfo} = ctx.request.body;
    let params = {
        uid: userinfo.openId,
        nickName: userinfo.nickName,
        realName: userinfo.realName ? userinfo.realName : userinfo.nickName,
        province: userinfo.province,
        city: userinfo.city,
        country: userinfo.country,
        avatarUrl: userinfo.avatarUrl,
        gender: userinfo.gender
    }
    await db.create(CNF.DB_TABLE.user_info, params, function (res) {
        assert.notEqual(res, -1, "create user fail")
        SUCCESS(ctx, res);
    }).catch(function (error) {
        FAILED(ctx, error);
    });
}

/**
 * 更新用户信息
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
async function update(ctx, next) {
    var {userinfo} = ctx.request.body;
    assert.ok(userinfo.uid, '用户uid不能为空')
    var condition = {
        uid: userinfo.uid
    }
    var updateUser = {}
    if (userinfo.nickName) {
        updateUser.nickName = userinfo.nickName;
    }
    if (userinfo.realName) {
        updateUser.realName = userinfo.realName;
    }
    if (userinfo.avatarUrl) {
        updateUser.avatarUrl = userinfo.avatarUrl;
    }
    if (userinfo.e_mail) {
        updateUser.e_mail = userinfo.e_mail;
    }
    if (userinfo.mobile_phone) {
        updateUser.mobile_phone = userinfo.mobile_phone;
    }
    if (userinfo.gender) {
        updateUser.gender = userinfo.gender;
    }
    if (userinfo.birthday) {
        updateUser.birthday = userinfo.birthday;
    }
    if (userinfo.open) {
        updateUser.open = userinfo.open;
    }
    if (userinfo.family_region) {
        updateUser.family_region = userinfo.family_region;
    }
    if (userinfo.family_address) {
        updateUser.family_address = userinfo.family_address;
    }
    if (userinfo.family_location) {
        updateUser.family_location = userinfo.family_location;
    }
    if (userinfo.stat) {
        updateUser.stat = userinfo.stat;
    }
    //公司信息
    if(userinfo.company_name){
        updateUser.company_name=userinfo.company_name;
    }
    if(userinfo.company_region){
        updateUser.company_region=userinfo.company_region;
    }
    if(userinfo.company_location){
        updateUser.company_location=userinfo.company_location;
    }
    if(userinfo.company_mail){
        updateUser.company_mail=userinfo.company_mail;
    }
    if(userinfo.postcode){
        updateUser.postcode=userinfo.postcode;
    }
    await db.update(CNF.DB_TABLE.user_info, updateUser, condition, function (res) {
        SUCCESS(ctx, res);
    }).catch(function (error) {
        FAILED(ctx, error);
    });
}

async function query(ctx, next) {
    await mysql(CNF.DB_TABLE.user_info).select("*").where()
}

module.exports = {
    get,
    create,
    update,
    query
}