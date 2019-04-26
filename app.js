//app.js
const cookieUtil = require('utils/cookie.js')
const app = getApp()

App({
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    wx.checkSession({
      success(){
        if (cookieUtil.getCookieFromStorage()) {
          that.globalData.auth.isAuthorized = true
        }  
      }
    })
    
    wx.getUserInfo({
      success: function(res){
        console.log('success')
        that.globalData.userInfo = res.userInfo
      },
      fail: function(res){
        console.log('fail')
      }
    })

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res.authSetting)
      }
    })
  },
  getAuthStatus: function () {
    return this.globalData.auth.isAuthorized
  },

  setAuthStatus: function (status) {
    console.log('set auth status: ' + status)
    if (status == true || status == false) {
      this.globalData.auth.isAuthorized = status
      if(status == false){
        this.globalData.userInfo = null
      }
    } else {
      console.log('invalid status.')
    }

  },

  setCity(city){
    if (city){
      this.globalData.city = city
    }
  },

  globalData: {
    userInfo: null,
    appId: 'wxe013d3a5f9577a34',
    serverUrl: 'http://192.168.43.202:8000',
    apiVersion: '/api/v1.0/',
    city: '',
    auth: {
      isAuthorized: false
    }
  }
})