Page({
  data: {
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
  },
  onLoad() {
    this.setData({
      nbTitle: '设置',
      nbLoading: false,
      nbFrontColor: '#000',
      nbBackgroundColor: '#000',
    })
  },
  outlogin:function () {
    var a = getApp().globalData.user;
    a = {};
    wx.exitMiniProgram({
      success(e){
        console.log(e)
      }
    })
  }
})