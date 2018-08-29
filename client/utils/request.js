var qcloud = require('../vendor/wafer2-client-sdk/index')
var config = require('../config')
var util = require('../utils/util')
const cache = require("./cache.js")
/**
 * get 请求
 */
function getReq(funKey, params, callback) {
  var url = config.service[funKey];
  var userinfo = cache.getUserInfoCache();
  if (params) {
    url += ("?" + params);
    if (userinfo && userinfo.uid && params.indexOf("uid=") == -1) {
      url += ("&uid=" + userinfo.uid);
    }
  }

  console.log('get request：' + url);
  var that = this
  var options = {
    url: url,
    method: 'GET',
    success(result) {
      console.log('get request result' + JSON.stringify(result));
      if (callback && typeof(callback) == 'function') {
        callback(result.data);
      }
    },
    fail(error) {
      console.log('get request fail：', error);
      util.showModel('请求失败', error);
    }
  }
  wx.request(options)
  // qcloud.request(options)
}
/**
 * Post 请求
 */
const postReq = (funKey, params, callback, tip) => {
  var userinfo = cache.getUserInfoCache();
  var url = config.service[funKey];
  params = params ? params : {};
  params.uid = userinfo && userinfo.uid ? userinfo.uid : "";
  params.realName = userinfo && userinfo.realName ? userinfo.realName : "";
  console.info("Post request：" + url);
  console.info("Post request params：", params);
  var options = {
    url: url,
    data: params ? params : {},
    method: 'POST',
    success: (res) => {
      console.log("Post result:", res);
      if (callback && typeof(callback) == 'function') {
        callback(res.data);
      }
    },
    fail: (error) => {
      console.log('post request fail', error);
      util.showModel('请求失败', error);
    }
  };
  wx.request(options);
  // qcloud.request(options)
};
/**
 * PostReqOfAll 请求
 */
const postReqOfAll = (funKey, params, callback, tip) => {
  var userinfo = cache.getUserInfoCache();
  var url = config.service[funKey];
  params = params ? params : {};
  console.info("PostReqOfAll request：" + url);
  console.info("PostReqOfAll request params：", params);
  var options = {
    url: url,
    data: params ? params : {},
    method: 'POST',
    success: (res) => {
      console.log("PostReqOfAll result:", res);
      if (callback && typeof(callback) == 'function') {
        callback(res.data);
      }
    },
    fail: (error) => {
      console.log('PostReqOfAll request fail', error);
      util.showModel('请求失败', error);
    }
  };
  wx.request(options);
  // qcloud.request(options)
};
/**
 * delete 请求
 */
const delReq = (funKey, params, callback) => {
  if (!params) {
    util.showModel('删除失败', "参数错误");
  }
  var userinfo = cache.getUserInfoCache();
  var url = config.service[funKey];
  var urlParams = ("?uid=" + userinfo.uid + "&") + params;
  console.info("delete request：" + url + urlParams);
  wx.showModal({
    content: "确定删除？",
    success: function(res) {
      if (res.confirm) {
        var options = {
          url: url + urlParams,
          method: 'DELETE',
          success(result) {
            console.log(result);
            if (callback && typeof(callback) == 'function') {
              callback(result.data);
            }
          },
          fail(error) {
            console.log('delete request fail', error);
            util.showModel('请求失败', error);
          }
        }
        wx.request(options)
      } else if (res.cancel) {}
    }
  })
};

module.exports = {
  getReq,
  postReq,
  postReqOfAll,
  delReq
};