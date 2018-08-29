// pages/working/detail.js
var request = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectItems: [],
    radioItems: [{
        name: '一级',
        value: '1'
      },
      {
        name: '二级',
        value: '2'
      },
      {
        name: '三级',
        value: '3'
      }
    ],
    isAssign: false,
    position: "static",
    textareaShow: true,
    taskInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var radioItems = this.data.radioItems;
    request.getReq("getTaskInfo", "id=" + options.tid, (res) => {
      if (res.code == 1 && res.data.length > 0) {
        var taskInfos = res.data;
        var taskInfo = taskInfos ? taskInfos[0] : {};
        for (var i = 0; i < radioItems.length; i++) {
          if (radioItems[i].value == taskInfo.level) {
            radioItems[i].checked = true;
            break;
          }
        }
        this.setData({
          taskInfo: taskInfo,
          isAssign: options.isAssign ? options.isAssign : false,
          radioItems: radioItems
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.selectable = this.selectComponent("#selectable");
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
  radioChange: function(e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.radioItems.length; i++) {
      if (checked.indexOf(this.data.radioItems[i].value) !== -1) {
        changed['radioItems[' + i + '].checked'] = true
      } else {
        changed['radioItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
  },
  editSubmit: function(e) {
    var params = e.detail.value;
    console.log(params);
    request.postReq("updateTaskInfo", params, (res) => {
      if (res.code == 1) {
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
  showSelect: function(e) {
    var selectItems = []
    request.postReq("queryLinkmanInfo", null, res => {
      if (res.code == 1) {
        this.setData({
          selectItems: res.data,
          position: "fixed",
          textareaShow: false
        })
        this.selectable.showSelect(e);
      }
    })

  },
  selected: function(e) {
    console.log("选中事件", e);
    var selectedItems = this.selectable.data.selectedItems;
    var taskInfo = this.data.taskInfo;
    var selectedItem = selectedItems[0];
    console.log(selectedItem);
    if (selectedItem) {
      taskInfo.handlerName = selectedItem.name;
      taskInfo.handlerUid = selectedItem.value;
      taskInfo.handlerMail = selectedItem.linkmanMail;
    } else {
      taskInfo.handlerName = '';
      taskInfo.handlerUid = '';
      taskInfo.handlerMail = '';
    }
    this.setData({
      taskInfo: taskInfo
    })
  },
  closeSelect: function(e) {
    console.log("关闭", e);
    this.setData({
      position: "static",
      textareaShow: true,
    })
  },
  bindinput: function(e) {
    var taskInfo = this.data.taskInfo;
    taskInfo.handlerName = e.detail.value;
    taskInfo.handlerUid = '';
    taskInfo.handlerMail = '';
    this.setData({
      taskInfo: taskInfo
    })
  },
  deleteTask: function(e) {
    var taskId = e.currentTarget.dataset.taskid;
    request.delReq("deleteTaskInfo", "id=" + taskId, (res) => {
      if (res.code == 1) {
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
})