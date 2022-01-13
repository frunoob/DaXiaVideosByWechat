// 导入AV
const AV = require("../../libs/av-core-min.js"); //
Page({
  data: {
    // image:"https://cdn.jsdelivr.net/gh/frunoob/images/blog/20210705173637.png",
    image:"https://cdn.jsdelivr.net/gh/frunoob/images/blog/20210705190417.png",
    user_id: "",
    nbTitle: " ",
    nbFrontColor: "#fff",
    nbBackgroundColor: "#000",
    videoPlay: null,
    test: "测试",
    icon_like: "/pages/resource/icon/_like.png",
    icon_unlike: "/pages/resource/icon/Like.png",
    weixin: "/pages/resource/icon/weixin.png",
    video_data: [],
  },
    // 记录用户播放记录
    history: function (e) {
      const that = this
    let index = e.currentTarget.id;
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
              console.log(that.data.user_id);
                const his = new AV.Query("movie_history");
                his.equalTo("user_id", that.data.user_id);
                his.equalTo("video_id", that.data.video_data[index].attributes.id);
                his.count().then((num) => {
                  if (num == 0) {
                    console.log("历史记录里面没有这个视频");
                    const history = new AV.Object("movie_history");
                    history.set("user_id", that.data.user_id);
                    history.set("video_id", that.data.video_data[index].attributes.id);
                    history.set("title", that.data.video_data[index].attributes.title);
                    history.set("subtitle", that.data.video_data[index].attributes.subtitle);
                    history.set("videos_image", that.data.video_data[index].attributes.image_url);
                    // //console.log(that.data.video_id)
                    history.save().then((res) => {
                      //保存成功
                      console.log({
                        msg: "保存成功",
                        res,
                      });
                    }),
                      (error) => {
                        // 异常处理
                        console.log("保存失败");
                      };
                  } else if(num==1){
                    his.first().then((res)=>{
                      console.log({msg:"已存在",data:res})
                      let myDate  = new Date()
                      res.set("updated",myDate)
                      res.save().then((res)=>{
                        console.log("历史信息更新成功")
                      })
                    })
  
                  }
                  else {
                    console.log("已经保存到历史记录了");
                  }
                });
              }
            });
          
       
        },
      });
    },
  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    const that = this
    var _index = e.currentTarget.id;
    that.setData({
      _index: _index,
    });
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(that.data._index);
    videoContextPrev.stop();
    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index);
      videoContext.play();
    }, 500);
    that.history(e)

  },
  like: function (e) {
    const that = this
    const index = e.currentTarget.dataset.index;
    let that_islike = "video_data[" + index + "].islike";
    let that_num = "video_data["+index+"].attributes.like_num"
    // console.log(e.currentTarget.dataset.index);//当前视频数组下标
    // console.log(index);
    // console.log(that.data.video_data[index]);
    if (!that.data.video_data[index].islike) {
      // that.data.video_data[index].islike = true;
      // 向服务器传送点赞信息
      console.log(that.data.user_id);
      //数据获取成功后-------->>>
      // 声明类（数据库表）
      const his = new AV.Query("movie_like");
      his.equalTo("user_id", that.data.user_id);
      his.equalTo("video_id", that.data.video_data[index].attributes.id);
      his.count().then((num) => {
        if (num == 0) {
          const history = new AV.Object("movie_like");
          console.log("历史记录里面没有这个视频");
          history.set("user_id", that.data.user_id);
          history.set("video_id", that.data.video_data[index].attributes.id);
          history.set("title", that.data.video_data[index].attributes.title);
          history.set(
            "subtitle",
            that.data.video_data[index].attributes.subtitle
          );
          history.set(
            "videos_image",
            that.data.video_data[index].attributes.image_url
          );
          // console.log(that.data.video_id)
          history.save().then((res) => {
            //保存成功
            console.log({ msg: "保存成功", res });
            // 传送点赞信息完成//
            that.setData({
              [that_islike]: true,
            });
            const addlike = new AV.Query("movies");
            addlike.equalTo("id",  that.data.video_data[index].attributes.id);
            addlike.first().then((addli) => {
              // console.log(addli)
              addli.increment('like_num',1)
              addli.save().then((res) => {
                console.log({msg:"+1成功",data:res});
                that.setData({
                  [that_num]:res.attributes.like_num
                })
              });
            });
          }),
            (error) => {
              // 异常处理
              console.log("保存失败");
            };
        } else {
          console.log("已经点过攒了");
        }
      });
    } else {
      const his_d = new AV.Query("movie_like");
      his_d.equalTo("user_id", that.data.user_id);
      his_d.equalTo("video_id", that.data.video_data[index].attributes.id);
      his_d.first().then((res) => {
        res.destroy().then((res) => {
          console.log({ msg: "删除成功", data: res });
          that.setData({
            [that_islike]: false,
          });

          const addlike = new AV.Query("movies");
          addlike.equalTo("id",  that.data.video_data[index].attributes.id);
          addlike.first().then((addli) => {
            // console.log(addli)
            addli.increment('like_num',-1)
            addli.save().then((res) => {
              console.log({msg:"-1成功",data:res});
              that.setData({
                [that_num]:res.attributes.like_num
              })
            });
          });
        });
      });
    }
  },
  onLoad() {
    
    const that = this
    that.getHot();
    that.share()
  },
  onShow(){
    this.getHot()
  },

  //分享
  share:function () {
    const that = this
    console.log("分享")
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  getHot: function () {
    const that = this
    const query = new AV.Query("movies");
    query.contains("kind", "小视频");
    // 按 createdAt 降序排列
    query.descending("createAt");
    query.find().then((res) => {
      that.setData({
        video_data: res,
      });

      //获取用户的user_id
      // 假设已经通过 AV.User.loginWithMiniApp() 登录
      // 获得当前登录用户
      // const user = AV.User.current();
      // 调用小程序 API，得到用户信息
      wx.getUserInfo({
        success: ({ userInfo }) => {
          // 更新当前用户的信息

          wx.cloud.callFunction({
            name: 'getOpenId',
            complete: res => {
            
                that.data.user_id = res.result.openid;
                // console.log(that.data.user_id);
  
                //获取当前用户的喜欢列表
                const query2 = new AV.Query("movie_like");
                query2.equalTo("user_id", that.data.user_id);
                query2.find().then((user_like) => {
                  console.log(that.data.video_data);
                  console.log(user_like);
  
                  for (
                    let index2 = 0;
                    index2 < that.data.video_data.length;
                    index2++
                  ) {
                    const video_l = that.data.video_data[index2];
                    let str = "video_data[" + index2 + "].islike";
                    that.setData({
                      [str]: false,
                    });
                    for (let index = 0; index < user_like.length; index++) {
                      const li = user_like[index];
                      if (li.attributes.video_id == video_l.attributes.id) {
                        console.log("aaa");
                        that.setData({
                          [str]: true,
                        });
                      }
                    }
                  }
  
                  console.log(that.data.video_data);
                });
              
            }
          })

        },
      });
    });
  },
});
