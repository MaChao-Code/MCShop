/**
 * 1 获取用户收获地址
 *  1 绑定点击事件
 *  2 调用小程序内置api，获取用户的收获地址 wx.chooseAddress 错误
 *  2 获取用户对小程序所授予获取地址的权限状态scope authSetting scope.address
 *    1 假设用户点击确定获取地址
 *      scrop值为true 直接调用获取收获地址
 *    2 假设从来没有调用过收货地址的api
 *      scrop值为undefined 直接调用获取收获地址
 *    3 假设用户点击取消获取地址
 *      scrop值为false
 *       1 引导用户自己打开授权设置页面wx.openSetting，当用户重新给与获取地址权限的时候
 *       2 获取收获地址
 *    4 把获取到的地址存入本地存储中
 * 2 页面加载完毕
 *  0 onLoad onShow
 *  1 获取本地存储中的数据
 *  2 把数据设置给data中的变量
 * 3 onShow
 *  0 回到了商品的详情也弥漫，第一次添加商品的时候，手动添加属性
 *    1 num=1
 *    2 checked=true
 *  1 获取缓存中的购物车数组
 *  2 把购物车数据填充到data中
 * 4 全选的实现 数据的展示
 *  1 onShow 获取缓存中的购物车数组
 *  2 根据购物车中的数据 所有的商品都被选中 checked=true 全选就被选中
 * 5 总价格和总数量
 *  1 都需要商品先选中再计算
 *  2 获取购物车数组，遍历
 *  3 判断商品是否被选中
 *  4 总价格 += 商品的单价 * 商品的数量
 *  5 总数量 += 商品的数量
 *  6 把计算后的价格和数量设置回data中即可
 * 6 商品的选中
 *  1 绑定change事件
 *  2 获取到被修改的商品对象
 *  3 商品对象的选中状态，取反
 *  4 重新填充回data中和缓存中
 *  5 重新计算全选，总价格，总数量
 * 7 全选和反选
 *  1 全选复选框绑定事件 change
 *  2 获取data中的全年选变量 allChecked
 *  3 直接解取反 allChecked=！allChecked
 *  4 遍历购物车数组，让里面商品选中状态跟随allChecked改变
 *  5 把购物车数组和allChecked重新设置回data中，购物车重新设置回缓存中
 * 8 商品数量的编辑功能
 *  1 + - 绑定同一个点击事件 区分的关键在于自定义 属性
 *    1 “+” “+1”
 *    2 “--” “-1”
 *  2 传递被点击的商品id goods_id
 *  3 获取到data中的购物车数组，来获取需要被修改的商品对象
 *  4 直接修改商品对象的数量的 num
 *    当购物车数量 =1 同时点击 - 弹窗提示是否删除
 *    1 确定删除
 *    2 不做
 *  5 把cart数组重新弄设置回缓存中和datat中 this.setCart
 * 9 点击结算
 *  1 有没有地址
 *  2 有没有商品
 *  3 经过验证跳转到支付页面
 */

import { getSetting, chooseAddress, openSetting, showModle, showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  // 点击 收货地址
  // handleChooseAddress(){
  // 1 获取权限状态
  // wx.getSetting({
  //   success: (result) => {
  //     // 2 获取权限状态 (当发现一些属性名很怪异，要是使[]来获取属性值）
  //     const scopeAddress = result.authSetting["scope.address"];
  //     if (scopeAddress === true || scopeAddress === undefined) {
  //       wx.chooseAddress({
  //         success: (result1) => {
  //           console.log(result1);
  //         }
  //       });
  //     } else {
  //       // 3 用户曾经拒绝授予权限，引导用户打开授权页面
  //       wx.openSetting({
  //         success: (result2) => {
  //           // 4 可以调用收获地址代码
  //           wx.chooseAddress({
  //             success: (result3) => {
  //               console.log(result3);
  //             }
  //           });
  //         }
  //       });
  //     }
  //   },
  // });

  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1 获取缓存中的收获地址
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart') || [];
    // // 计算全选
    // // every 数组方法，遍历，会接收一个回调函数，那么每一个回调函数都返回true，那么every为true
    // // 只要有一个false,那不再执行,直接返回false
    // // 空数组调用every,返回值为true
    // // const allChecked = cart.length?cart.every(v=>v.checked):false;
    // let allChecked = true;
    // // 总价格 总数量
    // let totalPrice = 0;
    // let totalNum = 0;
    // cart.forEach(v => {
    //   if (v.checked) {
    //     totalPrice += v.num * v.goods_price;
    //     totalNum += v.num;
    //   } else {
    //     allChecked = false;
    //   }
    // });
    // // 判断数组是否为空
    // allChecked = cart.length != 0 ? allChecked : false;
    // // 2 给data赋值
    // this.setData({
    //   address, cart, allChecked, totalNum, totalPrice
    // })
    this.setData({ address });
    this.setCart(cart);
  },

  async handleChooseAddress() {
    try {
      // 1 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2 判断权限状态
      if (scopeAddress === false) {
        // 引导用户打开授权页面
        await openSetting();
      } else {
        // 调用获取收获地址的api
        let address = await chooseAddress();
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        // 存入缓存中
        wx.setStorageSync('address', address)
      }
    } catch (error) {
      console.log(error);
    }
  },

  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart);
  },
  // 设置购物车状态同时，重新计算底部工具栏的数据，全选、总价格、购买的数量
  setCart(cart) {
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart, allChecked, totalPrice, totalNum
    });
    wx.setStorageSync('cart', cart);
  },

  //商品的全选功能 
  handleItemAllCheck() {
    // 1 获取data中的数据
    let { cart, allChecked } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 修改商品选中状态
    cart.forEach(v => {
      v.checked = allChecked
    });
    // 4 把修改后的值填充回data中或者缓存中
    this.setCart(cart);
  },

  // 商品数量的编辑
  async handleItemNumEdit(e) {
    // 获取传递来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModle({ content: "您是否删除商品？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 进行数量修改
      cart[index].num += operation;
      // 设置回内存和data中
      this.setCart(cart);
    }
  },

  // 结算
  async handlePay() {
    // 判断收获地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: "您还没有收货地址" })
      return;
    }
    // 判断用户是否选购
    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品" })
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})