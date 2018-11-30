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
    category_id: '',
    distance: '500',
    sort: 'distance',
    filterType: '',
    isloading: false,
    isloadall: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dataList(options.id);
    this.setData({
      category_id: options.id
    })
  },
  dataList(id) {
    let { page, rows, distance, sort } = this.data;
    api.post({
      //url: `${cfg.url}/shoplist`,
      url: `${cfg.url}/shoplist?page=` + this.data.page + '&' + 'rows=' + this.data.rows,
      params: {
        page,
        rows,
        category_id: id,
        distance,
        sort
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
  },
  onScrolllower() {
    let page = this.data.page;
    let id = this.data.category_id;
    this.setData({
      page: page + 1
    })
    this.dataList(id);
  },
  onSelectTap(e) {
    let { type } = e.target.dataset;
    if (this.data.filterType === type) {
      this.setData({
        filterType: ''
      })
    } else {
      this.setData({
        filterType: type
      })
    }

  },
  onValueTap(e) {
    let { type } = e.currentTarget.dataset
    let { value } = e.target.dataset
    if (type === 'range') {
      this.setData({
        distance: value,
        page: 1
      })
    }
    if (type === 'sort') {
      this.setData({
        sort: value,
        page: 1
      })
    }
    let id = this.data.category_id;
    this.dataList(id);
    this.setData({
      filterType: '',

    })
  }
})
