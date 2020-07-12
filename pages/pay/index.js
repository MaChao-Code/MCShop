/**
 * 1 页面加载的时候
 *  1 从缓存中获取购物车数据，渲染到页面中，这些数据checcked=true
 * 2 微信支付
 *  1 那些人 那些账号可以微信支付
 *    1 企业账号
 *    2 企业账号的小程序中必须给开发者添加白名单
 *      1 一个appid可以同时绑定多个开发者
 *      2 这些开发者就可以共用这个appid和它的开发权限
 * 3 支付按钮
 *  1 先判断缓存红有没有token
 *  2 没有 跳转到授权页面 进行获取token
 *  3 有 正常执行
 *  4 创建订单 获取订单编号
 *  5 完成订单支付
 *  6 手动删除缓存中已经被选中的商品
 *  7 删除后的购物车数据重新填充回缓存
 *  8 再跳转页面
*/
import { getSetting, chooseAddress, openSetting, showModle, showToast, requestPayment } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/request.js";

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1 获取缓存中的收获地址
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({ address });

    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart, totalPrice, totalNum, address
    });
  },

  // 点击支付
  async handleOrderPay() {
    try {
      // 1 判断缓存中有没有token token类似身份认证
      const token = wx.getStorageSync('token');
      // 2 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      // 3 创建订单
      // 3.1 准备请求头参数
      // const header = { Authorization: token };
      // 3.2 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }));
      const orderParams = { order_price, consignee_addr, goods };
      // 4 发送请求创建订单，获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      // 5 准备发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      // 6 发起微信支付
      await requestPayment(pay);
      // 7 查询后台，查看订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
      await showToast({ title: "支付成功" });
      // 手动删除缓存中已经支付了的数据
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart);
      // 8 支付成功到跳转到顶单页面
      // 因为token是假的，账号权限不够，没有办法成功
      wx.navigateTo({
        url: '/pages/order/index',
      })
    } catch (error) {
      await showToast({ title: "支付失败" });
      // 为了方便，失败后也做成功的操作
      
      // 手动删除缓存中已经支付了的数据
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart);

      wx.navigateTo({
        url: '/pages/order/index',
      })
    }
  }
})