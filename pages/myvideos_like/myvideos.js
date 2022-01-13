// pages/myvideos/myvideos.js
// 导入AV
const AV = require("../../libs/av-core-min.js"); //

Page({
  /**
   * 页面的初始数据
   */
  data: {
    image:"https://cdn.jsdelivr.net/gh/frunoob/images/blog/20210705190417.png",
    user_id: "",
    a: 0,
    kind: "movie_like",

    videos: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    that.setData({
      kind: options.kind,
    });
    that.getuser();
  },
  ///  回调函数，获取用户信息
  getuser: function () {
    const that = this
    // 假设已经通过 AV.User.loginWithMiniApp() 登录
    // 获得当前登录用户
    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        wx.cloud.callFunction({
          name: "getOpenId",
          complete: (res) => {
            that.data.user_id = res.result.openid;

            //用户id数据获取成功后-------->>>
            const query = new AV.Query("movie_like");
            query.equalTo("user_id", that.data.user_id);
            
    query.descending("createAt");
            query.find().then((res) => {
              console.log(res);
              //获取到当前用户的全部信息成功后---------->>>>
              that.setData({
                videos: res,
                length:res.length
              });
            });
                    }})
      },
    });
  },

  delete: function (e) {
    const that = this;
    if (that.data.length != 0) {
      wx.showModal({
        title: "是否要继续",
        content: "接下来将会清空全部历史",
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            const his = new AV.Query("movie_like");
            his.equalTo("user_id", that.data.user_id);
            his.find().then((res) => {
              AV.Object.destroyAll(res).then(
                function (deletedObjects) {
                  // 成功删除所有对象时进入此 resolve 函数，deletedObjects 是包含所有的 AV.Object 的数组
                  console.log({ msg: "删除成功", deletedObjects });

                  wx.showToast({
                    title: "删除成功", // 弹窗的内容
                    // image: "/pages/resource/icon/book.png", // 优先级高于icon属性
                    icon: "success", //不要图标
                    duration: 3000,
                  });
                },
                function (error) {
                  // 只要有一个对象删除错误就会进入此 reject 函数
                  console.log(error);
                }
              );
            });
            // 批量删除
            setTimeout(() => {
              wx.switchTab({
                url: "/pages/mine/mine",
                complete: (res) => {
                  console.log("删除进程结束");
                  console.log(res);
                },
                fail: (res) => {
                  console.log("删除失败");
                  console.log(res);
                },
                success: (res) => {
                  console.log("删除成功");
                  console.log(res);
                },
              });
            }, 1000);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    } else {
      wx.showToast({
        title: "似乎没有记录呢",
        complete: (res) => {},
        duration: 2000,
        fail: (res) => {},
        icon: "none",
        // image: 'image',
        mask: true,
        success: (res) => {},
      });
    }
  },
});
