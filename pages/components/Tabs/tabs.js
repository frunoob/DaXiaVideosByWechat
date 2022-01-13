// pages/components/Tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  //父组件中接受的
  properties: {
    tabs:{
      type:JSON,
      value:{},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchNav:function(e){
      // console.log(e);
      //获取当前点击的index
      const that = this;
      // 获取索引
        var cur = e.currentTarget.dataset.current;
// 触发父组件中的自定义事件，同时传递数据给父组件
this.triggerEvent("itemChange",{cur})
     //当我们点击的下标等于我们当前的下标时说明没有切换item进行点击，所以不做操作
        if(this.data.tabs.currentNav == cur) {
          return false;
        }else{
        //当我们点击的下标不等于我们当前的下标时，将我们点击获取到的新的下标赋值给currentNav
          this.setData({
          "tabs.currentNav": cur
          });
        }
    },
  },
});

