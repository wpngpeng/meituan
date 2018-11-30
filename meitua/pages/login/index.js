// pages/login/index.js
import api from '../../utils/request.js'
import cfg from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onGetUserInfo(e){
    console.log(e);
    if (e.detail.errMsg == "getUserInfo:ok"){
      api.login().
      then(res=>{
        return api.loginget({
          url: 'https://wx.miaov.com/login',
          header: {
            'X-WX-Code': res.code,
            'X-WX-Encrypted-Data': e.detail.encryptedData,
            'X-WX-IV': e.detail.iv,
          }
        })
      }).then(res=>{
        if (res.code === 0) {
          wx.setStorageSync('userInfo', res.data.userinfo);
          return res.data.userinfo;
        } else {
          throw res;
        }
      })
    }
  }
})
