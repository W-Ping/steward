//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var amap = require('./utils/amap.js');
App({
  onLaunch: function() {
    wx.checkSession({
      success: function() {
        console.log("session_key 未过期");
      },
      fail: function() {
        qcloud.Session.clear();
        console.log("session_key 已过期");
      }
    })
    //手机信息
    var phoneInfo = wx.getSystemInfoSync();
    this.globalData.phoneInfo = phoneInfo;
    qcloud.setLoginUrl(config.service.loginUrl);
    const session = qcloud.Session.get()
    if (!session) return;
    //当前位置
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function(res) {
        // console.log(res);
        var currLocation = {
          location: res.longitude + "," + res.latitude,
          latitude: res.latitude,
          longitude: res.longitude,
          speed: res.speed,
          accuracy: res.accuracy,
          name: '我的位置'
        }
        amap.getRegeo(currLocation, function(data) {
          // console.log(data);
        })
      }
    })
  },
  onShow: function() {
    this.getWeatherData();
    var that = this;
    setInterval(function() {
      console.log("天气信息已经更新了");
      that.getWeatherData(location);
    }, 1000 * 60 * 60 * 3); //3小时间重新一次
  },
  getWeatherData: function(params) {
    var that = this;
    amap.getWeather(params, function(data) {
      that.globalData.weatherData = data;
    })
  },

  globalData: {
    phoneInfo: {},
    weatherData: {}
  }
})