/***
 * 百度地图 API
 */
var bmap = require('../libs/bmap-wx.min.js');
var config = require('../libs/config.js');
var ak = config.Config.baidu_key;
var BMap = new bmap.BMapWX({
  ak: ak
});

function getWeather(params, callback) {
  var obj = new Object();
  obj.fail = function(data) {
    console.log('查询天气失败')
  };
  obj.success = function(data) {
    console.log('查询天气成功')
    callback(data);
  }
  if (params && params.location) {
    obj.location = params.location;
  }
  BMap.weather(obj);
}

function regeocoding(params, callback) {
  var obj = new Object();
  obj.fail = function(data) {
    console.log(data)
  };
  obj.success = function(data) {
    callback(data);
  }
  obj.iconPath = '../../images/marker.png';
  obj.iconTapPath = '../../images/marker.png';
  // 发起regeocoding检索请求 
  BMap.regeocoding(obj);
}
module.exports = {
  getWeather,
  regeocoding
}