// 获取 AV 命名空间的方式根据不同的安装方式而异，这里假设是通过手动导入文件的方式安装的 SDK
const AV = require("./libs/av-core-min.js");
const adapters = require("./libs/leancloud-adapters-weapp.js");

AV.setAdapters(adapters);
AV.init({
  appId: "EMvWB4MFkVYX9zOu8mPrXden-MdYXbMMI",
  appKey: "uYYPYEbPfEbUKUym6Bf3Qco4",
  // 请将 xxx.example.com 替换为你的应用绑定的自定义 API 域名
});

App({
  globalData: {
    //全局对象，可以再多个页面里共享
    now: new Date().toLocaleString(),
    user: {
      nickName: "点击登录",
    },
  },
  onLaunch: function () {
    this.login()
    
    wx.cloud.init()

  // this.getall()

  },
  login: function () {
    // 先判断登录信息是否已经失效
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        // 如果已经登录了，则使用以下来获取用户的标识码
        // AV.User.current()
        // 假设已经通过 AV.User.loginWithMiniApp() 登录
        // 获得当前登录用户

        

      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        //登录到开发者服务器
        AV.User.loginWithMiniApp()
          .then((user) => {
            getApp().globalData.user = user.attributes;
          })
          .catch(console.error);
      },
    });

  },
});