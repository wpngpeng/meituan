//index.js
//获取应用实例
import api from '../../utils/request.js'
import cfg from '../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 1,
    rows: 10,
    isloading: false,
    isloadall: false,
    curCity: '北京'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dataList();
  },
  onShow: function () {
    let curCity = wx.getStorageSync('selCity');
    if (curCity) {
      this.setData({
        curCity
      })
    }
  },
  dataList() {
    let page = this.data.page;
    let rows = this.data.rows;
    api.post({
      //url: `${cfg.url}/shoplist`,
      url: `${cfg.url}/shoplist?page=` + this.data.page + '&' + 'rows=' + this.data.rows,
      params: {
        page,
        rows
      }
    }).then(res => {
      let dataList = res;
      if (dataList.length) {
        this.setData({
          dataList: this.data.dataList.concat(dataList),
          isloading: true
        })
      }
      if (res.error) {
        this.setData({
          isloading: false,
          isloadall: true
        })
      }
    }, err => {
      console.log(err);
    });

    // wx.request({
    //   url: 'https://www.koocv.com/article/shoplist?page=' + this.data.page +'&'+
    //    'rows='+ this.data.rows,
    //   method: 'post',
    //   data: {
    //     page: this.data.page,
    //     rows: this.data.rows
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: (res) => {
    //     let dataList = res.data;
    //     if (dataList.length) {
    //       this.setData({
    //         dataList: this.data.dataList.concat(dataList),
    //         isloading: true
    //       })
    //     }
    //     if(res.data.error){
    //       this.setData({
    //         isloading: false,
    //         isloadall: true
    //       })
    //     }
    //     console.log(this.data.isloadall);
    //   }
    // })
  },
  onScrolllower() {
    let page = this.data.page;
    this.setData({
      page: page + 1
    })
    this.dataList();
  }
 
})
