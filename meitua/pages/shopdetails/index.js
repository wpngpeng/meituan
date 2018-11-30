// pages/shopdetails/index.js
import api from '../../utils/request.js'
import cfg from '../../utils/util.js'
let QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'SPJBZ-DLDCX-UN44J-7N44E-GP2I2-IHBG5' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList: [],
    address: '',
    distance: '',  // 计算距离
    isLocation: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dataList(options.id);
  },
  dataList(id) {
    api.post({
      url: `${cfg.url}/detail?id=` + id,
      params: {
        id
      }
    }).then(res => {
      if (!res.error) {
        this.setData({
          infoList: res.info
        });
        return {
          latitude: res.info.lat,
          longitude: res.info.lng
        }
      } else {
        throw '获取商铺详情失败'
      }
    })
      .then(location => {
        let reverseGeocoder = api.wxPromisMap(qqmapsdk, location); // 地址逆解析
        return Promise.all([
          reverseGeocoder,
          this.getLocation(location), // from 地址 
          // api.wxPromisLocation('gcj02'),  // from 地址
          location                        // to 地址
        ])
      }).then(([shopAddress, myLocation, toLocation]) => {
        if (shopAddress.status == 0) {
          this.setData({
            address: shopAddress.result.address
          })
        }
      })
  },
  onShow: function () {
    let { infoList } = this.data;
    let arr = Object.keys(infoList);  // 判断对象是否为空
    if (arr.length) {
      this.getLocation({
        latitude: infoList.lat,
        longitude: infoList.lng
      })
    }
  },
  // 获取距离封装
  getLocation(toLocation) {
    return api.wxPromisLocation('gcj02')
      .then(myLocation => {
        this.setData({
          isLocation: true
        })
        let from = {    // from 地址
          latitude: myLocation.latitude,
          longitude: myLocation.longitude
        }
        // to 地址  因为接口问题，现在就先用个死数据代替，正式使用用toLocation参数替换就好了
        let toLocations = [{  
          latitude: 39.9 + Math.random() / 10,
          longitude: 116.2 + Math.random() / 10
        }]
        return api.wxPromisDistance(qqmapsdk, from, toLocations);
      }).then(res => {
        if (res.status == 0) {
          this.setData({
            distance: res.result.elements[0].distance
          })
        }
      }).catch(e => {
        if (e.errMsg === 'getLocation:fail auth deny') {
          this.setData({
            isLocation: false
          })
        }
        if (e.status === 373) {
          this.setData({
            distance: -1
          })
        }
      })
  },
  // 收藏店铺
  onUserInfo(){
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.navigateTo({
        url: '/pages/login/index'
      })
    }
    
  }

})
