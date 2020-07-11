//引入发送请求的方法 一定要把路径写全
import {
  request
} from "../../request/request.js";

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    //导航数组
    catesList: [],
    //楼层数组
    floorList: []
  },
  //页面开始加载时触发
  onLoad: function (options) {
    // 1 开始发送异步请求，获取轮播图数据 使用es6的promise来优化请求
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },

  //获取轮播图数据
  getSwiperList() {
    request({
        url: '/home/swiperdata'
      })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  //获取导航数据
  getCatesList() {
    request({
        url: '/home/catitems'
      })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  //获取楼层数据
  getFloorList() {
    request({
        url: '/home/floordata'
      })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  }
});