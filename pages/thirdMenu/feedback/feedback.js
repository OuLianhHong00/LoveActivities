// pages/thirdMenu/feedback/feedback.js
const request=require('../../../utils/request.js');
var userId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
        feedbackWord:''
  },

switchChange:function(e){
  console.log(e.detail.value)
  if(e.detail.value==true){
    userId='1'
  }else{
    userId=wx.getStorageSync('openid')
  }
},
  changeInput:function(e){
    this.setData({
      feedbackWord:e.detail.value
    })
  },
  getUp:function(){
    var that=this;
    var url = getApp().globalData.requestUrl + '/users/saveFeedBack';
    var params = {
    userId:userId,
    content:that.data.feedbackWord
    }
    request.requestPostApi(url, params, that, that.successGet, that.failGet); 
  },
  successGet:function(res,self){
    if(res.data='success'){
      wx.showToast({
        title: '反馈成功',
      })
      wx.switchTab({
        url: '../../../pages/index/index',
      })
    }else{
      wx.showToast({
        title: '反馈失败',
      })
    }
  },
  failGet:function(res,self){
    wx.showToast({
      title: '反馈失败',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})