import { request } from "../../request/request.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncWx.js";

Page({
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // 1 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2 获取小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // 3 发送请求，获取用户的token值
      // const { token } = await request({ url: "users/wxlogin", data: loginParams, method: "post" });
      // 因为没有企业账号，先自己设置一个tiken
      const token = "qwertyuiop123456";
      // 4 把token存入缓存中，同时跳转回上一个页面
      wx.getStorageSync('token', token);
      wx.navigateBack({
        delta: 1
      })
      console.log(token);
    } catch (error) {
      console.log(error);
    }

  }

})