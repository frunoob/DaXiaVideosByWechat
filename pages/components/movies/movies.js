// pages/components/movies/movies.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
movies:{
  type:Array,
  value:[]
}
  },

  /**
   * 组件的初始数据
   */
  data: {
    // image:"https://cdn.jsdelivr.net/gh/frunoob/images/blog/20210705173637.png"
    
    image:"https://cdn.jsdelivr.net/gh/frunoob/images/blog/20210705190417.png",
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    noImage(e){
      console.log({msg:"图片错误",attr:e})
    }

  }
})
