/**
 * primise形式 getSetting
 */
export const getSetting = () => {
  return new Promise((reslove, reject) => {
    wx.getSetting({
      success: (result) => {
        reslove(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/**
 * primise形式 chooseAddress
 */
export const chooseAddress = () => {
  return new Promise((reslove, reject) => {
    wx.chooseAddress({
      success: (result) => {
        reslove(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/* 
* primise形式 openSetting
*/
export const openSetting = () => {
  return new Promise((reslove, reject) => {
    wx.openSetting({
      success: (result) => {
        reslove(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
/* 
* primise形式 showModle
* @Param {object} param0 参数
*/
export const showModle = ({ content }) => {
  return new Promise((reslove, reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      success: (res) => {
        reslove(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/* 
* primise形式 showToast
* @Param {object} param0 参数
*/
export const showToast = ({ title }) => {
  return new Promise((reslove, reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      success: (res) => {
        reslove(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/* 
* primise形式 login
*@Param {object} param0 参数
*/
export const login = () => {
  return new Promise((reslove, reject) => {
    wx.login({
      timeout: 10000,
      success: (res) => {
        reslove(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

/* 
* primise形式 小程序微信支付
* @Param {object} pay 参数 支付所必要的参数
*/
export const requestPayment = (pay) => {
  return new Promise((reslove, reject) => {
    wx.requestPayment({
      ...pay,
      success: (result) => {
        reslove(result)
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}