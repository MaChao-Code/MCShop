import {
  request
} from "../../request/request.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
/**
 * 1 用户上滑页面 滚动条触底 开始加载下一页数据
 *  1 找到滚动条触底事件
 *    1 获取总页数 只有总条数
 *          总页数 = Math.ceil(总条数 / 页容量 pagasize)
 *                 = Math.ceil(23 / 10 ) = 3
 *    2 获取当前页码 pagenum
 *    3 当前页码>=总页数?没有下一页:加载下一页
 *  2 判断是否有下一页数据
 *  3 若没有下一页数据，弹出提示到底
 *  4 若有，加载数据
 *    1 当前页码 ++
 *    2 重新发送请求
 *    3 数据请求回来，钥对data中的数组进行拼接而不是全部替换
 * 2 下拉刷新
 *  1 触发下拉刷新事件 需要再页面的json文件中开启一个配置项
 *    找到触发下拉刷新的事件
 *  2 重置数组
 *  3 重置页码 设置为1
 *  4 重新发送请求
 *  5 数据请求hi来，需要手动关闭等待效果
 */
Page({
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },

  // 获取商品列表数据 
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    });
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      //拼接了数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    //关闭下拉刷新窗口 如果没有调用下拉刷新窗口，直接关闭也不会报错
    wx: wx.stopPullDownRefresh();
  },

  //标题的点击事件，从子组件传递过来
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2 修改原数组
    let {
      tabs
    } = this.data;
    //v 循环项 i 索引
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  //页面上滑，滚动条触底事件
  onReachBottom() {
    //1 判断还有没有下一页
    if (this.QueryParams.pagenum >= this.totalPages) {
      //没有下一页
      wx - wx.showToast({
        title: '到底啦~~~'
      })
    } else {
      //还有下一页
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷刷新事件
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1;
    // 3 重新发送请求
    this.getGoodsList();
  }
})