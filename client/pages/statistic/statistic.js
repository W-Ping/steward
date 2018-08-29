// pages/statistic/statistic.js
const cache = require("../../utils/cache.js")
const currYear = new Date().getFullYear(); // 月份
const currMonth = new Date().getMonth() + 1; // 月份
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    workSum: 0,
    restSum: 0,
    overtimeSum: 0,
    days_style: [],
    userinfo:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var year = new Date().getFullYear(); // 年份
    var month = new Date().getMonth() + 1; // 月份
    this.initCalendar(year, month);
  },
  initCalendar: function(year, month) { //月份没有加1
    let days_style = new Array;
    let today = new Date().getDate();
    const days_count = new Date(year, month, 0).getDate();
    for (let i = 1; i <= days_count; i++) {
      const date = new Date(year, month - 1, i);
      if (today == i && currMonth == month && currYear == year) {
        days_style.push({
          month: 'current',
          day: i,
          color: 'white',
          background: '#00abff'
        });
      } else {
        days_style.push({
          month: 'current',
          day: i,
          color: '#4b5cc4'
        });
      }
    }
    this.setData({
      days_style
    });
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
    var userinfo = cache.getUserInfoCache();
    console.log(userinfo);
    this.setData({
      userinfo: userinfo,
      hasUserInfo: true
    })
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
  next: function(event) {
    console.log(event.detail);
    var obj = event.detail;
    this.initCalendar(obj.currentYear, obj.currentMonth);
  },
  prev: function(event) {
    console.log(event.detail);
    var obj = event.detail;
    this.initCalendar(obj.currentYear, obj.currentMonth);

  },
  dateChange: function(event) {
    console.log(event.detail);
    var obj = event.detail;
    this.initCalendar(obj.currentYear, obj.currentMonth);
  },
  dayClick: function(event) {
    var selectedDate = event.detail;
    console.log(event.detail);
    var date = selectedDate.year + "-" + selectedDate.month + "-" + selectedDate.day
    wx.navigateTo({
      url: './task?date=' + date,
    })
  },
  overtime: function(e) {
    var random = Math.floor(Math.random() * 100);
    this.setData({
      overtimeSum: random,
    })
  },
  rest: function(e) {
    var random = Math.floor(Math.random() * 100);
    this.setData({
      restSum: random,
    })
  },
  work: function(e) {
    var random = Math.floor(Math.random() * 100);
    this.setData({
      workSum: random
    })
  },
  onGetUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  setting: function(e) {
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: './setting?uid=' + uid,
    })
  }
})