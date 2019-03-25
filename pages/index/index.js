//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sinature:"如果说，你是海上的烟火，我是浪花的泡沫，那么我，是想牵你的手。",
    visible:false,
    arrsign:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //点击修改个性签名的函数
  fixsign:function(){
    this.setData({
      visible:true
    });
  },
 
  changeInput:function(e){
    var that=this;
    setTimeout(function () {
      that.setData({
        arrsign: e.detail.value
      });
    }, 2000);
    console.log(arrsign);
  },
  //确认修改的函数
  handleOK:function(e){
    this.setData({
      visible: false
    });
    console.log(e);
  },
  //取消修改
  handleClose:function(){
     this.setData({
       visible: false
     });
   },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
