//index.js
//获取应用实例
const app = getApp();
const login=require('../../utils/login.js');
const request=require('../../utils/request.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sinature:"",
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
      that.setData({
        arrsign: e.detail.value
      });
  },
  //确认修改的函数
  handleOK:function(e){
    var that=this;
    this.setData({
      visible: false
    });
    var url = getApp().globalData.requestUrl + '/users/saveUserSinature';
    var params = {
      usersinature: that.data.arrsign,
      userId: getApp().globalData.userId
    }
    request.requestPostApi(url, params, this, this.successS, this.failS);
    console.log(that.data.arrsign)
    console.log(e);
  },
  successS: function (res, self) {
    console.log(res.data)
    var that=this;
    this.setData({
      sinature: that.data.arrsign
    })
  },
  failS:function(res,self){
    wx.showToast({
      title: '修改个性标签失败',
    })
  },
  //取消修改
  handleClose:function(){
     this.setData({
       visible: false
     });
   },

  onLoad: function () {
    var that=this;
    wx.setNavigationBarTitle({
      title: '个人主页面',
      navigationBarBackgroundColor:'darkslateblue',
      color:'white'
    });
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      var url = getApp().globalData.requestUrl + '/users/selectUserSinature';
      var params = {
        userId: getApp().globalData.userId
      }
      request.requestPostApi(url, params, this, this.successF, this.failF);
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
    
  },
  getUserInfo: function(e) {
    var that=this;
    var data=login.myLogin(e,this.callback);
  },
  callback:function(res,e){
    try {
      wx.setStorageSync('openid', res.data.id);
      getApp().globalData.userInfo = e.detail.userInfo;
      getApp().globalData.userId=res.data.id;
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
        var url = getApp().globalData.requestUrl + '/users/selectUserSinature';
        var params = {
          userId: getApp().globalData.userId
        }
        request.requestPostApi(url, params, this, this.successF, this.failF);
      }
    }
    catch (e) {
      console.log(e)
    } 
  },
  successF:function(res,self){
    var that=this;
    console.log(res.data)
  if(res.data[0].userSinature==null){
     that.setData({
       sinature:'在此写下你的个性标签吧！'
     })
  }else{
    that.setData({
      sinature:res.data[0].userSinature
    })
  }
  },
  failF:function(res,self){
    console.log(res)
  }

})
