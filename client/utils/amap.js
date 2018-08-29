/***
 * 高德地图 API
 */

var amapFile = require('../libs/amap-wx.js');
var config = require('../libs/config.js');
var key = config.Config.gaode_key;
var myAmapFun = new amapFile.AMapWX({
  key: key
});
var markers = [{
  iconPath: "../images/mapicon_navi_s.png",
  id: 0,
  latitude: 39.989643,
  longitude: 116.481028,
  width: 23,
  height: 33
}, {
  iconPath: "../images/mapicon_navi_e.png",
  id: 1,
  latitude: 39.90816,
  longitude: 116.434446,
  width: 24,
  height: 34
}];
/**
 * 获取周边的POI
 * @param params
 * @param callback
 * @see https://lbs.amap.com/api/webservice/guide/api/search/#around
 * @see  marker https://mp.weixin.qq.com/debug/wxadoc/dev/component/map.html#map
 * iconPath：未选中的图标的路径。项目目录下的图标路径，支持相对路径。
 * iconPathSelected：选中的图标的路径。项目目录下的图标路径，支持相对路径。
 * querykeywords：关键字。
 * querytypes：类型，参考：POI分类表。
 * location：经纬度坐标。为空时，基于当前位置进行地址解析。格式：'经度,纬度'
 */
function getPoiAround(params, callback) {
  var obj = new Object();
  obj.success = function(data) {
    callback(data);
  }
  obj.fail = function(info) {
    //失败回调
    console.log(info)
  }
  obj.iconPath = params.iconPath || "../images/marker.png";
  if (params.iconPathSelected) {
    obj.iconPathSelected = params.iconPathSelected;
  }
  if (params.querykeywords) {
    obj.querykeywords = params.querykeywords;
  }
  if (params.querytypes) {
    obj.querytypes = params.querytypes;
  }
  myAmapFun.getPoiAround(obj);
}

/**
 * 获取静态的地图图片
 * @param params
 * @param callback
 * location：地图中心点坐标，非必填。默认为当前位置。格式：'经度,纬度'
 * zoom：缩放级别，必填。地图缩放级别:[1,17]
 * size：地图大小，非必填。图片宽度*图片高度。最大值为1024*1024。
 * 2:调用高清图，图片高度和宽度都增加一倍，zoom也增加一倍（当zoom为最大值时，zoom不再改变）。
 * markers：Marker。使用规则见下方字段说明 markers，标注最大数50个。
 * labels：标签。使用规则见下方字段说明 labels，标签最大数10个。
 * paths：折线。使用规则见下方字段说明 paths，折线和多边形最大数4个。
 * traffic：交通路况标识。底图是否展现实时路况。 可选值： 0，不展现；1，展现。
 */
function getStaticmap(params, callback) {
  var obj = new Object();
  obj.success = function(data) {
    callback(data);
  }
  obj.fail = function(info) {
    //失败回调
    console.log(info)
  }
  if (params.location) {
    obj.location = params.location;
  }
  if (params.zoom) {
    obj.zoom = params.zoom;
  }
  if (params.size) {
    obj.size = params.size;
  }
  if (params.markers) {
    obj.markers = params.markers;
  }
  if (params.labels) {
    obj.labels = params.labels;
  }
  if (params.paths) {
    obj.paths = params.paths;
  }
  if (params.traffic) {
    obj.traffic = params.traffic;
  }
  myAmapFun.getStaticmap(obj);
}

/**
 *  获取地址描述信息
 * @param params
 * @param callback
 * @see https://lbs.amap.com/api/webservice/guide/api/georegeo/#regeo
 * iconPath：未选中的图标的路径。项目目录下的图标路径，支持相对路径。
 * width：图标宽度。默认为图标实际宽度。
 * height：图标高度。默认为图标实际高度。
 * location：经纬度坐标，非必填。为空时，基于当前位置进行地址解析。格式：'经度,纬度'
 */
function getRegeo(params, callback) {
  var obj = new Object();
  obj.success = function(data) {
    callback(data);
  }
  obj.fail = function(info) {
    //失败回调
    console.log(info)
  }
  obj.iconPath = params['iconPath'] != undefined ? params['iconPath'] : "../images/marker.png";
  obj.iconWidth = params.iconWidth != undefined ? params.iconWidth : 22;
  obj.iconHeight = params.iconHeigh != undefined ? params.iconHeigh : 32;
  if (params.location) {
    obj.location = params.location;
  }
  myAmapFun.getRegeo(obj);
}

