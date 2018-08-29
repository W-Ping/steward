var config = require('../../config')
var util = require('../../utils/util')
var request = require('../../utils/request')
var util = require('../../utils/util.js')
const cache = require("../../utils/cache.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    radioItems: [{
        name: '一级',
        value: '1',
        checked: 'true'
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
    taskName: '',
    taskInfo: '',
    planHour: '',
    haveData: true,
    taskList: [{}, {}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad");
    // var that = this;
    // request.postReq("queryTaskInfo", null, function(res) {
    //   console.log(res);
    //   if (res.code == 1 && res.data) {
    //     var taskList = res.data;
    //     console.log(taskList);
    //     that.setData({
    //       taskList: taskList
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("onShow");
    var taskList = [];
    var haveData = false;
    var params = {};
    var currentTab = this.data.currentTab;
    if (currentTab != 0) {
      if (currentTab == 1) {
        params.stat = 0;
      } else if (currentTab == 2) {
        params.stat = 1;
      } else if (currentTab == 3) {
        params.stat = 2;
      }
      request.postReq("queryTaskInfo", params, (res) => {
        if (res.code == 1 && res.data.length > 0) {
          taskList = res.data;
          haveData = true;
        }
        this.setData({
          taskList: taskList,
          haveData: haveData
        })
      })
    }
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
  swichTab: function(e) {
    var currentTab = e.currentTarget.dataset.currenttab;
    this.setData({
      currentTab: currentTab
    })
    if (currentTab == 0) {

    } else {
      var that = this;
      var params = {};
      if (currentTab == 1) {
        params.stat = 0;
      } else if (currentTab == 2) {
        params.stat = 1;
      } else if (currentTab == 3) {
        params.stat = 2;
      }
      var taskList = [];
      var haveData = false;
      request.postReq("queryTaskInfo", params, function(res) {
        console.log(res);
        if (res.code == 1 && res.data.length > 0) {
          taskList = res.data;
          haveData = true;
        }
        console.log(taskList);
        that.setData({
          taskList: taskList,
          haveData: haveData
        })
      })
    }
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
  taskSubmit: function(e) {
    var task = e.detail.value;
    var that = this;
    request.postReq("createTaskInfo", task, function(res) {
      that.formReset();
      util.showSuccess("保存成功")
    })
  },
  formReset: function() {
    var radioItems = this.data.radioItems;
    for (var i = 0; i < radioItems.length; i++) {
      if (i == 0) {
        radioItems[i].checked = true;
      } else {
        radioItems[i].checked = false;
      }
    }
    this.setData({
      radioItems: radioItems,
      taskName: '',
      taskInfo: '',
      planHour: ''
    })
  },
  bracketClick: function(e) {
    var bracket = e.currentTarget.dataset.bracket;
    var index = e.currentTarget.dataset.index;
    var taskList = this.data.taskList;
    if (taskList) {
      var item = taskList[index];
      var bracket = item['bracket'];
      item['bracket'] = bracket && bracket == "up" ? "down" : "up";
      if (item['bracket'] == "down") { //隐身
        item.hiddenFlag = true;
      } else { //显身
        item.hiddenFlag = false;
      }
      taskList[index] = item;
      console.log(taskList);
      this.setData({
        taskList: taskList
      })
    }
  },
  assignTask: function(e) {
    var index = e.currentTarget.dataset.index;
    var taskList = this.data.taskList || [];
    var item = taskList[index];
    wx.navigateTo({
      url: './detail?isAssign=true&tid=' + item.id,
    })
  },
  startTask: function(e) {
    var index = e.currentTarget.dataset.index;
    var taskList = this.data.taskList || [];
    var item = taskList[index];
    console.log(item);
    var params = {
      id: item.id,
      stat: 1,
      version: item.version
    }
    var that = this;
    request.postReq("updateTaskInfo", params, function(res) {
      if (res.code == 1) {
        taskList.splice(index, 1);
        that.setData({
          taskList: taskList,
          haveData: taskList.length > 0
        })
      }
    })
  },
  stopTask: function(e) {
    var index = e.currentTarget.dataset.index;
    var taskList = this.data.taskList || [];
    var item = taskList[index];
    console.log(item);
    var params = {
      id: item.id,
      handlerUid: item.handlerUid,
      stat: 0,
      version: item.version
    }
    var that = this;
    request.postReq("updateTaskInfo", params, function(res) {
      if (res.code == 1) {
        taskList.splice(index, 1);
        that.setData({
          taskList: taskList,
          haveData: taskList.length > 0
        })
      }
    })
  },
  doneTask: function(e) {
    var index = e.currentTarget.dataset.index;
    var taskList = this.data.taskList || [];
    var item = taskList[index];
    var params = {
      id: item.id,
      stat: 2,
      version: item.version
    }
    var that = this;
    request.postReq("updateTaskInfo", params, function(res) {
      if (res.code == 1) {
        taskList.splice(index, 1);
        that.setData({
          taskList: taskList,
          haveData: taskList.length > 0
        })
      }
    })
  },
  navigateToDetail: function(e) {
    var index = e.currentTarget.dataset.index;
    var taskList = this.data.taskList || [];
    var item = taskList[index];
    wx.navigateTo({
      url: './detail?tid=' + item.id,
    })
  },
  notifyAssigner: function(e) {
    console.log("通知分配人")
    var index = e.currentTarget.dataset.index;
    var taskList = this.data.taskList;
    var taskInfo=taskList[index];
    console.log(taskInfo);
    request.postReq("taskInfoNotify", {taskId: taskInfo.id}, function (res) {
      console.log(res);
    });

  },
})