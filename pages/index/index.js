//index.js
//获取应用实例
const app = getApp()
const cookieUtil = require('../../utils/cookie.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.auth.isAuthorized) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("有没有数据：", this.data.hasUserInfo, "有没有登陆：", app.globalData.auth.isAuthorized)
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  turn_ticket(){
    wx.navigateTo({
      url: '/pages/ticket/ticket'
    })
  },

  turn_chat: function(){
    wx.navigateTo({
      url: '/pages/service/service'
    })
  },

  turn_order: function(){
    wx.navigateTo({
      url: '/pages/order/order'
    })
  },

  turn_recruitment(){
    wx.navigateTo({
      url: '/pages/recruitment/recruitment'
    })
  },

  turn_baby: function(){
    wx.navigateTo({
      url: '/pages/postbaby/postbaby'
    })
  },

  onGetUserInfo: function (e) {
    wx.showLoading()
    if (!this.logged && e.detail.userInfo) {
      var that = this
      var userInfo = e.detail.userInfo
      app.globalData.userInfo = userInfo
      that.setData({
        touxiang: userInfo.avatarUrl
      })
      wx.login({
        success: function (res) {
          var code = res.code
          var appId = app.globalData.appId
          var nickName = app.globalData.userInfo.nickName
          wx.request({
            url: app.globalData.serverUrl + app.globalData.apiVersion + 'server/auth',
            method: 'POST',
            data: {
              code: code,
              appId: appId,
              nickName: nickName
            },
            header: {
              "content-type": "application/json"
            },
            success: function (res) {
              console.log('返回请求：', res)
              wx.hideLoading()
              wx.showToast({
                title: '授权成功',
              })
              var cookie = cookieUtil.getSessionIDFromResponse(res)
              cookieUtil.setCookieToStorage(cookie)
              that.setData({
                hasUserInfo: true,
                userInfo: app.globalData.userInfo
              })
              app.setAuthStatus(true)
              wx.switchTab({
                url: '/pages/index/index'
              })
            },
            fail(){
              wx.hideLoading()
              wx.showToast({
                title: '授权失败',
                icon: 'none'
              })
            }
          })
        },
        fail(){
          wx.hideLoading()
        }
      })
    }
  },

  logout: function () {
    var that = this
    var cookie = cookieUtil.getCookieFromStorage()
    var header = {}
    header.Cookie = cookie
    wx.request({
      url: app.globalData.serverUrl + app.globalData.apiVersion + 'auth/logout',
      method: 'GET',
      header: header,
      success(res) {
        app.setAuthStatus(false)
        that.setData({
          isLogin: false,
          userInfo: null,
          hasUserInfo: false
        })
        cookieUtil.setCookieToStorage('')
        app.setAuthStatus(false)
      }
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
