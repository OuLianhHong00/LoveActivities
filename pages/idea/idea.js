const request = require('../../utils/request.js')
const isLogin=require('../../utils/login.js')
const { $Message } = require('../../dist/base/index.js');
var isclick = true;
var inputReview='';
var userPull=false;
var inde='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    pagesize:5,
    count:0,
    maxid:0,
    loadMore:true,
    shareDetail: [ ]
  },

  //展示编辑按钮
  chooseEdit: function (e) {
    var that = this;
    var show = e.currentTarget.dataset.show;
    var index = e.currentTarget.dataset.dex;
    var message = this.data.shareDetail;
    var state;
    if (show == true) {
      show = false;
      this.setData({
        backgroundColor: 'White'
      })
    } else {
      show = true;
      this.setData({
        backgroundColor: 'WhiteSmoke'
      })
    }
    for (let i in message) {
      if (i == index) {
        message[i].showModels = show;
      }
    }
    that.setData({
      shareDetail: message
    })
  },
  //评论按钮
  reviewClick: function (e) {
    var that = this;
    var show = e.currentTarget.dataset.show;
    var index = e.currentTarget.dataset.dex;
    var message = this.data.shareDetail;
    if (show == true) {
      show = false;
    } else {
      show = true;
    }
    for (let i in message) {
      if (i == index) {
        message[i].visible = show;
      }
    }
    that.setData({
      shareDetail: message
    })
  },
  //删除自己的想法
  trashPillow: function (e) {
    var itemid = e.currentTarget.dataset.id;
    inde=e.currentTarget.dataset.inde;
    var that = this;
    wx.showModal({
      content: '却认删除这条想法吗?',
      success(res) {
        if (res.confirm) {
          var url = getApp().globalData.requestUrl + '/common/delete';
          var params = {
            id: itemid,
            type: 2
          }
          request.requestGetApi(url, params, that, that.successDelete, that.failDelete);
        }
      }
    })
  },
  successDelete: function (res, self) {
    var that = this;
    var message = that.data.shareDetail;
    message.splice(inde, 1);
    that.setData({
     shareDetail:message
    })
  },
  failDelete: function (res, self) {
    wx.showToast({
      title: '删除想法失败',
    })
  },
  //获得评论内容
  reviewValue: function (e) {
      inputReview=e.detail.value; 
      console.log('121111' + inputReview);
  },
  //发送评论
  sendReview: function (e) {
    var that=this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.dex;
    console.log('sendrwview' + id);
    console.log('sendrwview' + inputReview);
    var that = this;
    wx.request({
      url: getApp().globalData.requestUrl + '/common/addComment',
      data: {
        userId: getApp().globalData.userId,
        commentText: inputReview,
        productId: id,
        type: 2
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var message = that.data.shareDetail;
        //往评论中加内容
        for (var i in message) {
          if (i == index) {
            message[i].commentList.push({
              userName: getApp().globalData.userInfo.nickName,
              commentText:inputReview
            });
            message[i].visible=false;
          }
        }
        inputReview='';
        that.setData({
        shareDetail:message
        })
      },
      fail: function () {
        wx.showToast({
          title: '添加评论失败',
        })
      },
    })
  },
  //点赞
  likeClick: function (e) {
    var that = this;
    var is=isLogin.isLogin();
    console.log('is'+is);
    if(is==true){
    var comment_id = e.currentTarget.dataset.id;//当前项的id
    var islike = e.currentTarget.dataset.islike;
    var index1 = e.currentTarget.dataset.dex;
    var message = that.data.shareDetail;
    console.log('dianzahazhangt' + islike);
      console.log('编号' + index1);
    if (islike == 0) {
      islike = 1;
    } else {
      islike = 0;
    }
    for (let i in message) {
      if (i == index1) {
        message[i].status = islike;
        console.log('status'+message[i].status)
        if (islike == 0) {
          message[i].sum -= 1
        } else {
          message[i].sum += 1
        }
      }
    }
    that.setData({
      shareDetail: message
    })
//将修改结果传入后端保存
      if (isclick) {
        isclick = false;
        var urll = getApp().globalData.requestUrl + '/common/linkLike';
        var paramsl = {
          type: 2,
          productId: comment_id ,
          userId: getApp().globalData.userId
        }
        request.requestPostApi(urll, paramsl, that, that.successLinkLike, that.failLinkLike);
        setTimeout(function () {
          isclick = true
        }, 5000)
          }
    }
  },
  successLinkLike:function(res,self){
    console.log('点赞成功')

  },
  failLinkLike:function(res,self){
    console.log('点赞失败')
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
    let url = getApp().globalData.requestUrl + '/pillow/selectPillow';
    let params={
      page:0,
      pagesize:5,
      count:0,
      userId:getApp().globalData.userId,
      catagroy:0
    }
    request.requestPostApi(url, params, this, this.successFistLoad, this.failFirstLoad);
  },
  successFistLoad:function(res,self){
    var that=this;
    var ideaList=[];
    for (let i=0; i < res.data.idea.length; i++) {
      if(res.data.idea[i].sum==null){
        res.data.idea[i].sum=0;
      }
       if(res.data.idea[i].count==null){
        res.data.idea[i].count=0;
      }
      if(res.data.idea[i].status==null){
        res.data.idea[i].status=0;
      }
      if(res.data.idea[i].userId==getApp().globalData.userId){
        res.data.idea[i].sortIndex=1;
      }else{
        res.data.idea[i].sortIndex=0;
      }
      if (res.data.idea[i].ideaImage!=""){
      res.data.idea[i].ideaImage = res.data.idea[i].ideaImage.split('&&');
      }
      res.data.idea[i].index=i;
      res.data.idea[i].visible=false;
      res.data.idea[i].showModels= false;//是否展示下拉符号
      res.data.idea[i].inputReview = '';

      var urlp = getApp().globalData.requestUrl+'/common/selectComment';
      var paramsp={
        id:res.data.idea[i].ideaid,
        type:2
      }
      wx.request({
        url: urlp,
        data: paramsp,
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function(result) {
        res.data.idea[i].commentList=result.data.commentList
        ideaList.push(res.data.idea[i])
        if(ideaList.length==res.data.idea.length)
        {
          that.setData({
               shareDetail:ideaList,
               count:res.data.total[0].sum,
               maxid:res.data.idea[0].ideaid,
               page:1,
               loadMore:false
          })
          console.log(ideaList)
        }
        },
        fail: function(res) {
          console.log(res)
        },
        complete: function(res) {},
      }) 
    }
    if(userPull==true){
      setTimeout(function () {
        $Message({
          content: '刷新成功。',
          duration: 2
        });
      }, 200);
      wx.hideNavigationBarLoading();
      userPull=false;
    }
  },
  failFirstLoad:function(res,self){
    console.log(res)
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
    userPull=true;
    let url = getApp().globalData.requestUrl + '/pillow/selectPillow';
    let params = {
      page: 0,
      pagesize: 5,
      count: 0,
      userId: getApp().globalData.userId,
      catagroy: 0
    }
    request.requestPostApi(url, params, this, this.successFistLoad, this.failFirstLoad);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    let url = getApp().globalData.requestUrl + '/pillow/selectPillow';
    if (that.data.page *that.data. pagesize < that.data.count) {
    let params = {
      page: that.data.page,
      pagesize: that.data.pagesize,
      count: that.data.maxid,
      userId: getApp().globalData.userId,
      catagroy: 0
    }
    request.requestPostApi(url, params, that, that.successLoadMore, that.failFirstLoad);
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
  successLoadMore: function (res, self) {
    var that = this;
    var ideaList = that.data.shareDetail;
    for (let i = 0; i < res.data.idea.length; i++) {
      if (res.data.idea[i].sum == null) {
        res.data.idea[i].sum = 0;
      }
      if (res.data.idea[i].count == null) {
        res.data.idea[i].count = 0;
      }
      if (res.data.idea[i].status == null) {
        res.data.idea[i].status = 0;
      }
      if (res.data.idea[i].userId == getApp().globalData.userId) {
        res.data.idea[i].sortIndex = 1;
      } else {
        res.data.idea[i].sortIndex = 0;
      }
      if (res.data.idea[i].ideaImage != "") {
        res.data.idea[i].ideaImage = res.data.idea[i].ideaImage.split('&&');
      }
      res.data.idea[i].index = i+that.data.page*that.data.pagesize;
      res.data.idea[i].visible = false;
      res.data.idea[i].showModels = false;//是否展示下拉符号
      res.data.idea[i].inputReview = '';

      var urlp = getApp().globalData.requestUrl + '/common/selectComment';
      var paramsp = {
        id: res.data.idea[i].ideaid,
        type: 2
      }
      wx.request({
        url: urlp,
        data: paramsp,
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (result) {
          res.data.idea[i].commentList = result.data.commentList
          ideaList.push(res.data.idea[i])
          if (ideaList.length-that.data.page*that.data.pagesize == res.data.idea.length)
            that.setData({
              shareDetail: ideaList,
              page: that.data.page+1,
              loadMore:false
            })
          console.log('moewIdeaList'+ideaList)
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) { },
      })

    }
    console.log(ideaList)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})