Page({

  /**
   * 页面的初始数据
   */
  data: {
     searchValue:"",
    activities: [
      {
        title: "喜迎青春",
        school: "西南石油大学",
        avatar: "https://i.loli.net/2017/08/21/599a521472424.jpg",
        content: "在XXX时候举办喜迎青春放飞梦想的活动",
        time: 2019 - 3 - 25,
        likesum: 0
      },
      {
        title: "清风文学社第三十九届",
        school: "西南石油大学",
        avatar: "https://i.loli.net/2017/08/21/599a521472424.jpg",
        content: "在XXX时候举办喜迎青春放飞梦想的活动在XXX时候举办喜迎青春放飞梦想的活动在XXX时候举办喜迎青春放飞梦想的活动在XXX时候举办喜迎青春放飞梦想的活动",
        time: 2019 - 3 - 25,
        likesum: 0
      }
    ]    
  },

  searchInput:function(e){
    this.setData({
      searchValue:e.detail.value
    })
  },
  queryValue:function(){
    var that=this;
    /*
    wx.request({
      url: 'https://localhost/proj_online_class/server/public/index.php/forum/forum/get_issue_search/' + this.data.inputValue + /0/,
      data: {
        searchValue: this.data.searchValue
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var searchData = res.data
        that.setData({
          searchData
        })

        
          //把 从get_issue_searchAPI 
          //获取 提问帖子搜索 的数据 设置缓存
         
        wx.setStorage({
          key: 'searchLists',
          data: {
            searchLists: res.data
          }
        })

         // 设置 模糊搜索
         
        if (!that.data.inputValue) {
          //没有搜索词 友情提示
          wx.showToast({
            title: '请重新输入',
            image: '../../picture/tear.png',
            duration: 2000,
          })
        } else if (searchData.search.length == 0) {
          //搜索词不存在 友情提示
          wx.showToast({
            title: '关键词不存在',
            image: '../../picture/tear.png',
            duration: 2000,
          })
        } else {
          //提取题目关键字 与搜索词进行匹配
          var searchIndex = searchData.search.length
          var d = 0;
          for (var i = 0; i <= searchIndex - 1; i++) {

            var searchTitle = searchData.search[d].title
            console.log(searchTitle)
            d = d + 1;

            for (var x = 0; x <= searchTitle.length; x++) {
              for (var y = 0; y <= searchTitle.length; y++) {
                var keyWord = searchTitle.substring(x, y);
                console.log(keyWord)
              }
            }
          
              //根据关键词 跳转到 search搜索页面
            
            wx.navigateTo({
              url: '../search/search',
            })
          }
        }
        */
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