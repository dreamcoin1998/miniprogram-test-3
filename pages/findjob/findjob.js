// pages/findjob/findjob.js
import data from './data'

var app = getApp()
var amapFile = require('../../libs/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: 'e961bcd2085bf18bc65f068ea314ac08' });

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sort: 'city',
    thumb: app.globalData.serverUrl + app.globalData.apiVersion + 'server/job?md5=',
    latitude: '',
    longitude: '',
    options: data,
    city: '重新定位',
    items: [{
      type: 'radio',
      label: '综合',
      value: 'zonghe',
      children: [{
        label: '薪资降序',
        value: 'down',
      },
      {
        label: '薪资升序',
        value: 'up',
      },
      ],
      groups: ['001'],
    },
    {
      type: 'text',
      label: '距离',
      value: 'near',
      groups: ['002'],
    },
    {
      type: 'text',
      label: '评分',
      value: 'praise',
      groups: ['003'],
    },
    {
      type: 'filter',
      label: '筛选',
      value: 'filter',
      children: [{
        type: 'checkbox',
        label: '学历要求',
        value: 'education',
        children: [{
          label: '大专以上',
          value: 'Dazhuan',
        },
        {
          label: '本科以上',
          value: 'Benke',
        }
        ],
      },
      {
        type: 'checkbox',
        label: '性别要求',
        value: 'gender',
        children: [{
          label: '只限男生',
          value: 'Man',
        },
        {
          label: '只限女生',
          value: 'Woman',
        },
        {
          label: '男女不限',
          value: 'bouble',
        }],
      },
      {
        type: 'radio',
        label: '薪酬范围（月）',
        value: 'salary',
        children: [{
          label: '0-800',
          value: '1',
        },
        {
          label: '800-1500',
          value: '2',
        },
        {
          label: '1500-3000',
          value: '3',
        },
        {
          label: '3000-5000',
          value: '4',
        },
        {
          label: '5000-10000',
          value: '5',
        },
        {
          label: '10000以上',
          value: '6',
        }]
      },
      {
        type: 'checkbox',
        label: '工作类型',
        value: 'type',
        children: [{
          label: '全职',
          value: 'Full_Time',
        },
        {
          label: '兼职',
          value: 'Part_Time',
        }],
      },
      {
        type: 'checkbox',
        label: '结算方式',
        value: 'pay_type',
        children: [{
          label: '日结',
          value: 'Day',
        },
        {
          label: '周结',
          value: 'Week',
        },{
          label: '月结',
          value: 'Month'
        },{
          label: '学期',
          value: 'Term'
        }],
      }
      ],
      groups: ['001', '002', '003'],
    },
    ],
    job: []
  },

  /**
   * 用户选择城市，传送后台算法
   */
  onChange1(e) {
    var that = this
    var header = { 'content-type': 'application/json' }
    console.log('城市数据：', e.detail.options)
    if (e.detail.options.length % 2 ===0){
      wx.showLoading()
      console.log('请求后端')
      wx.request({
        url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/getjob',
        method: 'POST',
        header: header,
        data: { 'sort': 'city', 'city': e.detail.options[1].label },
        success: function(res){
          wx.hideLoading()
          that.setData({
            job: res.data.data
          })
          console.log(res)
        },
        fail(){
          wx.hideLoading()
        }
      })
    }
  },

  onClose1() {
    this.setData({ visible: false })
  },

  /**
   * 用户当前综合排序算法
   */
  getRepos(params = {}) {
    var that = this
    var sort = 'city'
    var city = app.globalData.city
    const language = params.language || 'javascript'
    const query = params.query || 'react'
    const q = `${query}+language:${language}`
    const data = Object.assign({
      q,
    }, params)

    wx.showLoading()
    wx.request({
      url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/getjob' + '?sort=' + sort + '&city=' + city,
      method: 'GET',
      data,
      success: (res) => {
        console.log(res)
        that.setData({
          job: res.data.data
        })
        wx.hideLoading()
      },
      fail(){
        wx.hideLoading()
      }
    })
  },

  /**
   * 获取用户地理位置
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
            app.setCity(name)
            console.log(app.globalData.city)
            that.setData({
              latitude: latitude,
              longitude: longitude,
              city: name
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
    this.getRepos() //页面默认为距离最近算法
  },

  /**
   * 根据用户选择的算法，请求后端
   */
  onChange(e) {
    var that = this
    var latitude = that.data.latitude
    var longitude = that.data.longitude
    const { checkedItems, items } = e.detail
    const params = {}
    var city = app.globalData.cit
    console.log(checkedItems, items)

    checkedItems.forEach((n) => {
      if (n.checked) {
        if (n.value === 'zonghe') {
          const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
          params.order = selected
          wx.showLoading()
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/getjob' + '?sort=zhonghe' + '&city=' + app.globalData.city + '&value=' + selected,
            method: 'GET',
            data,
            success: (res) => {
              console.log(res)
              that.setData({
                job: res.data.data
              })
              wx.hideLoading()
            },
            fail() {
              wx.hideLoading()
            }
          })
        } else if (n.value === 'near') {
          var header = { 'content-type': 'application/json' }
          wx.showLoading()
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/getjob',
            method: 'POST',
            header: header,
            data: {'latitude': latitude, 'longitude': longitude, 'sort': n.value, 'city': app.globalData.city},
            success: (res) => {
              console.log(res)
              that.setData({
                job: res.data.data
              })
              wx.hideLoading()
            },
            fail(){
              wx.hideLoading()
            }
          })
        } else if (n.value === 'praise') {
          var header = { 'content-type': 'application/json' }
          wx.showLoading()
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/getjob',
            method: 'POST',
            header: header,
            data: { 'sort': n.value, 'city': app.globalData.city },
            success: (res) => {
              console.log(res),
              that.setData({
                job: res.data.data
              })
              wx.hideLoading()
            },
            fail(){
              wx.hideLoading()
            }
          })
        } else if (n.value === 'filter') {
          n.children.filter((n) => n.selected).forEach((n) => {
            if (n.value === 'education') {
              const education = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.education = education
            } else if (n.value === 'subject') {
              const subject = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.subject = subject
            } else if (n.value === 'salary') {
              const salary = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.salary = salary
            } else if (n.value === 'type') {
              const type = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.type = type
            }
          })
          var data = { 'education': params.education, 'subject': params.subject, 'salary': params.salary, 'type': params.type, 'sort': 'filter' }
          console.log(data)
          var header = { 'content-type': 'application/json' }
          wx.showLoading()
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/getjob',
            method: 'POST',
            header: header,
            data: data,
            success: function(res){
              console.log(res),
              that.setData({
                job: res.data.data
              })
              wx.hideLoading()
            },
            fail(){
              wx.hideLoading()
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
    this.reLocation()
    this.getRepos()
    wx.stopPullDownRefresh()
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