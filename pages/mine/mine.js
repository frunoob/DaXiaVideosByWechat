const AV = require("../../libs/av-core-min.js");

Page({
  data: {
    image:"https://cdn.jsdelivr.net/gh/frunoob/images/blog/20210705190417.png",
    user_id: "",
    nbTitle: " ",
    nbLoading: false,
    nbFrontColor: "#fff",
    nbBackgroundColor: "#fff",
    bgTextStyle: "#fff",
    bgColor: "#fff",
    // 用户相关
    user: {
      nickName: "点击登录",
      avatarUrl:
        "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
    },
    videos: [],
  },
login:function () {
  wx.showToast({
    title: "欢迎您", // 弹窗的内容
    // image: "/pages/resource/icon/book.png", // 优先级高于icon属性
    icon: "none", //不要图标
    duration: 1000,
  });
},
  getuser: function () {
    const that = this
    // 假设已经通过 AV.User.loginWithMiniApp() 登录
    // 获得当前登录用户
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        wx.cloud.callFunction({
          name: "getOpenId",
          complete: (res) => {
            that.data.user_id = res.result.openid;
            this.setData({
              user: userInfo,
            });
            //用户id数据获取成功后-------->>>
            const query = new AV.Query("movie_history");
            query.equalTo("user_id", this.data.user_id);
            
    query.descending("updatedAt");
    query.limit(5);
            query.find().then((res) => {
              console.log(res);
              //获取到当前用户的全部信息成功后---------->>>>
              this.setData({
                videos: res,
              });

              console.log(this.data.videos.length);
            });
          },
        });
      },
    });
  },
  onLoad() {
    this.getuser();
  },

  onShow: function () {
    this.getuser();
  },
});
