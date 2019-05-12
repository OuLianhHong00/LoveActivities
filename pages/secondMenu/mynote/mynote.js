// pages/mynote/mynote.js
var util=require('../../../utils/util.js');
var request=require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
        time:'',
        isvert:false,
        note:''
  },
  bindValue:function(e){
    this.setData({
      isvert:true,
      note: e.detail.value,
    })
  },
  saveMynote:function(){
    var that=this;
    var url = getApp().globalData.requestUrl + '/users/saveUserBook';
    var params = {
      userId: getApp().globalData.userId,
      userContent:that.data.note
    }
    request.requestPostApi(url, params, this, this.successSave, this.failSave);
  },
  successSave: function (res, self) {
    wx.showToast({
      title: '保存成功',
    })
  },
  failSave: function (res, self) {
    wx.showToast({
      title: '保存失败',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    this.setData({
      time: time
    })
      var url = getApp().globalData.requestUrl + '/users/selectUserBook';
      var params={
        userId:getApp().globalData.userId
      }
    request.requestPostApi(url, params, this, this.successFistLoad, this.failFirstLoad);
  },
  successFistLoad:function(res,self){
    var that=this;
    if(res.data[0].userBook==null){
      that.setData({
        note:''
      })
    }else{
    this.setData({
      note:res.data[0].userBook
    })
    }
  },
  failFirstLoad:function(res,self){
    wx.showToast({
      title: '加载失败',
    })
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