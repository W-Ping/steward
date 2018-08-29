const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};
const formatDate = (date, format) => {
  format = format == undefined ? "Y-M-D:h:m:s" : format;
  var formateArr = ["Y", "M", "D", "h", "m", "s"];
  var returnArr = [];
  returnArr.push(formatNumber(date.getFullYear()));
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  returnArr.push(formatNumber(date.getMilliseconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
};
const formatUnixTime = (time, format) => {
  return formatDate(new Date(time), format);
};
const formatMilliseTime = (milliseTime, format) => {
  return formatDate(new Date(milliseTime), format);
};
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const format3Number = n => {
  n = n.toString()
  return n[2] ? n : n[1] ? '0' + n : '00' + n
}
//计数器
var timer = function(that) {
  var spend = that._timerSpend || 50;
  that._timerHour = that._timerHour || 0;
  that._timerMinutes = that._timerMinutes || 0;
  that._timerSecond = that._timerSecond || 0;
  that._timerMillisecond = that._timerMillisecond || 0;
  that.initTimer = function() {
    this._timerHour = 0;
    this._timerMinutes = 0;
    this._timerSecond = 0;
    this._timerMillisecond = 0;
  }
  that.getDateTimer = function() {
    that.setTimeout = setTimeout(function() {
      that._timerMillisecond = that._timerMillisecond + spend;
      if (that._timerMillisecond >= 1000) {
        that._timerMillisecond = 0;
        that._timerSecond = that._timerSecond + 1;
      }
      if (that._timerSecond >= 60) {
        that._timerSecond = 0;
        that._timerMinutes = that._timerMinutes + 1;
      }
      if (that._timerMinutes >= 60) {
        that._timerMinutes = 0;
        that._timerHour = that._timerHour + 1;
      }
      var res = formatNumber(that._timerHour) + ":" + formatNumber(that._timerMinutes) + ":" + formatNumber(that._timerSecond) + ":" + format3Number(that._timerMillisecond);
      that.setData({
        _timerDate: res
      });
      that.getDateTimer()
    }, spend);
  }
  that.clearTimeout = function() {
    clearTimeout(that.setTimeout);
    that.setTimeout = null;
  }
  return that;
}

var marquee = function(that, obj) {
  var obj = obj != undefined ? obj : {};
  var marqueeConfig = {
    marqueeType: obj.marqueeType || 1, //滚动类型 1：文字滚动完了在滚动；2：新的文字接着滚动
    text: obj.text || 'This default marquee text', //滚动文字
    marqueePace: obj.marqueePace || 10, //滚动速度
    marqueeDistance: obj.marqueeDistance || 0, //初始滚动距离
    marqueeDistance2: obj.marqueeDistance || 0, //
    marquee2copy_status: false, //是否显示copy文本信息
    marquee2_margin: obj.marquee2_margin || 50, //滚动左边和右边的距离
    size: obj.size || 15, //字体大小
    color: obj.color || '#000',
    orientation: obj.orientation || 'left', //滚动方向
    interval: obj.interval || 20 // 时间间隔
  }
  var marquee = marqueeConfig;
  var length = marquee.text.length * marquee.size; //文字长度
  var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
  marqueeConfig.marquee2_margin = length < windowWidth ? windowWidth - length : marqueeConfig.marquee2_margin //当文字长度小于屏幕长度时，需要增加补
  that.setData({
    marqueeType: marqueeConfig.marqueeType,
    marquee: marqueeConfig,
    length: length,
    windowWidth: windowWidth,
    marquee: marquee
  });

  var marqueeType1 = function() {
    var interval = setInterval(function() {
      var lastMarquee = that.data.marquee;
      if (-lastMarquee.marqueeDistance < that.data.length) {
        lastMarquee.marqueeDistance = lastMarquee.marqueeDistance - lastMarquee.marqueePace;
        that.setData({
          marquee: lastMarquee
        });
      } else {
        clearInterval(interval);
        lastMarquee.marqueeDistance = that.data.windowWidth;
        that.setData({
          marquee: lastMarquee
        });
        marqueeType1();
      }
    }, marqueeConfig.interval);
  }
  var marqueeType2 = function() {
    var interval = setInterval(function() {
      var lastMarquee = that.data.marquee;
      if (-lastMarquee.marqueeDistance2 < that.data.length) {
        // 如果文字滚动到出现marquee2_margin的白边，就接着显示
        lastMarquee.marqueeDistance2 = lastMarquee.marqueeDistance2 - lastMarquee.marqueePace;
        // lastMarquee.marquee2copy_status = that.data.length + lastMarquee.marqueeDistance2 <= that.data.windowWidth + lastMarquee.marquee2_margin;

        lastMarquee.marquee2copy_status = that.data.length + lastMarquee.marqueeDistance2 <= that.data.windowWidth + lastMarquee.marquee2_margin;
        that.setData({
          marquee: lastMarquee
        });
      } else {
        if (-lastMarquee.marqueeDistance2 >= lastMarquee.marquee2_margin) { // 当第二条文字滚动到最左边时
          // console.log("重新滚动-->" +( -lastMarquee.marqueeDistance2))
          // console.log("重新滚动-->" + lastMarquee.marquee2_margin)
          //这里会出现闪屏
          lastMarquee.marqueeDistance2 = lastMarquee.marquee2_margin //重新回滚
          that.setData({
            marquee: lastMarquee
          });
          clearInterval(interval);
          marqueeType2();
        } else {
          clearInterval(interval);
          lastMarquee.marqueeDistance2 = -that.data.windowWidth;
          that.setData({
            marquee: lastMarquee
          });
          marqueeType2();
        }
      }
    }, marqueeConfig.interval);
  }
  if (obj.marqueeType == 1) {
    marqueeType1();
  } else if (obj.marqueeType == 2) {
    marqueeType2(obj.marqueeType == -1)
  } else if (-1) {
    marqueeType1();
    marqueeType2();
  }
}
// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();
  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}
function strlen(str) {
  if(!str) return 0;
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1 
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    }
    else {
      len += 2;
    }
  }
  return len;
}

module.exports = {
  formatTime,
  formatDate,
  formatUnixTime,
  timer,
  strlen,
  marquee,
  showBusy,
  showSuccess,
  showModel
}