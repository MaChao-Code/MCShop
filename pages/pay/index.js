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
*/
import { getSetting, chooseAddress, openSetting, showModle, showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

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
  handleOrderPay(){
    // 1 判断缓存中有没有token token类似身份认证
    const token = wx.getStorageSync('token');
    // 2 判断
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    console.log("1");
  }
})