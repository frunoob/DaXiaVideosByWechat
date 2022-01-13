// pages/play/play.js
// 导入AV
const AV = require("../../libs/av-core-min.js"); //

Page({
  /**
   * 页面的初始数据
   */
  data: {
    haveerror:false,
    user: {},
    currentSets: 1,
    changeSet:"f",
    user_id: "",
    userinfo: {},
    icon_like: "/pages/resource/icon/_like.png",
    icon_unlike: "/pages/resource/icon/Like.png",
    icon_collec: "/pages/resource/icon/collection.png",
    icon_uncollec: "/pages/resource/icon/_collection.png",
    video_id: "",
    videos: [],
    islike: false,
    iscollec: false,
    weixin: "/pages/resource/icon/weixin.png",
  },

 
  //切换集数
  changeSets: function (e) {
    console.log(this.data.changeSet)
    if(e.currentTarget.dataset.num==1){
      this.setData({
        currentSets: e.currentTarget.dataset.num,
        changeSet:this.data.videos.url,
        haveerror:false
      });
    }else{
       //console.log(e.currentTarget.dataset.num)
   let set2 = this.data.videos.url.replace("playlist.m3u8",e.currentTarget.dataset.num+"/playlist.m3u8")
   // console.log(this.data.changeSet)
   this.setData({
     currentSets: e.currentTarget.dataset.num,
     changeSet:set2
   });
   console.log(this.data.changeSet)

    }
   
  },
  //获取用户信息 喜欢  收藏  历史
  getall: function () {},
  // 记录用户播放记录
  history: function () {
    const that = this
    // 假设已经通过 AV.User.loginWithMiniApp() 登录
    // 获得当前登录用户

    // const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        wx.cloud.callFunction({
          name: "getOpenId",
          complete: (res) => {
            that.data.user_id = res.result.openid;
            console.log(this.data.user_id);
            console.log(this.data.video_id);

            // 声明类（数据库表）
            const dvideos = new AV.Query("movies");
            dvideos.equalTo("id", this.data.video_id);
            dvideos.first().then((dvideo) => {
              this.setData({
                videos: dvideo.attributes,
                changeSet:dvideo.attributes.url
              });

              const his = new AV.Query("movie_history");
              his.equalTo("user_id", this.data.user_id);
              his.equalTo("video_id", this.data.video_id);
              his.count().then((num) => {
                if (num == 0) {
                  console.log("历史记录里面没有这个视频");
                  const history = new AV.Object("movie_history");
                  history.set("user_id", this.data.user_id);
                  history.set("video_id", this.data.video_id);
                  history.set("title", this.data.videos.title);
                  history.set("subtitle", this.data.videos.subtitle);
                  history.set("videos_image", this.data.videos.image_url);
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
                }else if(num==1){
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
            });

            //判断是否已经为这个视频点赞了
            const query = new AV.Query("movie_like");
            query.equalTo("user_id", this.data.user_id);
            query.find().then((res) => {
              // console.log(res)
              for (let index = 0; index < res.length; index++) {
                const element = res[index].attributes.video_id;
                console.log(element);
                if (element == this.data.video_id) {
                  this.setData({
                    islike: true,
                  });
                  console.log("shid");
                }
              }
            });
            const query3 = new AV.Query("movie_collec");
            query3.equalTo("user_id", this.data.user_id);
            query3.find().then((res) => {
              // console.log(res)
              for (let index = 0; index < res.length; index++) {
                const element = res[index].attributes.video_id;
                console.log(element);
                if (element == this.data.video_id) {
                  this.setData({
                    iscollec: true,
                  });
                  console.log("shid");
                }
              }
            });
                    }})
      },
    });
  },
 //点击喜欢
 like: function (e) {
  const that = this;
  let like = that.data.islike;
  if (!like) {
    // 向服务器传送点赞信息
    //console.log("like获取成功");
    // ////console.log(this.data.user_id)
    //数据获取成功后-------->>>
    // 声明类（数据库表）
    const his = new AV.Query("movie_like");
    his.equalTo("user_id", this.data.user_id);
    his.equalTo("video_id", this.data.video_id);
    his.count().then((num) => {
      if (num == 0) {
        const history = new AV.Object("movie_like");
        ////console.log("历史记录里面没有这个视频");
        history.set("user_id", this.data.user_id);
        history.set("video_id", this.data.video_id);
        history.set("title", this.data.videos.title);
        history.set("subtitle", this.data.videos.subtitle);
        history.set("videos_image", this.data.videos.image_url);
        // ////console.log(that.data.video_id)
        history.save().then((res) => {
          //保存成功
          console.log({ msg: "保存成功", res });
          // 传送点赞信息完成//
          this.setData({
            islike: true,
          });

          const addlike = new AV.Query("movies");
          addlike.equalTo("id", this.data.video_id);
          addlike.first().then((addli) => {
            // console.log(addli)
            addli.increment('like_num',1)
            addli.save().then((res) => {
              console.log({msg:"+1成功",data:res});
              this.setData({
                ["videos.like_num"]:res.attributes.like_num
              })
            });
          });
        }),
          (error) => {
            // 异常处理
            //console.log("保存失败");
          };
      } else {
        console.log("已经喜欢了");
      }
    });
  } else {

    const his_d = new AV.Query("movie_like");
    his_d.equalTo("user_id", this.data.user_id);
    his_d.equalTo("video_id", this.data.video_id);

    his_d.first().then((res) => {
      res.destroy().then((res) => {
        
        console.log({ msg: "删除成功", data: res });
        that.setData({
          islike: false,
        });
        const addlike = new AV.Query("movies");
          addlike.equalTo("id", this.data.video_id);
          addlike.first().then((addli) => {
            // console.log(addli)
            addli.increment('like_num',-1)
            addli.save().then((res) => {
              console.log({msg:"-1成功",data:res});
              this.setData({
                ["videos.like_num"]:res.attributes.like_num
              })
            });
          });
      });
    });
  }
},
  //点击收藏事件
  collec: function () {
    const that = this;
    let collec = that.data.iscollec;
    if (!collec) {
      // 向服务器传送点赞信息
      //数据获取成功后-------->>>
      // 声明类（数据库表）
      const his = new AV.Query("movie_collec");
      his.equalTo("user_id", this.data.user_id);
      his.equalTo("video_id", this.data.video_id);
      his.count().then((num) => {
        if (num == 0) {
          const history = new AV.Object("movie_collec");
          console.log("还没有收藏这个视频");
          history.set("user_id", this.data.user_id);
          history.set("video_id", this.data.video_id);
          history.set("title", this.data.videos.title);
          history.set("subtitle", this.data.videos.subtitle);
          history.set("videos_image", this.data.videos.image_url);
          // //console.log(that.data.video_id)
          history.save().then((res) => {
            //保存成功
            console.log({ msg: "保存成功", res });
            // 更新视频点赞数信息
            // 传送收藏信息完成//
            this.setData({
              iscollec: true,
            });
            
            const addlike = new AV.Query("movies");
            addlike.equalTo("id", this.data.video_id);
            addlike.first().then((addli) => {
              // console.log(addli)
              addli.increment('collec_num',1)
              addli.save().then((res) => {
                console.log({msg:"+1成功",data:res});
                this.setData({
                  ["videos.collec_num"]:res.attributes.collec_num
                })
              });
            });
          }),
            (error) => {
              // 异常处理
              console.log("保存失败");
            };
        } else {
          console.log("已经收藏了");
        }
      });
    } else {
      const his_d = new AV.Query("movie_collec");
      his_d.equalTo("user_id", this.data.user_id);
      his_d.equalTo("video_id", this.data.video_id);
      his_d.first().then((res) => {
        res.destroy().then((res) => {
          console.log({ msg: "删除成功", data: res });
          that.setData({
            iscollec: false,
          });

          const addlike = new AV.Query("movies");
          addlike.equalTo("id", this.data.video_id);
          addlike.first().then((addli) => {
            // console.log(addli)
            addli.increment('collec_num',-1)
            addli.save().then((res) => {
              console.log({msg:"-1成功",data:res});
              this.setData({
                ["videos.collec_num"]:res.attributes.collec_num
              })
            });
          });
        });
      });
    }
  },

  show:function (e) {
    console.log(e._userTap)
    const that  = this
    if (e._userTap) {
      that.setData({
        haveerror:true
      })
    }else{
      that.setData({
        changeSet:""
      })
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 由视频列表页面向播放页面传值
    this.setData({
      video_id: options.id,
    });
    this.history();

    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });

    this.getall();
    this.share()
  },
});
