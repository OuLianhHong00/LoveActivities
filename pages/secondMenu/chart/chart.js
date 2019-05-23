// pages/chart/chart.js
const request = require('../../../utils/request.js')
const login=require('../../../utils/login.js')
var id;//编号
var type;//那个种类1:活动，3:竞赛
var userId='';
var userName='';
var isclick=true;
Page({
   data:{
     activityTitle: "",
     activityText: "",
     activityImage:[],
     time: '',
     sumlike: 0,
     commitList:[],
     inputReview: '',
     show:false,
     hasUserInfo: false,
     canIUse: wx.canIUse('button.open-type.getUserInfo'),
     likeThis:false
   },
   //获取用户信息
  getUserInfo: function (e) {
    var that = this;
    var data = login.myLogin(e, this.callback);
  },
  callback: function (res, e) {
    try {
      wx.setStorageSync('openid', res.data.id);
      getApp().globalData.userInfo = e.detail.userInfo;
      getApp().globalData.userId=res.data.id;
      if (getApp().globalData.userInfo) {
        this.setData({
          hasUserInfo: true
        })
      }
    }
    catch (e) {
      console.log(e)
    }
  },
  //点赞互动
  showLike:function(){
    if(userId!=''&&userName!=''){
      if(isclick){
        isclick=false;
        var urll = getApp().globalData.requestUrl + '/common/linkLike';
        var paramsl = {
          type: type,
          productId: id,
          userId: userId
        }
        request.requestPostApi(urll, paramsl, this, this.successLinkLike, this.failLinkLike);
        setTimeout(function () {
             isclick=true
        }, 5000)
      }
    }
  },
  successLinkLike:function(res,self){
    var that=this;
    if(that.data.likeThis==false){
      that.setData({
        likeThis:true,
        sumlike:that.data.sumlike+1
      })
    }else{
      that.setData({
        likeThis:false,
        sumlike:that.data.sumlike-1
      })
    }
  },
  failLinkLike:function(res,self){
    wx.showToast({
      title: '点赞失败',
    })
    console.log(res)
  },
   //获得评论输入框的值
  reviewValue: function (e) {
    this.setData({
      inputReview: e.detail.value
    })
  },
  //添加评论按钮
  sendReview:function(){
    var that=this;
    wx.request({
      url: getApp().globalData.requestUrl + '/common/addComment',
      data:{
        userId:userId,
        commentText:that.data.inputReview,
        productId:id,
        type:type
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //往评论中加内容
       var comment=that.data.commitList;
       comment.push({
         userName: userName.nickName,
         commentText:that.data.inputReview
       })
        that.setData({
          commitList:comment,
          show:false,
          inputReview:''
        })
      },
      fail:function(){
        wx.showToast({
          title: '添加评论失败',
        })
      },
    })
  },
  onLoad: function (a) {
    var that = this;
     id=a.id;
     type=a.type;
     if(a.sum=='null'){
     that.setData({
        sumlike:0
      })
     }else{
       that.setData({
         sumlike: a.sum
       })
     }
    
    try {
      userId = wx.getStorageSync('openid');
      userName = getApp().globalData.userInfo;
      if (userId != '' && userName != '') {
        that.setData({
          hasUserInfo:true
        })
      }
    } catch (e) {
      console.log(e)
    }
   
    wx.setNavigationBarTitle({
      title: '文章详情页'
    });
   
    //查询当前文章的详细信息
    var url ;
    if(type==1){
     url = getApp().globalData.requestUrl + '/activity/selectOneActivity';
    }else{
      url = getApp().globalData.requestUrl + '/compete/selectOneCompete';
    }
    var params = {
     productId:id
    }
    request.requestGetApi(url, params, this, this.successSelectA, this.failSelectA);
    // 查询评论fetch
    var urlc = getApp().globalData.requestUrl + '/common/selectComment';
    var paramsc={
      id:id,
      type:type
    }
    request.requestGetApi(urlc, paramsc, this, this.successSelectC, this.failSelectC);
    //查询当前用户是否点赞
    if(userId!=''){
      var urll = getApp().globalData.requestUrl + '/common/isLike';
      var paramsl={
        type:type,
        productId:id,
        userId:userId
      }
      request.requestPostApi(urll,paramsl,this,this.successIsLike,this.failIsLike);
    }
  },
  successSelectA:function(res,self){
    var that=this;
    console.log(res.data)
    if(type==1){
    var img=res.data.activity[0].activityImage.split("&&");
    that.setData({
      activityTitle:res.data.activity[0].activityTitle,
      activityImage: img,
      time:res.data.activity[0].time,
      activityText: res.data.activity[0].activityText
    })
    }
    else{
      that.setData({
        activityTitle:res.data.compete[0].competeTitle,
        activityText:res.data.compete[0].competeContent,
        activityImage: res.data.compete[0].competeImage.split("&&"),
        time:res.data.compete[0].time
      })
    }
  },
  failSelectA:function(res,self){
     wx.showToast({
       title: '加载文章失败',
     })
     console.log(res)
  },
  successSelectC:function(res,self){
    console.log(res.data);
    var that=this;
    if(res.data.commentList.length>0){
      that.setData({
        commitList: res.data.commentList
      })
    }else{
      that.setData({
        show:true
      })
    }
  },
  failSelectC:function(res,self){
    wx.showToast({
      title: '加载文章评论失败',
    })
    console.log(res)
  },
  successIsLike:function(res,self){
    var that=this;
    if(res.data.length==1){
      if (res.data.status == 1) {
        that.setData({
          likeThis: true
        })
      }
    }
  }, 
  failIsLike:function(res,self){
     console.log('获取点赞信息失败')
  }
})