/**
 *  获取地址描述信息 默认的解析
 *
 * @param data
 * @returns {{markers: *[], latitude: *, longitude: *, textData: {name: *, desc: *}}}
 */
function regeoDefaultResult(data) {
  var marker = [{
    id: data[0].id,
    latitude: data[0].latitude,
    longitude: data[0].longitude,
    iconPath: data[0].iconPath,
    width: data[0].width,
    height: data[0].height
  }]
  var result = {
    markers: marker,
    latitude: data[0].latitude,
    longitude: data[0].longitude,
    textData: {
      name: data[0].name,
      desc: data[0].desc
    }
  }
  return result;
}

/**
 *  获取驾车路线
 * @param params
 * @param callback
 * @see https://lbs.amap.com/api/webservice/guide/api/direction#driving
 * origin：出发地的经纬度坐标，格式：'经度,纬度'。
 * destination：目的地的经纬度坐标，格式：'经度,纬度'。
 * strategy：驾车策略。
 * waypoints：途经点。最大支持16个途径点。坐标格式：'经度,纬度'，坐标点之间用";"分隔。
 * avoidpolygons：避让区域。最大支持32个避让区域。坐标格式：'经度,纬度'，坐标点之间用";"分隔，区域之间用"|"分隔。
 * avoidroad：避让道路名称。仅支持一条避让道路。
 */
function getDrivingRoute(params, callback) {
  wx.showToast({
    icon: 'loading',
    title: '查询...'
  })
  var obj = new Object();
  obj.success = function(data) {
    console.log(data);
    wx.hideToast();
    callback(data);
  }
  obj.fail = function(info) {
    wx.hideToast();
    //失败回调
    console.log(info)
  }
  if (params.origin) {
    obj.origin = params.origin;
  }else{
    wx.showToast({
      title: '请输入起点',
    })
  }
  if (params.destination) {
    obj.destination = params.destination;
  }else{
    wx.showToast({
      title: '请输入终点',
    })
  }
  console.log(obj)
  myAmapFun.getDrivingRoute(obj);
}

/**
 * 获取驾车路线  默认的解析
 * @param data
 */
function drivingRoutDefaultResult(data, origin, destination) {
  var points = [];
  if (data.paths && data.paths[0] && data.paths[0].steps) {
    var steps = data.paths[0].steps;
    for (var i = 0; i < steps.length; i++) {
      var poLen = steps[i].polyline.split(';');
      for (var j = 0; j < poLen.length; j++) {
        points.push({
          longitude: parseFloat(poLen[j].split(',')[0]),
          latitude: parseFloat(poLen[j].split(',')[1])
        })
      }
    }
  }
  var trafficInfo = {};
  trafficInfo.polyline = [{
    points: points,
    color: "#0091ff",
    width: 6
  }]
  console.log(markers);
  trafficInfo.steps = steps;
  if (data.paths[0] && data.paths[0].distance) {
    trafficInfo.distance = data.paths[0].distance;
  }
  if (data.taxi_cost) {
    trafficInfo.taxi_cost = parseInt(data.taxi_cost);
  }

  if (origin && destination) {
    trafficInfo.origin = origin;
    trafficInfo.destination = destination;
    var originArr = origin.split(",");
    var destinationArr = destination.split(",");
    markers[0].latitude = originArr[1];
    markers[0].longitude = originArr[0];
    markers[1].latitude = destinationArr[1];
    markers[1].longitude = destinationArr[0];
    trafficInfo.markers = markers;
  }
  return trafficInfo;
}

/**
 * 获取骑行路线
 * @param params
 * @param callback
 * origin：出发地的经纬度坐标，格式：'经度,纬度'。
 * destination：目的地的经纬度坐标，格式：'经度,纬度'。
 */
function getRidingRout(params, callback) {
  wx.showToast({
    icon: 'loading',
    title: '查询...'
  })
  var obj = new Object();
  obj.success = function(data) {
    wx.hideToast();
    console.log(data);
    callback(data);
  }
  obj.fail = function(info) {
    wx.hideToast();
    //失败回调
    console.log(info)
  }
  if (params.origin) {
    obj.origin = params.origin;
  } else {
    wx.showToast({
      title: '请输入起点',
    })
  }
  if (params.destination) {
    obj.destination = params.destination;
  } else {
    wx.showToast({
      title: '请输入终点',
    })
  }
  console.log(obj)
  myAmapFun.getRidingRoute(obj);
}

