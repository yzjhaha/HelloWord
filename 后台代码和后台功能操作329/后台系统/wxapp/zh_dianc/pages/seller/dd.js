// zh_dianc/pages/seller/dd.js
var app = getApp();
var dsq;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    tabs: ['待接单', '待配送', '退款订单','已完成'],
    activeIndex: 0,
    isuu:false,
    fwxy: true,
  },
  lookck: function (e) {
    var that=this;
    var oid = e.currentTarget.dataset.oid,istake = e.currentTarget.dataset.istake;
    console.log(oid,istake)
    if (istake == '2') {
      this.setData({
        fwxy: false
      })
      // GetOrderPrice
      app.util.request({
        'url': 'entry/wxapp/GetOrderPrice',
        'cachetime': '0',
        data: { order_id: e.currentTarget.dataset.oid },
        success: function (res) {
          console.log(res)
          console.log('uu信息', JSON.parse(res.data))
          that.setData({
            uuinfo: JSON.parse(res.data),
            oid:oid,
          })
        }
      })
    }
    else{
      wx.showModal({
        title: '提示',
        content: '确定接单吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.util.request({
              'url': 'entry/wxapp/JieOrder',
              'cachetime': '0',
              data: { order_id: oid },
              success: function (res) {
                console.log(res)
                if (res.data == 1) {
                  wx.showToast({
                    title: '接单成功',
                    duration: 1000,
                  })
                  setTimeout(function () {
                    that.reLoad()
                  }, 1000)
                }
              },
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  qx: function () {
    this.setData({
      fwxy: true,
      uuinfo: '',
    })
  },
  queren: function () {
    var that = this;
    var oid = this.data.oid, uuinfo=this.data.uuinfo;
    console.log(oid, uuinfo)
    if(uuinfo!=null){
      app.util.request({
        'url': 'entry/wxapp/UuAddOrder',
        'cachetime': '0',
        data: { order_id: oid, price_token: uuinfo.price_token, total_money: uuinfo.total_money, need_paymoney: uuinfo.need_paymoney },
        success: function (res) {
          console.log(res, JSON.parse(res.data))
          if (JSON.parse(res.data).return_code == 'ok' && JSON.parse(res.data).return_msg == '订单发布成功') {
            wx.showToast({
              title: '接单成功',
              duration: 1000,
            })
            that.setData({
              fwxy: true,
              uuinfo: '',
            })
            setTimeout(function () {
              that.reLoad()
            }, 1000)
          }
          else if (JSON.parse(res.data).return_msg == '账户余额不足，请使用在线支付方式'){
            wx.showToast({
              title: '账户余额不足',
              icon: 'loading',
            })
            that.setData({
              fwxy: true,
              uuinfo: '',
            })
          }
          else{
            wx.showToast({
              title: '网络错误',
              icon:'loading',
            })
            that.setData({
              fwxy: true,
              uuinfo: '',
            })
          }
        },
      })
    }
    else{
      wx.showToast({
        title: '网络错误',
      })
    }
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  dw:function(e){
    console.log(e.currentTarget.dataset)
   wx.openLocation({
     latitude: Number(e.currentTarget.dataset.lat),
     longitude: Number(e.currentTarget.dataset.lng),
     scale: 28,
     address: e.currentTarget.dataset.wz
   })
  },
  tel:function(e){
    console.log(e.currentTarget.dataset.tel)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  jied:function(e){
    var that=this;
    var oid = e.currentTarget.dataset.oid;
    console.log(oid);
    wx.showModal({
      title: '提示',
      content: '确定接单吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/JieOrder',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res)
              if (res.data == 1) {
                wx.showToast({
                  title: '接单成功',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  wcps:function(e){
    var that = this;
    console.log('完成配送' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定完成配送吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Complete',
            'cachetime': '0',
            data: { id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  tgtk: function (e) {
    var that = this;
    console.log('通过退款' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定通过退款吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Tg',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  jjtk: function (e) {
    var that = this;
    console.log('拒绝退款' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定拒绝退款吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Jj',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  scdd: function (e) {
    var that = this;
    console.log('删除订单' + e.currentTarget.dataset.oid)
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            'url': 'entry/wxapp/Del',
            'cachetime': '0',
            data: { order_id: e.currentTarget.dataset.oid },
            success: function (res) {
              console.log(res.data)
              if (res.data == '1') {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 1000,
                })
                setTimeout(function () {
                  that.reLoad()
                }, 1000)
              }
              else {
                wx.showToast({
                  title: '请重试',
                  icon: 'loading',
                  duration: 1000,
                })
              }
            },
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
    var that=this;
    if (options.activeIndex){
      this.setData({
        activeIndex: parseInt(options.activeIndex)
      })
    }
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    // Store
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: sjdsjid },
      success: function (res) {
        console.log('商家信息',res)
        if (res.data.ps_mode=='3'){
          that.setData({
            isuu:true,
          })
        }
      }
    })
    //提醒
    if (wx.getStorageSync('yybb')) {
      dsq = setInterval(function () {
        app.util.request({
          'url': 'entry/wxapp/NewOrder',
          'cachetime': '0',
          data: { store_id: sjdsjid },
          success: function (res) {
            console.log(res)
            if (res.data == 1) {
              wx.playBackgroundAudio({
                dataUrl: wx.getStorageSync('url2') + 'addons/zh_dianc/template/images/wm.wav',
              })
            }
          },
        })
      }, 10000)
    }
    this.reLoad()
  },
  reLoad:function(){
    app.editTabBar();
    var sjdsjid = wx.getStorageSync('sjdsjid')
    console.log(sjdsjid)
    var that = this;
    //商家订单
    app.util.request({
      'url': 'entry/wxapp/StoreOrder',
      'cachetime': '0',
      data: { store_id: sjdsjid },
      success: function (res) {
        console.log(res)
        var djd = [], dps = [], tkdd = [],ywc=[];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].order.state == '2') {
            djd.push(res.data[i])
          }
          if (res.data[i].order.state == '3') {
            dps.push(res.data[i])
          }
          if (res.data[i].order.state == '7' || res.data[i].order.state == '8' || res.data[i].order.state == '9') {
            tkdd.push(res.data[i])
          }
          if (res.data[i].order.state == '4' || res.data[i].order.state == '6') {
            ywc.push(res.data[i])
          }
        }
        console.log(djd, dps, tkdd,ywc)
        that.setData({
          djd: djd,
          dps: dps,
          tkdd: tkdd,
          ywc:ywc
        })
      },
    })
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
    clearInterval(dsq)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     this.reLoad();
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