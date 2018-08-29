// pages/home/home.js
var util = require('../../utils/util.js')
var amap = require('../../utils/amap.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    scale: 12,
    currentTab: 0,
    weatherData: {},
    trafficType: 0, //0：公交 1：自驾 2：骑行 3：步行
    transitRoute: {}, //公交
    drivingRoute: {}, //自驾
    ridingRout: {}, //骑行
    walkingRoute: {}, //步行
    markers: [],
    polyline: [],
    localtion: {},
    trafficInfo: {},
    sleepTime: '',
    punchOutTime: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var weatherData = app.globalData.weatherData;
    // console.log(weatherData);
    var winHeight = app.globalData.phoneInfo.windowHeight;
    this.setData({
      winHeight: winHeight,
      weatherData: weatherData
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('navi-map')
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.currentTab == 1) {
      var startLocation = wx.getStorageSync("startLocation");
      var trafficInfo = wx.getStorageSync("trafficInfo");
      var data = {
        startLocation: startLocation
      }
      if (trafficInfo) {
        data.trafficInfo = trafficInfo;
      }
      this.setData(data);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  swichTab: function (e) {
    var currentTab = e.currentTarget.dataset.currenttab;
    this.setData({
      currentTab: currentTab
    })
    console.log(this.data.currentTab);
    if (currentTab == 1) {
      var startLocation = wx.getStorageSync("startLocation");
      console.log(startLocation);
      var trafficInfo = wx.getStorageSync("trafficInfo");
      var data = {
        startLocation: startLocation
      }
      if (trafficInfo) {
        data.trafficInfo = trafficInfo;
      }
      console.log(data);
      this.setData(data)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  save: function (e) {
    console.log(e)
  },
  trafficDetail: function (e) {
    var trafficType = e.currentTarget.dataset.traffictype;
    wx.navigateTo({
      url: '../traffic/traffic?type=' + trafficType,
    })
  },
  nearbyClick: function (e) {

  },
  routeClick: function (e) {
    console.log("routeClick...")
    wx.navigateTo({
      url: '../traffic/traffic',
    })
  },
  newRouteClick: function (e) {

  },
  startClick: function (e) {
    util.timer(this)
    if (!this.setTimeout) {
      this.setData({
        btnClass: 'work work-on',
        workStatus: "上班打卡"
      })
      this.getDateTimer();
    } else {
      this.clearTimeout()
    }
  },
  clickScale: function (e) {
    var scaleType = e.currentTarget.dataset.scaletype;
    var scale = e.currentTarget.dataset.scale; //5-20
    var newScale = scale + scaleType * 1; //增量1
    if (newScale < 5) {
      newScale = 5;
    }
    if (newScale > 20) {
      newScale = 20
    }
    this.setData({
      scale: newScale
    })
  },
  bindmarkertap: function (e) {
    console.log(e);
    console.log(this.data.trafficInfo);
    var marker = this.data.trafficInfo.markers[e.markerId];
    console.log(marker);
    var params = {
      location: marker.longitude + "," + marker.latitude
    }
    amap.getRegeo(params, function (data) {
      console.log(data);
    })
  },
  sleep: function (e) {
    var sleepTime = this.data.sleepTime;
    if (sleepTime) {
      wx.showToast({
        icon: 'success',
        duration: 2000,
        title: '快点睡觉啦~',
      })
      wx.vibrateLong({
        success: function () {}
      })
    } 
    var sleepTime = util.formatDate(new Date(), "h:m:s");
    this.setData({
      sleepTime: sleepTime
    })
  },
  punchOut: function (e) {
      wx.vibrateLong({
        success: function () { }
      })
      var punchOutTime = util.formatDate(new Date(), "h:m:s");
      this.setData({
        punchOutTime: punchOutTime
      })

  }
})