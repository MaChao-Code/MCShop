//同时发送异步代码的次数
let ajaxTime = 0;
export const request = (params) => {
    // 判断url中是否带有/my/ 请求的是私有路径，请求要带上header，token
    let header = {...params.header};
    if (params.url.includes("/my/")) {
        // 拼接header 带上token
        header["Authorization"] = wx.getStorageSync('token');
    }
    ajaxTime++;
    //显示加载中 效果
    wx - wx.showLoading({
        title: '加载中',
        mask: true
    })

    //定义公共url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fale: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTime--;
                //关闭正在等待图标
                if (ajaxTime === 0) {
                    wx - wx.hideLoading();
                }
            }
        })
    })
}