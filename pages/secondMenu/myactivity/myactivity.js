// pages/secondMenu/myactivity/myactivity.js
var userId;
const { $Message } = require('../../../dist/base/index.js');
const request = require('../../../utils/request.js')
var inde='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      activities: [],
      page: 0,
      pagesize: 5,
      count: 0,
      loadMore: true
  },


  //评论/点赞点击
  reviewActivity: function (e) {
    var itemid = e.currentTarget.dataset.id;
    var sum = e.currentTarget.dataset.sum;
    wx.navigateTo({
      url: '../chart/chart?type=1&id=' + itemid + '&sum=' + sum
    })
  },
  //删除文章
  deleteActivity:function(e){
    var that=this;
    var itemid = e.currentTarget.dataset.id;
    var title=e.currentTarget.dataset.title;
    inde=e.currentTarget.dataset.i;
    wx.showModal({
      title: '删除文章',
      content: '你确定删除：'+title +"吗",
      success(res){
        if(res.confirm){
          var url = getApp().globalData.requestUrl + '/common/delete';
          var params = {
           id:itemid,
           type:1
          }
          request.requestGetApi(url, params, that, that.successDelete, that.failDelete);
        }
      }
    })
  },
  successDelete:function(res,self){
    var that=this;
    var activity=that.data.activities;
    activity.splice(inde,1);
    that.setData({
      activities:activity
    })
  },
  failDelete:function(res,self){
    wx.showToast({
      title: '删除活动失败',
    })
  },
  //编辑文章
  editorActivity:function(e){
    var itemid = e.currentTarget.dataset.id;
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
    var that = this;
    try {
      userId = wx.getStorageSync('openid')
    } catch (e) {
      console.log(e)
    }
    var url = getApp().globalData.requestUrl + '/activity/selectActivity';
    var params = {
      page: 0,//第几页
      pagesize: 5,
      userId: userId,//该账户的id，用于去查询每条数据是否点赞
      catagroy: 1,
    }
    request.requestPostApi(url, params, this, this.successFistLoad, this.failFirstLoad);
  },
  successFistLoad: function (res, selfObj) {
    var that = this;
    var activity_list = [];
    console.log(res.data)
    for (let i = 0; i < res.data.activities.length; i++) {
      res.data.activities[i].year=res.data.activities[i].time.substring(0,10);
      res.data.activities[i].hour = res.data.activities[i].time.substring(11, 16);
      res.data.activities[i].activityText=res.data.activities[i].activityText.substring(0,20)+'...';
      activity_list.push(res.data.activities[i])
    }
    console.log(res.data.total[0].sum)
    that.setData({
      count: res.data.total[0].sum,
      page: 1,
      activities: activity_list
    }) 
  },
  failFirstLoad: function (res, selfObj) {
    console.log('失败加载')
    wx.showToast({
      title: '请检查网络配置',
    })
    this.setData({
      loadMore: false
    })
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
    var that = this;
    var page = that.data.page;
    var pagesize = that.data.pagesize;
    var length = that.data.count;
    console.log(page)
    if (page * pagesize < length) {
      var url = getApp().globalData.requestUrl + '/activity/selectActivity';
      var params = {
        page: page,//第几页
        pagesize: pagesize,
        catagroy: 1,
        userId: userId   //该账户的id，用于去查询每条数据是否点赞
      }
      request.requestPostApi(url, params, this, this.successLoadMore, this.failLoadMore);
    } else {
      setTimeout(function () {
        that.setData({
          loadMore: false,
        });
        $Message({
          content: '所有数据加载完毕。',
          duration: 2
        });
      }, 200);
    }
  },
  successLoadMore: function (res, selfObj) {
    var that = this;
    var activity_list = that.data.activities;
    console.log(res.data)
    for (let i = 0; i < res.data.activities.length; i++) {
      res.data.activities[i].year = res.data.activities[i].time.substring(0, 10);
      res.data.activities[i].hour = res.data.activities[i].time.substring(11, 16);
      res.data.activities[i].activityText = res.data.activities[i].activityText.substring(0, 20);
      activity_list.push(res.data.activities[i])
    }
    that.setData({
      page: that.data.page + 1,
      activities: activity_list
    })
  },
  failLoadMore: function (res, selfObj) {
    console.log('失败加载')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})