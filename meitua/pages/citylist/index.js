// pages/citylist/index.js
let cityData = require('./cityData.js');
import api from '../../utils/request.js'
let QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'SPJBZ-DLDCX-UN44J-7N44E-GP2I2-IHBG5' // 必填
});
Page({
  letterInfo: [],
  /**
   * 页面的初始数据
   */
  data: {
    cityData: cityData,
    cityID: '',
    loacteCity: '--',
    hasLocation: true,
    historyCity: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    this.getLocation();
    let historyCity = wx.getStorageSync('historyCity');
    if (historyCity) {
      this.setData({
        historyCity
      })
    }
  },
  onReady() {
    wx.createSelectorQuery().selectAll('.selectItem').boundingClientRect(rect => {
      this.letterInfo = rect.map(item => {
        return {
          top: item.top,
          bottom: item.bottom,
          id: item.id
        }
      })
    }).exec();
  },
  onLetterTap({
    target
  }) {
    let type = target;
    if (type.dataset.type !== "cityCheck") {
      return
    }
    this.currentID = type.id
    this.setData({
      cityID: `city-to-${type.id}`
    })
  },
  onLetterMove(e) {
    let {
      clientY
    } = e.touches[0];
    let letter = this.letterInfo.find(item => {
      return clientY > item.top && clientY < item.bottom;
    });

    if (letter && this.currentID !== letter.id) { // 滚动到的id与当前选中的id一致才走下面流程

      this.currentID = letter.id;
      this.setData({
        cityID: `city-to-${letter.id}`
      })
    }
  },
  // 定位
  getLocation() {
    return api.wxPromisLocation('gcj02').then(res => {
      return {
        latitude: res.latitude,
        longitude: res.longitude
      }
    }).then(location => {
      let reverseGeocoder = api.wxPromisMap(qqmapsdk, location); // 地址逆解析
      return Promise.all([
        reverseGeocoder
      ])

    }).then(([res]) => {
      let {
        city
      } = res.result.address_component;
      this.setData({
        loacteCity: city,
        hasLocation: true
      })
    })
      .catch(e => {
        if (e.errMsg === 'getLocation:fail auth deny') {
          this.setData({
            hasLocation: false
          })
        }
      })
  },
  onSelectCity({ target }) {  // 选中城市
    let { name } = target.dataset;
    if (!name) {
      return
    }
    let { historyCity } = this.data;
    console.log(historyCity);
    let fiterCity = historyCity.filter(item => {
      return item !== name
    })
    let citys = [
      name,
      ...fiterCity
    ];
    console.log(citys);
    wx.setStorageSync('historyCity', citys.slice(0, 3));
    console.log(1);
    wx.setStorageSync('selCity', name);
    wx.navigateBack();
  },

  onHistoryCity() {

  }
})