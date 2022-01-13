// 导入AV
const AV = require("../../libs/av-core-min.js"); //

// pages/resault/resault.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
    image:"https://cdn.jsdelivr.net/gh/frunoob/images/blog/20210705190417.png",
    inputvalue: "特种兵",
    videos: [],
    length:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getList: function (inputvalue) {
    const that = this;
    const query = new AV.Query("movies");
    query.contains("title", inputvalue);
    // 按 createdAt 降序排列
query.descending('updatedAt');
    query.find().then((res) => {
      that.setData({
        length:res.length,
        videos:res
      })

      
    });
  },
  onLoad: function (options) {
    // 获取来自search组件的的搜索内容
    this.setData({
      inputvalue: options.inputvalue,
    });
    // console.log(options.inputvalue)
    this.getList(this.data.inputvalue);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
