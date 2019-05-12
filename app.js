//app.js
  App({
    onLaunch: function() {
      var that=this;

        // 获取用户信息
        wx.getSetting({
         success: res => {
           console.log(res)
          if(res.authSetting['scope.userInfo']){
            //登录
            wx.login({
              success: res => {
                var code = res.code;
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      this.globalData.userInfo = res.userInfo;
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res)
                      }
                      wx.request({
                        url: that.globalData.requestUrl + '/users/Login',
                        data: {
                          code: code,
                          userInfo: res.userInfo
                        },
                        method: 'POST',
                        success: function (res) {
                          wx.setStorage({
                            key: 'openid',
                            data: res.data.id,
                            fail: function () {
                              console.log("fail to write openid in storage")
                            },
                            complete: function () {
                              console.log('openid complete')
                            }
                          })
                          that.globalData.userId=res.data.id;
                        },
                        fail: function (res) {
                          console.log('未成功登录');
                          that.globalData.userInfo = null;
                          that.globalData.userId=null;
                        }
                      })
                    }
                  })//getUserInfo
              },
            }) //login
         }
        }
      })
    
  },
  globalData: { //全局变量
    userInfo: null,
    userId:null,
    requestUrl: "http://39.105.117.213:3000",
  },

}) 