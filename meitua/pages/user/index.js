// pages/user/index.js
import api from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getSetting().then(res => {
      console.log(res);
      if (res.authSetting['scope.userInfo']) {
        return api.getUserInfo()
      } else {
        throw new Error('没有授权用户信息');
      }
    }, err => {
      console.log(err);
    })
  },
  bindGetUserInfo({detail}) {
    console.log(detail);
    if (detail.errMsg == "getUserInfo:ok") {
      console.log(detail);
      api.login(detail).then(res => {
        this.setData({
          isLogin: true,
          user: res
        })
      }, err => {
        console.log(err);
      });
    }
  }
})