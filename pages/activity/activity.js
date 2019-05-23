// pages/activity/activity.js
var userId;
const {$Message}=require('../../dist/base/index.js');
const request=require('../../utils/request.js')
var isPull=false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
      current: 'tab1',
      searchValue: "",
      activities: [],
    competitionList: [],
      page: 0,
      pagesize: 5,
      count: 0,
      maxid: 0,
      loadMore: false,
      loveactivity:'loveactivity',
      competePage:0,
      competeCount:0,
      competeMaxid:0
  },
  
  handleChange({ detail }) {
    var that=this;
    this.setData({
      current: detail.key
    });
    console.log(detail.key)
    if(detail.key=='tab2'){
      var urlC = getApp().globalData.requestUrl + '/compete/selectCompete';
      var paramsC = {
        page: 0,
        pagesize: 5,
        count: 0
      }
      request.requestGetApi(urlC, paramsC, that, that.successLoadCompete, that.failFirstLoad)
    }
  },
  publishActivity: function () {
    wx.navigateTo({
      url: '../secondMenu/publishactivity/publishactvity',
    })
  },
  //获得搜索输入框的值
  searchInput: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  //搜索按钮
  queryValue: function () {
    var that = this;
    var url = getApp().globalData.requestUrl + '/activity/searchActivity';
    var params = {
     data:'%'+that.data.searchValue+'%'
    }
    request.requestGetApi(url, params, that, that.successSearch, that.failSearch); 
  },
  successSearch:function(res,self){
    var that=this;
    var activity_list=[];
    if(res.data.activity.length>0){
      for (let i = 0; i < res.data.activity.length; i++) {
        res.data.activity[i].activityText = res.data.activity[i].activityText.substring(0, 60) + "…";
        activity_list.push(res.data.activity[i])
      }
      that.setData({
        activities: activity_list,
        loadMore: false
      })
    } else {
      that.setData({
        loadMore: false,
        loveactivity: '无此类活动'
      })
    } 
  },
  
  //评论/点赞点击
  reviewActivity: function (e) {
    var itemid = e.currentTarget.dataset.id;
    var sum = e.currentTarget.dataset.sum;
    wx.navigateTo({
      url: '../secondMenu/chart/chart?type=1&id='+itemid+'&sum='+sum
    })
  },
  reviewCompete:function(e){
    var itemid = e.currentTarget.dataset.id;
    var sum = e.currentTarget.dataset.sum;
    wx.navigateTo({
      url: '../secondMenu/chart/chart?type=3&id=' + itemid + '&sum=' + sum
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
    try {
      userId = wx.getStorageSync('openid')
    } catch (e) {
      console.log(e)
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      loadMore:true
    })
    var url = getApp().globalData.requestUrl + '/activity/selectActivity';
    var params = {
      page: 0,//第几页
      pagesize: 5,
      userId: userId,//该账户的id，用于去查询每条数据是否点赞
      catagroy: 0,
      count: 0
    }
    request.requestPostApi(url, params, that, that.successFistLoad, that.failFirstLoad); 
  },
  successFistLoad: function (res, selfObj) {
    var that = this;
    var activity_list = [];
    console.log(res.data)
    if (res.data.total[0].sum > 0) {
    for (let i = 0; i < res.data.activities.length; i++) {
      res.data.activities[i].activityText = res.data.activities[i].activityText.substring(0, 60)+"…";
      activity_list.push(res.data.activities[i])
    }
    console.log(res.data.total[0].sum)
    that.setData({
      count: res.data.total[0].sum,
      page: 1,
      maxid: res.data.activities[0].activityid,
      activities: activity_list,
      loadMore:false
    })
    }else{
      that.setData({
        loadMore:false,
        loveactivity:'暂无活动'
      })
    }
    if(isPull==true){
        $Message({
          content: '刷新成功。',
          duration: 2
        });
      wx.hideNavigationBarLoading();
      isPull=false;
    }
  },
  successLoadCompete:function(res,self){
    var that = this;
    var compete_list = [];
    console.log(res.data)
    if (res.data.total[0].sum>0){
    for (let i = 0; i < res.data.competeList.length; i++) {
      res.data.competeList[i].competeContent = res.data.competeList[i].competeContent.substring(0, 60)+"…";
      compete_list.push(res.data.competeList[i])

    }
    console.log(res.data.total[0].sum)
    that.setData({
      competeCount: res.data.total[0].sum,
      competePage: 1,
      competeMaxid:res.data.competeList[0].competeId,
      competitionList: compete_list,
      loadMore: false
    })
    }else{
      that.setData({
        loadMore: false,
        loveactivity: '暂无竞赛'
      })
    }
    if (isPull == true) {
      $Message({
        content: '刷新成功。',
        duration: 2
      });
      wx.hideNavigationBarLoading();
      isPull = false;
    }
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
    var that = this;
    that.setData({
      loadMore: true
    })
    isPull=true;
    wx.showNavigationBarLoading();
    if(that.data.current=='tab1'){
    var url = getApp().globalData.requestUrl + '/activity/selectActivity';
    var params = {
      page: 0,//第几页
      pagesize: 5,
      catagroy: 0,
      count: 0
    }
    request.requestPostApi(url, params, that, that.successFirstLoad, that.failFirstLoad);
    }else{
      var urlC = getApp().globalData.requestUrl + '/compete/selectCompete';
      var paramsC = {
        page: 0,
        pagesize: 5,
        count:0
      }
      request.requestGetApi(urlC, paramsC, that, that.successLoadCompete, that.failFirstLoad)
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      var that = this;
    that.setData({
      loadMore: true
    })
      if(that.data.current=='tab1'){
      var page = that.data.page;
      var pagesize = that.data.pagesize;
      var length = that.data.count;
      var count = that.data.maxid;
      console.log(page)
      if (page * pagesize < length) {
        var url = getApp().globalData.requestUrl + '/activity/selectActivity';
        var params = {
          page: page,//第几页
          pagesize: pagesize,
          catagroy: 0,
          count: count
        }
        request.requestPostApi(url, params, this, this.successLoadMore, this.failLoadMore);
      } else {
        setTimeout(function () {
          that.setData({
            loadMore:false,
          });
          $Message({
            content: '所有数据加载完毕。',
            duration: 2
          });
        }, 200);
      }
      }else{
        if (that.data.competePage * that.data.pagesize < that.data.competeCount) {
        var urlC = getApp().globalData.requestUrl + '/compete/selectCompete';
        var paramsC = {
          page: that.data.competePage,
          pagesize: that.data.pagesize,
          count: that.data.competeMaxid
        }
        request.requestGetApi(urlC, paramsC, that, that.successLoadMoreCompete, that.failLoadMore)
        }
      }
    },
    successLoadMore: function(res, selfObj) {
      var that = this;
      var activity_list = that.data.activities;
      console.log(res.data)
      for (let i = 0; i < res.data.activities.length; i++) {
        res.data.activities[i].activityText = res.data.activities[i].activityText.substring(0, 60)+"…";
        activity_list.push(res.data.activities[i])
      }
      that.setData({
        page: that.data.page + 1,
        activities: activity_list,
        loadMore:false
      })
    },
    successLoadMoreCompete:function(res,self){
      var that = this;
      var compete_list = that.data.competitionList;
      console.log(res.data)
      for (let i = 0; i < res.data.competeList.length; i++) {
        res.data.competeList[i].competeContent = res.data.competeList[i].competeContent.substring(0, 60)+"…";
        compete_list.push(res.data.competeList[i])

      }
      that.setData({
        competePage: that.data.competePage+1,
        competitionList: compete_list,
        loadMore: false
      })
    },
    failLoadMore: function(res, selfObj) {
      console.log('失败加载')
      that.setData({
        loadMore: false
      })
    },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})