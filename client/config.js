/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
// var host = 'https://taflgi5t.qcloud.la';
var host = 'http://127.0.0.1:5757';

var config = {
  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,
    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,
    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,
    //上传图片接口
    uploadUrl: `${host}/weapp/upload`,
    //获取用户信息
    getUserInfo: `${host}/weapp/userinfo/get`,
    //创建新的用户
    createUserInfo: `${host}/weapp/userinfo/create`,
    //更新用户信息
    updateUserInfo: `${host}/weapp/userinfo/update`,
    //新建任务
    createTaskInfo: `${host}/weapp/task/create`,
    //查询任务
    queryTaskInfo: `${host}/weapp/task/query`,
    //查询任务明细
    getTaskInfo: `${host}/weapp/task/get`,
    //更新任务
    updateTaskInfo: `${host}/weapp/task/update`,
    //删除任务
    deleteTaskInfo: `${host}/weapp/task/delete`,
    //创建消息推送
    taskInfoNotify: `${host}/weapp/task/notify`,
    //查询一天时间记录
    queryCycleInfo: `${host}/weapp/cycle/query`,
    //创建一天时间记录
    createCycleInfo: `${host}/weapp/cycle/create`,
    //更新一天时间记录
    upateCycleInfo: `${host}/weapp/cycle/update`,
    //查询联系人信息列表
    queryLinkmanInfo: `${host}/weapp/linkman/query`
  }
};

module.exports = config;