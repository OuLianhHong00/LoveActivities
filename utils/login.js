function myLogin(e,callback){
  wx.login({
    success:res=>{
      var code = res.code;
      wx.request({
        url: getApp().globalData.requestUrl + '/users/Login',
        data: {
          code: code,
          userInfo: e.detail.userInfo
        },
        method: 'POST',
        success:function(res){
          callback(res,e) 
        },
        fail: res=>{
          console.log('未成功登录');
          getApp().globalData.userInfo = null;
        }
      })
    },
    fail: res => {
      console.log('获取code失败')
    }
  })
}

function isLogin(){
  var is=true;
   if(getApp().globalData.userInfo==null&&getApp().globalData.userId==null){
     wx.showToast({
       title: '您未登录',
     })
     is=false;
   }
   return is;
}
module.exports.myLogin=myLogin;
module.exports.isLogin = isLogin;
