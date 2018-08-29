// pages/traffic_detail/traffic_detail.js
var util = require('../../utils/util.js')
var amap = require('../../utils/amap.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 400,
    animationData: {},
    scale: 12, //地图比例
    map_scale: true, //地图view true:默认大小；false：缩小比例
    longitude: '121.475424', //经度
    latitude: '31.191984', //纬度
    markers: [], //地图标识
    polyline: [], //路线
    transits: [],
    steps: [],
    distance: 0, //距离
    taxi_cost: 0, //打车
    duration: 0 //时间分钟
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var strategy = options.st;
    var city = options.city;
    var origin = options.origin;
    var destination = options.destination;
    var winHeight = app.globalData.phoneInfo.windowHeight;
    var params = new Object();
    params.city = city;
    params.origin = origin;
    params.destination = destination;
    this.setData({
      winHeight: winHeight,
      strategy: strategy
    })
    console.log(params);
    var that = this;
    if (strategy == 0) { //公交
      params.strategy = options.stype;
      amap.getTransitRoute(params, function(data) {
        var trafficInfo = amap.transitRouteDefaultResult(data, params.origin, params.destination);
        that.setData({
          distance: trafficInfo.distance,
          taxi_cost: trafficInfo.taxi_cost,
          transits: trafficInfo.transits,
          markers: trafficInfo.markers,
          polyline: trafficInfo.polyline
        })
      });
    } else if (strategy == 1) { //自驾
      params.strategy = options.stype;
      amap.getDrivingRoute(params, function(data) {
        var trafficInfo = amap.drivingRoutDefaultResult(data, params.origin, params.destination);
        that.setData({
          distance: trafficInfo.distance,
          taxi_cost: trafficInfo.taxi_cost,
          steps: trafficInfo.steps,
          markers: trafficInfo.markers,
          polyline: trafficInfo.polyline
        })
      });
    } else if (strategy == 2) { //骑行
      amap.getRidingRout(params, function(data) {
        var trafficInfo = amap.ridingRoutDefaultResult(data, params.origin, params.destination);
        that.setData({
          distance: trafficInfo.distance,
          duration: trafficInfo.duration,
          steps: trafficInfo.steps,
          markers: trafficInfo.markers,
          polyline: trafficInfo.polyline
        })
      });
    } else if (strategy == 3) { //步行
      amap.getWalkingRoute(params, function(data) {
        var trafficInfo = amap.walkingRouteDefaultResult(data, params.origin, params.destination);
        that.setData({
          distance: trafficInfo.distance,
          duration: trafficInfo.duration,
          steps: trafficInfo.steps,
          markers: trafficInfo.markers,
          polyline: trafficInfo.polyline
        })
      });
    }
    // var pages = getCurrentPages();
    // var prePage = pages[pages.length - 2]; //上一页面
    // console.log(prePage);
    // if (prePage.route == 'pages/ready/ready') {
    //   var preData = prePage.data;
    //   this.setData({
    //     trafficType: preData.trafficType,
    //     transitRoute: preData.transitRoute,
    //     drivingRoute: preData.drivingRoute,
    //     ridingRout: preData.ridingRout,
    //     walkingRoute: preData.walkingRoute,
    //   })
    //   console.log(preData)
    // }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      delay: 100
    })

    this.animation = animation;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  clickScale: function(e) {
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
  bindtap: function(e) {
    var mapscale = e.currentTarget.dataset.mapscale;
    var mapheight = e.currentTarget.dataset.mapheight;
    var height = this.data.winHeight;
    if (mapscale) {
      height = height * 0.2
    } else {
      height = mapheight + 'px';
    }
    this.animation.height(height).step();
    this.setData({
      map_scale: !mapscale,
      animationData: this.animation.export()
    })
  },
})