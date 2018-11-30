const baseURL = 'https://data.miaov.com';
// 封装request请求
function wxPromisify(url, method, header = {}, params = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: { ...params },
      method: method,
      header: header,
      success: res => {
        resolve(res.data)
      },
      fail: err => {
        console.log(err)
        reject(err)
      }
    })
  })
}
// 封装地址逆解析请求
function wxPromisMap(qqmapsdk, location) {
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location: location,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err)
      }
    });
  })
}
// 封装距离计算请求
function wxPromisDistance(qqmapsdk, fromLocation, toLocation) {
  return new Promise((resolve, reject) => {
    qqmapsdk.calculateDistance({
      from: fromLocation,
      to: toLocation,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

// 封装获取当前的地理位置请求
function wxPromisLocation(type) {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: type,
      success: (res) => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
// 封装登录
function loginInfo() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res)
          //发起网络请求
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }, fail: err => {
        reject(err)
      }
    })
  });
}
function login(userInfo) {
  return loginInfo()
    .then(res => {
      console.log(res);
      wx.request({
        url: 'https://wx.miaov.com/login',
        header: {
          'X-WX-Code': res.code,
          'X-WX-Encrypted-Data': userInfo.encryptedData,
          'X-WX-IV': userInfo.iv,
        },
        
      })
    })
    .then(res => {
      console.log(res);
      if (res.code === 0) {
        wx.setStorageSync('userInfo', res.data.userinfo);
        return res.data.userinfo;
      } else {
        throw res;
      }
    })
}
//  封装获取用户的当前设置
function getSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        resolve(res)
      }, fail: err => {
        reject(err)
      }
    })
  });
}
function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success(res) {
        resolve(res)
      }, fail: err => {
        reject(err)
      }
    })
  });
}
const get = ({ url, params }) => {
  return wxPromisify(url, 'GET', { 'Content-Type': 'json' }, params)
}
//post
const post = ({ url, params }) => {
  return wxPromisify(url, 'POST', { 'Content-Type': 'application/x-www-form-urlencoded' }, params)
}

module.exports = {
  get,
  post,
  wxPromisMap,
  wxPromisLocation,
  wxPromisDistance,
  login,
  getSetting,
  getUserInfo
}