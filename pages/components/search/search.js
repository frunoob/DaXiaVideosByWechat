// pages/components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    icon: "/pages/resource/icon/search.png",
    inputvalue: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    openLocationsercher: function () {
      this.setData({
        sercherStorage: wx.getStorageSync("searchData") || [],
        StorageFlag: true,
        listFlag: true,
      });
    },
    toSearch() {
      this.openLocationsercher()
    },
    search(e) {
      if (this.data.inputvalue == '') {
        wx.showToast({
          title: '什么都没输入呢！',
          icon: "error", //不要图标
    duration: 1000,
        })
      }else{
        console.log("搜索");
      wx.navigateTo({
        url: "/pages/resault/resault?inputvalue=" + this.data.inputvalue,
      });
      }
    },
    input(e) {
      this.setData({
        inputvalue: e.detail.value,
      });

      console.log(this.data.inputvalue);
    },
  },
});
