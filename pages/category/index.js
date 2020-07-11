import { request } from "../../request/request.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    //左侧数组
    leftMenuList: [],
    //左侧数组
    rightContent: [],
    //被点击的左侧菜单
    currentIndex: 0,
    //右侧内容滚动条，距离顶部的距离
    scrollTop: 0
  },

  onLoad: function (options) {
    /*
    0 web和小程序本地存储的区别
      1 写代码的方式不一样了
        web: localStorge.setIem("key","value") localStorge.getItem("key")
        小程序: wx.getStorageSync("key", "value"); wx.setStorageSync("key")
      2 存的时候有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会先调用 toString(),把数据变成字符串再存进去
        小程序: 不存在类型转化操作，存什么进去，获取的就是什么
    1 先判断一下本地储存有没有旧的数据
    {time:Date,now(),data:[...]}
    2 没有旧数据，直接发送新的请求
    3 有就的数据，同时旧数据没有过期，就使用本地旧数据即可
    */

    // 1 获取本地存储中的数据（小程序中也是存在本地存储技术的）
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      //不存在 发送请求获取数据
      this.getCates();
    } else {
      //有旧的数据 定义一个过期时间 测试，10s 最后 5min
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        //重新发送请求
        this.getCates();
      } else {
        //可以使用旧数据
        this.Cates = Cates.data;
        //构建左侧菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //构建右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  //接口的返回数据
  Cates: [],

  //获取分类数据
  async getCates() {
    // request({url: '/categories'})
    // .then(res=>{
    //   this.Cates=res.data.message;

    //   //把接口的数据存入本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //   //构建左侧菜单数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   this.setData({
    //     leftMenuList
    //   })

    //   //构建右侧商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1 使用es7的async awite来发送请求
    const res = await request({ url: '/categories' });
    this.Cates = res;
    //把接口的数据存入本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //构建左侧菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    this.setData({
      leftMenuList
    })
    //构建右侧商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },

  //左侧菜单的点击事件
  handleItemTap(e) {
    /*
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值
    3 根据不同的索引渲染右侧内容
    */
    const { index } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    //重新设置右侧内容的scroll-view的顶部距离
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})