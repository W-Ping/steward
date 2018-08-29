var qcloud = require('../vendor/wafer2-client-sdk/index');
module.exports={
   getUserInfoCache:function(){
     return qcloud.Session.get()||{};
   },
  setUserInfoCache: function (data) {
     qcloud.Session.set(data);
  },
   clearUserInfoCach:function(){
     qcloud.Session.clear();
   }
}