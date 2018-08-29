// pages/statistic/setting.js
var request = require('../../utils/request')
const cache = require("../../utils/cache.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    gender: 0,
    nickName: "测试用户",
    realName: "刘测已",
    birthday: "1991-05-21",
    e_mail: "344545454@qq.com",
    open: true,
    company_name: "上海公司",
    company_address: '上海市黄浦区黄河路65号',
    compangy_location: '121.47081,31.23406',
    company_region: '上海市黄浦区',
    postcode: "2100010",
    compangy_mail: "admin@iris.com",
    family_address: '上海市浦东新区航昌路199弄1～31号',
    family_location: '121.60946,31.07931',
    family_region: '上海市浦东新区',
    mobile_phone: "13900000011",
    userinfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var uid = options.uid;
    var userinfo = cache.getUserInfoCache();
    console.log(userinfo);
    this.setData({
      userinfo: userinfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  bindblur: function(e) {
    console.log(e);
    var name = e.currentTarget.dataset.name;
    var userinfo = this.data.userinfo;
    console.log(userinfo);
    var value = e.detail.value;
    switch (name) {
      case "nickName":
        userinfo.nickName = value;
        break;
      case "realName":
        userinfo.realName = value;
        break;
      case "mobile_phone":
        userinfo.mobile_phone = value;
        break;
      case "e_mail":
        userinfo.e_mail = value;
        break;
      case "company_name":
        userinfo.company_name = value;
        break;
      case "company_mail":
        userinfo.company_mail = value;
        break;
      case "postcode":
        userinfo.postcode = value;
        break;
    }
    this.setData({
      userinfo: userinfo
    })

  },
  switchChange: function(e) {
    console.log('switch 发生 change 事件，携带值为', e.detail.value);
    var openFlag = e.detail.value;
    var userinfo = this.data.userinfo;
    userinfo.open = openFlag == true ? 0 : 1;
    console.log(userinfo);
    this.setData({
      userinfo: userinfo,
    });
  },
  changeAvatar: function(e) {
    var that = this;
    var userinfo = this.data.userinfo;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePath = res.tempFilePaths[0];
        userinfo.avatarUrl = tempFilePath;
        console.log(tempFilePath);
        that.setData({
          userinfo: userinfo,
        });
      }
    })
  },
  bindDateChange: function(e) {
    var userinfo = this.data.userinfo;
    userinfo.birthday = e.detail.value;
    this.setData({
      userinfo: userinfo
    })
  },
  changeAddressText: function(data) {
    this.setData({
      userinfo: data
    })
  },
  changeAddress: function(e) {
    var tp = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: './address?type=' + tp,
    })
  },
  formSubmit: function(e) {
    var userinfo = e.detail.value;
    userinfo.open = userinfo.open == true ? 0 : 1;
    var params = {
      userinfo: userinfo
    };
    request.postReq("updateUserInfo", params, function(res) {
      console.log(res);
      if (res.code == 1) {
        cache.setUserInfoCache(userinfo);
        var userinfo1 = cache.getUserInfoCache();
        console.log(userinfo1);
        wx.showToast({
          title: '保存成功!',
        })
      }
    })
  },
  changeGender: function(e) {
    var that = this;
    var userinfo = this.data.userinfo;
    wx.showActionSheet({
      itemList: ["女", "男"],
      success: function(res) {
        userinfo.gender = res.tapIndex;
        that.setData({
          userinfo: userinfo
        })
      }
    })
  }
})