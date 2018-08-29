/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const {auth: {authorizationMiddleware, validationMiddleware}} = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)
//获取用户信息
router.get('/userinfo/get', controllers.userinfo.get)
//创建用户信息
router.post('/userinfo/create', controllers.userinfo.create)
//跟新用户信息
router.post('/userinfo/update', controllers.userinfo.update)
//创建任务
router.post('/task/create', controllers.task.create)
//删除任务
router.del('/task/delete', controllers.task.del)
//查询任务
router.post('/task/query', controllers.task.query)
//查询任务明细
router.get('/task/get', controllers.task.get)
//更新任务信息
router.post('/task/update', controllers.task.update)
//保存通知消息
router.post('/task/notify', controllers.task.notify)
//创建一天时间记录
router.post('/cycle/create', controllers.cycle.create)
//更新一天时间记录
router.post('/cycle/update', controllers.cycle.update)
//查询一天时间记录
router.post('/cycle/query', controllers.cycle.query)

//创建联系人信息
router.post('/linkman/create', controllers.linkman.create)
//更新联系人信息
router.post('/linkman/update', controllers.linkman.update)
//查询联系人信息
router.get('/linkman/get', controllers.linkman.get)
//查询联系人信息列表
router.post('/linkman/query', controllers.linkman.query)

module.exports = router
