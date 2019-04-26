// pages/homepage/homepage.js
var amapFile = require('../../libs/amap-wx.js');
var app = getApp()
var myAmapFun = new amapFile.AMapWX({ key: 'e961bcd2085bf18bc65f068ea314ac08' });
var markers = []
var imageUrl = app.globalData.serverUrl + app.globalData.apiVersion + 'server/image'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagePath: app.globalData.serverUrl + app.globalData.apiVersion + 'server/image?md5=rujia',
    touxiang: '',
    city: '重新定位',
    markers: [],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://www.jintuoguan.com/image/smallbanner_2.jpg'
    }, {
      id: 1,
      type: 'image',
        url: 'http://www.jintuoguan.com/image/smallbanner_1.jpg',
    }, {
      id: 2,
      type: 'image',
        url: 'http://www.jintuoguan.com/image/smallbanner_3.jpg'
    }],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    iconList: [],
    gridCol: 3,
    skin: false,
    touxiang: ''
  },

  /**
   * 下载小程序logo图片
   */
  downimage(){
    if (!app.globalData.userInfo) {
      var that = this
      wx.downloadFile({
        url: imageUrl + '?md5=logo',
        success(res){
          that.setData({
            touxiang: res.tempFilePath
          })
        } 
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.towerSwiper('swiperList');
    var that = this;
    that.reLocation()
    that.downimage()
    that.set_touxiang()
    that.setData({
      iconList: [{
        icon: 'goods',
        color: 'red',
        badge: 120,
        name: '找工作',
        url: '/pages/findjob/findjob'
      }, {
        icon: 'baby',
        color: 'orange',
        badge: 1,
        name: '找托管',
          url: '/pages/hosting/hosting'
        }, {
          icon: 'ticket',
          color: 'brown',
          badge: 1,
          name: '领券中心',
          url: '/pages/coupon/coupon'
        }
      ]
    })
  },

  turn_jog:function(){
    wx.navigateTo({
      url: '/pages/findjob/findjob'
    })
  },

  turn_coupon(){
    wx.navigateTo({
      url: '/pages/coupon/coupon',
    })
  },

  turn_hosting: function () {
    wx.navigateTo({
      url: '/pages/hosting/hosting'
    })
  },

  // 将用户的位置信息发送到后台
  send_location: function (latitude, longitude) {
    var header = { 'content-type': 'application/json' }
    var data = { 'latitude': latitude, 'longitude': longitude }
    console.log(data.constructor)
    wx.request({
      url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/location',
      method: 'POST',
      header: header,
      data: data
    })
  },

  reLocation: function(){
    var that = this
    wx.showLoading({
      title: '获取位置信息',
      success:function(){
        wx.getLocation({
          success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            that.send_location(latitude, longitude)
            myAmapFun.getRegeo({
              latitude: latitude,
              longitude: latitude,
              success: function (res) {
                var name = res[0].regeocodeData.addressComponent.city
                app.setCity(name)
                console.log(app.globalData.city)
                console.log('城市', name)
                that.setData({
                  city: name
                })
                wx.hideLoading()
              }
            })
          },
          fail: function(){
            wx.hideLoading()
            wx.showToast({
              title: '获取位置信息失败，请打开GPS或授权位置信息',
              icon: 'none',
              duration: 2500
            })
          }
        })
      }
    })
    
  },

  set_touxiang:function(){
    var that = this
    if (app.globalData.userInfo) {
      console.log('set_touxiang 执行')
      that.setData({
        touxiang: app.globalData.userInfo.avatarUrl
      })
    }
  },

  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },

  dakai:function(){
    var that = this
    wx.showLoading({
      title: '获取位置信息',
      success: function(){
        wx.getLocation({
          type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
          success(res) {
            wx.chooseLocation({
              success: function (res) {
                that.send_location(res.latitude, res.longitude)
                that.setData({
                  city: res.name
                })
              }
            })
            wx.hideLoading()
          },
          fail: function () {
            wx.hideLoading()
          }
        })
      }
    })
  },

  openSetting(){
    wx.openSetting()
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
    this.set_touxiang()
    this.reLocation()
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

  }
})