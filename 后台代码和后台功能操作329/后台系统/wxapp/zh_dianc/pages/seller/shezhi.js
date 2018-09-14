// zh_dianc/pages/seller/shezhi.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dpkg: false,
    txkg: false,
    dpkgtext: '店铺已关闭',
    txkgtext: '语音播报已关闭'
  },
  switch1Change: function (e) {
    var that = this;
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value) {
      //k
      app.util.request({
        'url': 'entry/wxapp/Open',
        'cachetime': '0',
        data: { store_id: sjdsjid },
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            that.setData({
              dpkg: true,
              dpkgtext: '店铺已开启'
            })
          }
          else {
            wx.showToast({
              title: '请重试',
              icon: 'loading'
            })
          }
        },
      })
    }
    else {
      //g
      app.util.request({
        'url': 'entry/wxapp/Close',
        'cachetime': '0',
        data: { store_id: sjdsjid },
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            that.setData({
              dpkg: false,
              dpkgtext: '店铺已关闭'
            })
          }
          else {
            wx.showToast({
              title: '请重试',
              icon: 'loading'
            })
          }
        },
      })
    }
  },
  switch2Change: function (e) {
    var that = this;
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    if (e.detail.value) {
      wx.setStorageSync('yybb', true)
      that.setData({
        txkg: true,
        txkgtext: '语音播报已开启'
      })
    }
    else {
      wx.removeStorageSync('yybb')
      that.setData({
        txkg: false,
        txkgtext: '语音播报已关闭'
      })
    }
  },
  tcdl: function () {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.removeStorageSync('sjdsjid')
          wx.switchTab({
            url: '../logs/logs',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();
    var that = this;
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    //商家信息
    app.util.request({
      'url': 'entry/wxapp/store',
      'cachetime': '0',
      data: { id: sjdsjid },
      success: function (res) {
        console.log(res)
        if (res.data.is_rest == '1') {
          that.setData({
            dpkg: false,
            dpkgtext: '店铺已关闭'
          })
        }
        if (res.data.is_rest == '2') {
          that.setData({
            dpkg: true,
            dpkgtext: '店铺已开启'
          })
        }
      },
    })
    if (wx.getStorageSync('yybb')) {
      that.setData({
        txkg: true,
        txkgtext: '语音播报已开启'
      })
    }
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