/**
 * 获取骑行路线 默认的解析
 * @param data
 * @constructor
 */
function ridingRoutDefaultResult(data, origin, destination) {
  var points = [];
  if (data.paths && data.paths[0] && data.paths[0].steps) {
    var steps = data.paths[0].steps;
    for (var i = 0; i < steps.length; i++) {
      var poLen = steps[i].polyline.split(';');
      for (var j = 0; j < poLen.length; j++) {
        points.push({
          longitude: parseFloat(poLen[j].split(',')[0]),
          latitude: parseFloat(poLen[j].split(',')[1])
        })
      }
    }
  }
  var trafficInfo = {};
  trafficInfo.polyline = [{
    points: points,
    color: "#0091ff",
    width: 6
  }]
  trafficInfo.steps = steps;
  var distance = 0;
  if (data.paths[0] && data.paths[0].distance) {
    distance = data.paths[0].distance
  }
  var duration = 0;
  if (data.paths[0] && data.paths[0].duration) {
    duration = parseInt(data.paths[0].duration / 60);
  }
  trafficInfo.distance = distance;
  trafficInfo.duration = duration;
  if (origin && destination) {
    trafficInfo.origin = origin;
    trafficInfo.destination = destination;
    var originArr = origin.split(",");
    var destinationArr = destination.split(",");
    markers[0].latitude = originArr[1];
    markers[0].longitude = originArr[0];
    markers[1].latitude = destinationArr[1];
    markers[1].longitude = destinationArr[0];
    trafficInfo.markers = markers;
  }
  return trafficInfo;
}

/**
 * 获取步行路线
 * @param params
 * @param callback
 * @see https://lbs.amap.com/api/webservice/guide/api/direction#walk
 * origin：出发地的经纬度坐标，格式：'经度,纬度'。
 * destination：目的地的经纬度坐标，格式：'经度,纬度'。
 */
function getWalkingRoute(params, callback) {
  wx.showToast({
    icon: 'loading',
    title: '查询...'
  })
  var obj = new Object();
  obj.success = function(data) {
    wx.hideToast();
    console.log(data)
    callback(data);
  }
  obj.fail = function(info) {
    wx.hideToast();
    //失败回调
    console.log(info)
  }
  if (params.origin) {
    obj.origin = params.origin;
  } else {
    wx.showToast({
      title: '请输入起点',
    })
  }
  if (params.destination) {
    obj.destination = params.destination;
  } else {
    wx.showToast({
      title: '请输入终点',
    })
  }
  console.log(obj)
  myAmapFun.getWalkingRoute(obj);
}

/**
 *  获取步行路线 默认的解析
 * @param data
 */
function walkingRouteDefaultResult(data, origin, destination) {
  var points = [];
  var steps = [];
  if (data.paths && data.paths[0] && data.paths[0].steps) {
    steps = data.paths[0].steps;
    for (var i = 0; i < steps.length; i++) {
      var poLen = steps[i].polyline.split(';');
      for (var j = 0; j < poLen.length; j++) {
        points.push({
          longitude: parseFloat(poLen[j].split(',')[0]),
          latitude: parseFloat(poLen[j].split(',')[1])
        })
      }
    }
  }
  var distance = 0;
  if (data.paths[0] && data.paths[0].distance) {
    distance = data.paths[0].distance
  }
  var duration = 0;
  if (data.paths[0] && data.paths[0].duration) {
    duration = parseInt(data.paths[0].duration / 60);
  }
  var polyline = [{
    points: points,
    color: "#0091ff",
    width: 6
  }]
  var trafficInfo = {
    steps: steps,
    polyline: polyline,
    distance: distance,
    duration: duration
  }
  if (origin && destination) {
    trafficInfo.origin = origin;
    trafficInfo.destination = destination;
    var originArr = origin.split(",");
    var destinationArr = destination.split(",");
    markers[0].latitude = originArr[1];
    markers[0].longitude = originArr[0];
    markers[1].latitude = destinationArr[1];
    markers[1].longitude = destinationArr[0];
    trafficInfo.markers = markers;
  }
  return trafficInfo;
}

/** 
 *  获取公交路线
 * @param params
 * @param callback
 * @see https://lbs.amap.com/api/webservice/guide/api/direction#bus
 * origin：出发地的经纬度坐标，格式：'经度,纬度'。 必填
 * destination：目的地的经纬度坐标，格式：'经度,纬度'。 必填
 * strategy：公交换乘策略。 0：最快捷模式 1：最经济模式 2：最少换乘模式 3：最少步行模式 5：不乘地铁模
 * city：出发点的城市名称。必填
 * cityd：目的地的城市名称。跨城必填
 */
