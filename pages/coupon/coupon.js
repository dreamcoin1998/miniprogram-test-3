// pages/coupon/coupon.js
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
    swiperList: [{
      id: 0,
      type: 'image',
      url: ''
    }]
  },

  /**
   * 下载小程序领券中心图片
   */
  downimage() {
    var that = this
    wx.downloadFile({
      url: imageUrl + '?md5=coupon',
      success(res) {
        that.setData({
          swiperList: [{
            id: 0,
            type: 'image',
            url: res.tempFilePath
          }]
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.downimage()
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

  }
})