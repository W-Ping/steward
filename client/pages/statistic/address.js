// pages/statistic/address.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    opType: 0,
    address: "",
    location: '',
    region: ['上海市', '上海市', '浦东新区'],
    userinfo: {}
    // customItem: '全部'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var opType = options.type;
    console.log(opType);
    wx.setNavigationBarTitle({
      title: opType == 0 ? "设置常住地址" : "设置公司地址"
    })
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2]; //上一页面
    console.log(prePage);
    if (prePage.route == 'pages/statistic/setting') {
      var preData = prePage.data;
      var userinfo = preData.userinfo;
      if (opType == 0) {
        this.setData({
          userinfo: userinfo,
          address: userinfo.family_address,
          location: userinfo.family_location,
          opType: opType
        })
      } else {
        this.setData({
          userinfo: userinfo,
          address: userinfo.company_address,
          location: userinfo.company_location,
          opType: opType
        })
      }
    }

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
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  selectAddress: function(e) {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res);
        var name = res.name;
        var address = res.address;
        var location = res.longitude + "," + res.latitude;
        that.setData({
          address: address,
          location: location
        })
      }
    })
  },
  formSubmit: function(e) {
    console.log(e);
    var opt = this.data.opType;
    var data = e.detail.value;
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    if (prePage.route == 'pages/statistic/setting') {
      var userinfo = prePage.data.userinfo;
      console.log(userinfo);
      if (opt == 0) {
        userinfo.family_address = data.address;
        userinfo.family_region = data.region;
        userinfo.family_location = data.location;
      } else {
        userinfo.company_address = data.address;
        userinfo.company_region = data.region;
        userinfo.company_location = data.location;
      }
      prePage.changeAddressText(userinfo);
    }
    wx.navigateBack({
      delta: 1,
    })
  },
  bindconfirm: function(e) {
    console.log(e);
    var value = e.detail.value;
  }
})