function getTransitRoute(params, callback) {
  wx.showToast({
    icon: 'loading',
    title: '查询...'
  })
  var obj = new Object();
  var flag = params != undefined && params != null;
  if (flag && params.city) {
    obj.city = params.city;
  }
  if (flag && params.origin) {
    obj.origin = params.origin;
  } else {
    wx.showToast({
      title: '请输入起点',
    })
  }
  if (flag && params.destination) {
    obj.destination = params.destination;
  } else {
    wx.showToast({
      title: '请输入终点',
    })
  }
  if (flag && params.strategy) {
    obj.strategy = params.strategy;
  }
  if (flag && params.cityd) {
    obj.cityd = params.cityd;
  }
  obj.success = function success(data) {
    wx.hideToast();
    console.log(data);
    callback(data);
  };
  obj.fail = function fail(info) {
    wx.hideToast();
    //失败回调
    console.log(info)
  };
  console.log(obj)
  myAmapFun.getTransitRoute(obj);
}



/**
 *  获取公交路线 默认的解析
 *
 * @param data
 * @returns {*}
 */
function transitRouteDefaultResult(data, origin, destination) {
  if (data && data.transits) {
    var transits = data.transits;
    for (var i = 0; i < transits.length; i++) {
      var segments = transits[i].segments;
      transits[i].transport = [];
      for (var j = 0; j < segments.length; j++) {
        if (segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name) {
          var name = segments[j].bus.buslines[0].name
          if (j !== 0) {
            name = '--' + name;
          }
          transits[i].transport.push(name);
        }
      }
    }
    var trafficInfo = {
      transits: transits,
      distance: data.distance,
      taxi_cost: parseInt(data.taxi_cost)
    }
    trafficInfo.polyline = [];
    if (origin && destination) {
      trafficInfo.origin = origin;
      trafficInfo.destination = destination;
      var originArr = origin.split(",");
      var destinationArr = destination.split(",");
      markers[0].latitude = originArr[1];
      markers[0].longitude = originArr[0];
      markers[1].latitude = destinationArr[1];
      markers[1].longitude = destinationArr[0];
      trafficInfo.markers = markers;
    }
    return trafficInfo;
  } else {
    return null;
  }

}

/**
 *  获取提示词
 * @param params
 * @param callback
 * @see https://lbs.amap.com/api/webservice/guide/api/inputtips
 * keywords：查询关键词。
 * type：POI分类。
 * city：搜索城市。
 * citylimit：仅返回指定城市数据。
 * location：经纬度坐标。设置该参数会在此 location 附近优先返回关键词信息。
 */
function getInputtips(params, callback) {
  var obj = new Object();
  obj.keywords = params.keywords || "";
  if (params.city) {
    obj.city = params.city;
  }
  if (params.type) {
    obj.type = params.type;
  }
  if (params.citylimit) {
    obj.citylimit = params.citylimit;
  }
  if (params.location) {
    obj.location = params.location;
  }
  obj.success = function(data) {
    callback(data);
  }
  obj.fail = function(info) {
    //失败回调
    console.log(info)
  }
  console.log(obj)
  myAmapFun.getInputtips(obj);
}

/**
 *  查询天气
 * @param params
 * @param callback
 * type：天气的类型。默认是live（实时天气），可设置成forecast（预报天气）。
 * city：城市对应的adcode，非必填。为空时，基于当前位置所在区域。
 */
function getWeather(params, callback) {
  var wType = params != null && params.type ? params.type : 'live';
  var obj = new Object();
  obj.type = wType;
  if (params != null && params.city) {
    obj.city = params.city;
  }
  obj.success = function(data) {
    callback(data);
  }
  obj.fail = function(info) {
    //失败回调
    console.log(info)
  }
  console.log(obj)
  myAmapFun.getWeather(obj);
}

module.exports = {
  getPoiAround,
  getStaticmap,
  getRegeo,
  regeoDefaultResult,
  getDrivingRoute,
  drivingRoutDefaultResult,
  getRidingRout,
  ridingRoutDefaultResult,
  getWalkingRoute,
  walkingRouteDefaultResult,
  getTransitRoute,
  transitRouteDefaultResult,
  getInputtips,
  getWeather
}