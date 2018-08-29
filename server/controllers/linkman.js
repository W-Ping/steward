const {SUCCESS, FAILED, CNF} = require("./constants")
const {mysql} = require("../qcloud");
const debug = require('debug');
const uuidGenerator = require('uuid/v4')
const assert = require('assert')

async function create(ctx, next) {
    let {linkmanInfo} = ctx.request.body;
    assert.ok(linkmanInfo, "参数信息不能为空");
    assert.ok(linkmanInfo.linkmanName, "联系人信息不能为空");
    linkmanInfo.id=uuidGenerator().replace(/-/g, '');
    linkmanInfo.version=1;
    await  mysql(CNF.DB_TABLE.user_linkman_info).returning('id').insert(linkmanInfo).then(function (res) {
        SUCCESS(ctx, res);
    }).catch(function (error) {
        FAILED(ctx, error);
    })

}
async function save(linkmanInfo,callback) {
    assert.ok(linkmanInfo, "参数信息不能为空");
    assert.ok(linkmanInfo.linkmanName, "联系人信息不能为空");
    assert.ok(linkmanInfo.uid, "创建人信息不能为空");
    linkmanInfo.id=uuidGenerator().replace(/-/g, '');
    linkmanInfo.version=1;
    console.log("联系人信息：",linkmanInfo);
   await mysql(CNF.DB_TABLE.user_linkman_info).returning('id').insert(linkmanInfo).then(function (res) {
       callback(res);
    }).catch(function (error) {
       callback(error);
    })
}

async function update(ctx, next) {
}

async function get(ctx, next) {
}

async function query(ctx, next) {
    let {uid} = ctx.request.body;
    await mysql(CNF.DB_TABLE.user_linkman_info).select("*").where({uid:uid}).then(function (res) {
        SUCCESS(ctx, res);
    }).catch(function (error) {
        FAILED(ctx, error);
    })
}
module.exports = {
    get,
    create,
    save,
    update,
    query
}