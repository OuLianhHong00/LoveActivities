// pages/publishactivity/publishactvity.js
var util=require('../../../utils/util.js');
const common=require('../../../utils/upload.js')
const request=require('../../../utils/request.js')
var imgArr=new Array();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['活动', '悄悄话'],
    currentTab: 0,
    chooseImageUrl:[],
    imgCount:0,
    visibleTA:false,
    titleAvater:''
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  //选择图片
  choosephoto:function(){
    var that=this;
    var attach=[];
    wx.chooseImage({
      sourceType:['album','camera'],
      sizeType:['original'],
      count:9,
      success: function(res) {
        var tempFilePaths=res.tempFilePaths;
        var len=that.data.imgCount+tempFilePaths.length;
        if(len>9){
          wx.showToast({
            title: '最多只能选9张照片',
            icon:'loading',
            duration:1000
          })
          return false;
        }
        for(var i=0;i<tempFilePaths.length;i++){
          imgArr.push(tempFilePaths[i]);
        }
        that.setData({
          imgCount:len,
          chooseImageUrl:imgArr
        })
      },
    })
  },
  //删除不想要的图片
  close:function(e){
     var mylen=this.data.chooseImageUrl.length;
     var myindex=e.currentTarget.dataset.index;
     imgArr.splice(myindex,1);
     this.setData({
       imgCount:myindex-1,
       chooseImageUrl:imgArr
     })
  },
  //活动标题头像
  chooseTitleImg:function(){
    var that = this;
    var attach = [];
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['original'],
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          visibleTA:true,
          titleAvater:tempFilePaths[0]
        })
      },
    })
  },
  //重选标题头像
  resetTitleAvater:function(){
    this.setData({
      titleAvater: ''
    })
  },
  //提交活动
  submitActivity:function(e){
    var that=this;
    var time = util.formatTime(new Date());
    if(that.data.titleAvater==""&&that.data.chooseImageUrl.length!=0){
      that.setData({
        titleAvater:that.data.chooseImageUrl[0]
      })
    }
    if(that.data.titleAvater!=''){
      var titleImage=that.data.titleAvater;
      common.uploadFile(getApp().globalData.requestUrl + '/activity/addImage', titleImage, "titelAvatar")
      .then(function(res){
        that.data({
          titleAvater:res.data
        })
      })
        .catch(function (data) {
          wx.showToast({
            title: '上传标题图片失败',
          })
          return;
        })
    }
    if (e.detail.value.atitle == ''){
      wx.showToast({
        title: '标题不能为空',
        duration: 1000
      })
    } else if (e.detail.value.acontent == ''){
      wx.showToast({
        title: '内容不能为空',
        duration: 1000
      })
    } else if (that.data.titleAvater == '')
    {
      wx.showToast({
        title: '标题头像不能为空',
        duration: 1000
      })
    }
   else{
     //上传图片
      imgArr =[];
      for (let i = 0; i < that.data.chooseImageUrl.length;i++){
        var imgUrl=that.data.chooseImageUrl[i];
        common.uploadFile(getApp().globalData.requestUrl + '/activity/addImage',imgUrl,"contentImage")
        .then(function(res){
          imgArr.push(res.data)
          console.log(imgArr)  
          if(imgArr.length==that.data.chooseImageUrl.length){
            //上传其他内容
            let data1 = {
              userId: getApp().globalData.userId,
              activityText: e.detail.value.acontent,
              activityAvator: that.data.titleAvater,
              activityImage: imgArr.join('&&'),
              activityTitle: e.detail.value.atitle,
              activityTime: time
            }
            var activityUrl = getApp().globalData.requestUrl + '/activity/addActivity';
            request.requestPostApi(activityUrl, data1, this, this.successSaveActivity, this.failSave);
          }
        })
        .catch(function (data) {
          console.log(data)
            wx.showToast({
              title: '上传图片失败',
            })
            return;
          })
      }  
    }
  },
  //提交悄悄话
  submitPillow:function(e){
    var that = this;
    var time = util.formatTime(new Date());
    console.log(e.detail.value.qcontent)
    if (e.detail.value.qcontent == ''&&that.data.chooseImageUrl.length==0) {
      wx.showToast({
        title: '文字图片不能都为空',
        duration: 1000
      })
    } 
    else {
      //上传图片
      var url= getApp().globalData.requestUrl + '/pillow/addPillow';      
      if (that.data.chooseImageUrl.length>0){
      imgArr = [];
      for (let i = 0; i < that.data.chooseImageUrl.length; i++) {
        var imgUrl = that.data.chooseImageUrl[i];
        common.uploadFile(getApp().globalData.requestUrl + '/pillow/addPillowImage', imgUrl, "contentImage")
          .then(function (res) {
            imgArr.push(res.data)
            if (imgArr.length == that.data.chooseImageUrl.length) {
              let data1 = {
                userId: getApp().globalData.userId,
                ideaText: e.detail.value.qcontent,
                ideaImage: imgArr.join('&&'),
                ideaTime: time
              }
              request.requestPostApi(url,data1,that,that.successSavePillow,that.failSave)
            }
          })
          .catch(function (reson) {
            console.log(reson)
            wx.showToast({
              title: '上传图片失败',
            })
            return;
          })
      }  
      }//判断是否有图片
      else{
          let data2={
            userId: getApp().globalData.userId,
            ideaText: e.detail.value.qcontent,
            ideaImage: '',
            ideaTime: time
          }
        request.requestPostApi(url, data2, that, that.successSavePillow, that.failSave)
      }
    }
  },
  //提交活动成功
  successSaveActivity: function (res, self) {
    var that=this
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 1000
    })
    wx.switchTab({
      url: '../../../pages/activity/activity',
    })
    that.setData({
      chooseImageUrl: [],
      imgCount: 0,
    })
  },
  //提交悄悄话成功
  successSavePillow:function(res,self){
    var that=this;
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
    wx.switchTab({
          url: '../../../pages/idea/idea',
        })
    that.setData({
      chooseImageUrl: [],
      imgCount: 0,
    })
      },
      //提交失败
      failSave: function(res,self) {
        wx.showToast({
          title: '新增失败',
          duration: 3000
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