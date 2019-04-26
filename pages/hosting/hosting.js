// pages/findjob/findjob.js
import data from '../findjob/data'
var app = getApp()
var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: 'e961bcd2085bf18bc65f068ea314ac08' });

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imagePath: app.globalData.serverUrl + app.globalData.apiVersion + 'server/image?md5=rujia',
    tubiao: app.globalData.serverUrl + app.globalData.apiVersion + 'server/image?md5=tubiao',
    latitude: '',
    longitude: '',
    options: data,
    city: '',
    items: [{
      type: 'text',
      label: '选择城市',
      value: 'city',
      groups: ['001'],
    },
    {
      type: 'text',
      label: '距离最近',
      value: 'near',
      groups: ['002'],
    },
    {
      type: 'text',
      label: '好评优先',
      value: 'praise',
      groups: ['003'],
    },
    {
      type: 'filter',
      label: '筛选',
      value: 'filter',
      children: [
      {
        type: 'checkbox',
        label: '收费方式',
        value: 'shoufei',
        children: [{
          label: '每小时',
          value: 'Per_Hour',
        },
        {
          label: '每天',
          value: 'Per_Day',
        },
        {
          label: '每月',
          value: 'Per_Month',
        },
        {
          label: '每学期',
          value: 'Per_Semester',
        },
        {
          label: '每季度',
          value: 'Per_Quarter'
        }
        ],
      },
      {
        type: 'checkbox',
        label: '招生年级',
        value: 'grade',
        children: [{
          label: '未上学',
          value: 'BS',
        },
        {
          label: '幼儿园小小班',
          value: 'KSSC',
        },
        {
          label: '幼儿园小班',
          value: 'KSC',
        },
        {
          label: '幼儿园中班',
          value: 'KMC',
        },
        {
          label: '幼儿园大班',
          value: 'KC',
        },
        {
          label: '一年级',
          value: 'GO',
        },
        {
          label: '二年级',
          value: 'GT',
        },
        {
          label: '三年级',
          value: 'GTH',
        },
        {
          label: '四年级',
          value: 'GF',
        },
        {
          label: '五年级',
          value: 'GFI',
        },
        {
          label: '六年级',
          value: 'GS',
        },
        {
          label: '初一',
          value: 'GSE',
        },
        {
          label: '初二',
          value: 'GE',
        },
        {
          label: '初三',
          value: 'GN',
        },
        {
          label: '高一',
          value: 'HO',
        },
        {
          label: '高二',
          value: 'HT',
        },
        {
          label: '高三',
          value: 'HTW',
        }]
      },
      {
        type: 'checkbox',
        label: '服务类型',
        value: 'type',
        children: [{
          label: '孩子看护',
          value: 'care',
        },
        {
          label: '课后辅导',
          value: 'after_class',
        },
        {
          label: '兴趣培养',
          value: 'intrest',
        }],
      }
      ],
      groups: ['001', '002', '003'],
    },
    ],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/image?md5=zhaotuoguan1'
    }, {
      id: 1,
      type: 'image',
      url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/image?md5=zhaotuoguan2',
    }, {
      id: 2,
      type: 'image',
      url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/image?md5=zhaotuoguan3'
    }],
  },

  /**
   * 用户选择城市，传送后台算法
   */
  onChange1(e) {
    var that = this
    var header = { 'content-type': 'application/json' }
    console.log('城市数据：', e.detail.options)
    if (e.detail.options.length % 2 === 0) {
      wx.showLoading()
      console.log('请求后端')
      wx.request({
        url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/hosting',
        method: 'POST',
        header: header,
        data: { 'sort': 'city', 'city': e.detail.options[1].label },
        success: function (res) {
          wx.hideLoading()
          console.log(res)
        },
        fail() {
          wx.hideLoading()
        }
      })
    }
  },

  onClose1() {
    this.setData({ visible: false })
  },

  /**
   * 距离最近算法
   */
  getRepos() {
    console.log('请求获取订单')
    var that = this
    var header = { 'content-type': 'application/json' }
    var data = { 'city': app.globalData.city, 'sort': 'city' }
    console.log(data)
    wx.showLoading()
    wx.request({
      url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/hosting',
      method: 'POST',
      header: header,
      data: data,
      success: (res) => {
        console.log(res)
        wx.hideLoading()
      },
    })
  },

  /**
   * 获取用户位置信息
   */
  reLocation: function () {
    console.log('请求获取地理位置')
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        myAmapFun.getRegeo({
          latitude: latitude,
          longitude: latitude,
          success: function (res) {
            var name = res[0].regeocodeData.addressComponent.city
            that.setData({
              city: name,
              latitude: latitude,
              longitude: longitude
            })
            wx.hideLoading()
          },
          fail() {
            wx.hideLoading()
          }
        })
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reLocation()
    //this.getRepos()
    this.towerSwiper('swiperList');
  },

  towerSwiper(name) {
    let list = this.data[name];
    console.log(list)
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },

  /**
   * 根据用户选择的算法，请求后端
   */
  onChange(e) {
    var that = this
    var latitude = that.data.latitude
    var longitude = that.data.longitude
    var city = that.data.city
    const { checkedItems, items } = e.detail
    const params = {}
    console.log(checkedItems, items)
    checkedItems.forEach((n) => {
      if (n.checked) {
        if (n.value === 'city') {
          console.log(items[0].label)
          that.setData({
            visible: true
          })
          console.log(that.data.visible)
        } else if (n.value === 'near') {
          var header = { 'content-type': 'application/json' }
          wx.showLoading()
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/hosting',
            method: 'POST',
            header: header,
            data: { 'latitude': latitude, 'longitude': longitude, 'sort': n.value, 'city': city },
            success: (res) => {
              console.log(res)
              wx.hideLoading()
            },
          })
        } else if (n.value === 'praise') {
          var header = { 'content-type': 'application/json' }
          wx.showLoading()
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/hosting',
            method: 'POST',
            header: header,
            data: { 'sort': n.value, 'city': city },
            success: (res) => {
              console.log(res)
              wx.hideLoading()
            },
          })
        } else if (n.value === 'filter') {
          n.children.filter((n) => n.selected).forEach((n) => {
            if (n.value === 'shoufei') {
              const shoufei = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.shoufei = shoufei
            } else if (n.value === 'grade') {
              const grade = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.grade = grade
            } else if (n.value === 'type') {
              const type = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.type = type
            }
          })
          var data = { 'shoufei': params.shoufei, 'grade': params.grade, 'type': params.type, 'sort': 'filter' }
          console.log(data)
          var header = { 'content-type': 'application/json' }
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/hosting',
            method: 'POST',
            header: header,
            data: data,
            success: function (res) {
              console.log(res)
            }
          })
        }
      }
    })

    //this.getRepos(params)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onOpen(e) {
    this.setData({
      pageStyle: 'height: 100%; overflow: hidden',
    })
  },
  onClose(e) {
    this.setData({
      pageStyle: '',
    })
  }
})