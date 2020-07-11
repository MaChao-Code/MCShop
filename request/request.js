//同时发送异步代码的次数
let ajaxTime = 0;
export const request = (params) => {
    ajaxTime++;
    //显示加载中
    wx - wx.showLoading({
        title: '加载中',
        mask: true
    })

    //定义公共url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
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