// 导入AV
const AV = require("../../libs/av-core-min.js"); //

Page({
  data: {
    image:"https://cdn.jsdelivr.net/gh/frunoob/images/blog/20210705190417.png",
    user_id: "",
    author_id: 0,
    nbTitle: "",
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
                    } else {
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
    var _index = e.currentTarget.id;
    this.setData({
      _index: _index,
    });
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(this.data._index);
    videoContextPrev.stop();
    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index);
      videoContext.play();
    }, 500);
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
  like: function (e) {
    const that = this;
    const index = e.currentTarget.dataset.index;
    let this_islike = "video_data[" + index + "].islike";
    let this_num = "video_data["+index+"].attributes.like_num"
    // console.log(e.currentTarget.dataset.index);//当前视频数组下标
    // console.log(index);
    // console.log(this.data.video_data[index]);
    if (!this.data.video_data[index].islike) {
      // this.data.video_data[index].islike = true;
      // 向服务器传送点赞信息
      console.log(this.data.user_id);
      //数据获取成功后-------->>>
      // 声明类（数据库表）
      const his = new AV.Query("movie_like");
      his.equalTo("user_id", this.data.user_id);
      his.equalTo("video_id", this.data.video_data[index].attributes.id);
      his.count().then((num) => {
        if (num == 0) {
          const history = new AV.Object("movie_like");
          console.log("历史记录里面没有这个视频");
          history.set("user_id", this.data.user_id);
          history.set("video_id", this.data.video_data[index].attributes.id);
          history.set("title", this.data.video_data[index].attributes.title);
          history.set(
            "subtitle",
            this.data.video_data[index].attributes.subtitle
          );
          history.set(
            "videos_image",
            this.data.video_data[index].attributes.image_url
          );
          // console.log(that.data.video_id)
          history.save().then((res) => {
            //保存成功
            console.log({ msg: "保存成功", res });
            // 传送点赞信息完成//
            this.setData({
              [this_islike]: true,
            });
            const addlike = new AV.Query("movies");
            addlike.equalTo("id",  this.data.video_data[index].attributes.id);
            addlike.first().then((addli) => {
              // console.log(addli)
              addli.increment('like_num',1)
              addli.save().then((res) => {
                console.log({msg:"+1成功",data:res});
                this.setData({
                  [this_num]:res.attributes.like_num
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
      his_d.equalTo("user_id", this.data.user_id);
      his_d.equalTo("video_id", this.data.video_data[index].attributes.id);
      his_d.first().then((res) => {
        res.destroy().then((res) => {
          console.log({ msg: "删除成功", data: res });
          that.setData({
            [this_islike]: false,
          });

          const addlike = new AV.Query("movies");
          addlike.equalTo("id",  this.data.video_data[index].attributes.id);
          addlike.first().then((addli) => {
            // console.log(addli)
            addli.increment('like_num',-1)
            addli.save().then((res) => {
              console.log({msg:"-1成功",data:res});
              this.setData({
                [this_num]:res.attributes.like_num
              })
            });
          });
        });
      });
    }
  },

  getall: function () {
    const query = new AV.Query("movies");
    // 查找改作者的全部小视频
    query.equalTo("author_id", this.data.author_id);
    query.find().then((res) => {
      // console.log({msg:"获取up",data:res})
      this.setData({
        video_data: res,
      });

      //获取用户的user_id
      // 假设已经通过 AV.User.loginWithMiniApp() 登录
      // 获得当前登录用户
      const user = AV.User.current();
      // 调用小程序 API，得到用户信息
      wx.getUserInfo({
        success: ({ userInfo }) => {
          // 更新当前用户的信息
          user
            .set(userInfo)
            .save()
            .then((user) => {
              this.data.user_id = user.attributes.authData.lc_weapp.openid;
              // console.log(this.data.user_id);

              //获取当前用户的喜欢列表
              const query2 = new AV.Query("movie_like");
              query2.equalTo("user_id", this.data.user_id);
              query2.find().then((user_like) => {
                console.log(this.data.video_data);
                console.log(user_like);

                for (
                  let index2 = 0;
                  index2 < this.data.video_data.length;
                  index2++
                ) {
                  const video_l = this.data.video_data[index2];
                  let str = "video_data[" + index2 + "].islike";
                  this.setData({
                    [str]: false,
                  });
                  for (let index = 0; index < user_like.length; index++) {
                    const li = user_like[index];
                    if (li.attributes.video_id == video_l.attributes.id) {
                      console.log("aaa");
                      this.setData({
                        [str]: true,
                      });
                    }
                  }
                }

                console.log(this.data.video_data);
              });
            })
            .catch(console.error);
        },
      });
    });
  },
  onLoad(options) {
    // 接受到的up主的id
    this.setData({
      author_id: options.id,
      nbTitle: options.name,
    });

    this.getall();
  },
  onShow(){
    this.getall();
  }
});
