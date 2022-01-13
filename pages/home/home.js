// 导入AV
const AV = require("../../libs/av-core-min.js"); //

Page({
  data: {
    listFlag:false,
    sercherStorage: [],
StorageFlag: false, //显示搜索记录标志位,
    height: 0,
    sentence: [],
    swiper: [],
    movies: [],
    user_id: "",
    tabs: {
      currentNav: 0,
      navData: [
        {
          text: "推荐",
          hottitle: ["经典","电影","电视剧","动漫","综艺"],
        },
        {
          text: "综艺",
          hottitle: ["情感", "真人秀","搞笑","脱口秀","音乐","相声"],
        },
        {
          text: "电视剧",
          hottitle: ["内地","古装","韩剧","美剧","日剧"],
        },
        {
          text: "电影",
          hottitle: ["惊悚", "科幻", "剧情","动作"],
        },
        {
          text: "动漫",
          hottitle: ["日本动漫", "国产动画","欧美动画","热血动画"],
        },
        {
          text: "儿童",
          hottitle: ["儿童"],
        },
      ],
    },
  },
  addToHis(){
    var self = this;
    if(self.data.search.length == 0){
     return;
    }
    //控制搜索历史
    var self = this;
    if (this.data.search != '') {
     //将搜索记录更新到缓存
     var searchData = self.data.sercherStorage;
     searchData.push({
     id: searchData.length,
     name: self.data.search
     })
     wx.setStorageSync('searchData', searchData);
     self.setData({ StorageFlag: false, })
    }
  },
  openLocationsercher: function () {
    console.log("ddd")
    this.setData({
    sercherStorage: wx.getStorageSync('searchData') || [], 
    StorageFlag: true,
    listFlag: true,
    })
    },
  //清除缓存历史
 clearSearchStorage: function () {
  wx.removeStorageSync('searchData')
  this.setData({
  sercherStorage: [],
  StorageFlag: false,
  })
  },
  handleItemChange(e) {
    const { cur } = e.detail; //const cur = e.detail.cur
    // console.log("是这里报错吗？")
    let str = this.data.tabs.navData[cur].text;
    // console.log(str);
    this.setData({
      "tabs.currentNav": cur,
    });
    this.getMovies(this.data.tabs.navData[this.data.tabs.currentNav]);
  },
  getSwiper: function () {
    const query = new AV.Query("movies");
    query.contains("hottitle", "轮播图");
    query.find().then((res) => {
      this.setData({
        swiper: res,
      });

      console.log(res);
    });
  },
  //获取视频清单
  getMovies: function (e) {
    let mov = [];
    let a = 0;
    const that = this;

    const startDateQuery = new AV.Query("movies");
    startDateQuery.contains("kind", e.text);
    for (let i = 0; i < e.hottitle.length; i++) {
      // and查询

      const endDateQuery = new AV.Query("movies");
      endDateQuery.contains("hottitle", e.hottitle[i]);

      const query = AV.Query.and(startDateQuery, endDateQuery);

      // 按 createdAt 降序排列
      query.descending("createAt");
      // res 为查询结果数组
      query.find().then((res) => {
        // movies[i].hottitle=e.hottitle[i];
        // movies[i].hot=res;
        let obj = {
          hottitle: "",
          hot: [],
        };
        obj["hottitle"] = e.hottitle[i];
        obj["hot"] = res;
        const bb = obj;
        console.log(bb);
        a = mov.push(bb);
        that.setData({
          movies: mov,
        });
      });
    }
  },
  // 每日一句话
  getSentence() {
    this.sentence = wx.getStorageSync("sentence");
    if (
      !this.sentence.data ||
      Date.now() - this.sentence.time > 1000 * 60 * 10
    ) {
      wx.request({
        url: "https://api.vvhan.com/api/ian", //每日一句接口
        success(res) {
          wx.setStorageSync("sentence", {
            time: Date.now(),
            data: res.data,
          });
        },
      });
      this.sentence = wx.getStorageSync("sentence");
    }
    wx.showToast({
      title: this.sentence.data, // 弹窗的内容
      // image: "/pages/resource/icon/book.png", // 优先级高于icon属性
      icon: "none", //不要图标
      duration: 5000,
    });
  },
  login: function () {
    const that = this;

    // let global_user = {};
    // 先判断登录信息是否已经失效
    wx.checkSession({
      success() {
        console.log("登录信息仍然有效");
        //session_key 未过期，并且在本生命周期一直有效
        // 如果已经登录了，则使用以下来获取用户的标识码
        // AV.User.current()
        // 假设已经通过 AV.User.loginWithMiniApp() 登录
        // 获得当前登录用户

        // 调用小程序 API，得到用户信息
        wx.getUserInfo({
          success: ({ userInfo }) => {
            // 更新当前用户的信息

            console.log({ msg: "获取信息成功", data: userInfo });
            wx.cloud.callFunction({
              name: "getOpenId",
              complete: (res) => {
                that.setData({
                  user_id: res.result.openid,
                });
                console.log(that.data.user_id);
              },
            });
          },
        });
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        //登录到开发者服务器
        AV.User.loginWithMiniApp()
          .then((user) => {
            console.log(user);
            global_user = user.attributes;
            // 将当前绑定数据的要显示的用户信息更新
            that.setData({
              userInfo: global_user,
            });
          })
          .catch(console.error);
      },
    });

    {
      // {
      //   //用户授权
      //   wx.getSetting({
      //     success(res) {
      //       if (!res.authSetting["scope.userInfo"]) {
      //         wx.authorize({
      //           scope: "scope.userInfo",
      //           success() {
      //             console.log("授权成功");
      //           },
      //         });
      //       }
      //     },
      //   });
      //   // 获取用户信息
      //   wx.getUserInfo({
      //     success: function (res) {
      //       console.log(res.userInfo);
      //       that.setData({
      //         userInfo: res.userInfo,
      //       });
      //     },
      //   });
      // }
    }
  },
  //分享
  share: function () {
    const that = this;
    console.log("分享");
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
  },
  onLoad() {
    this.getSentence(); //每日一句话
    this.getMovies(this.data.tabs.navData[this.data.tabs.currentNav]);
    this.getSwiper();
    this.login();
    this.share();
  },
  onShow(){
    // this.getSentence(); //每日一句话
    this.getMovies(this.data.tabs.navData[this.data.tabs.currentNav]);
    this.getSwiper();
  }
});
