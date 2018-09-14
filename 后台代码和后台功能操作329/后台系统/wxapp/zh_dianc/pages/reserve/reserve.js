// pages/reserve/reserve.js
var app = getApp()
var form_id;
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    index: 0,
    jindex:0,
    time: '12:00',
    array: [],
    jcrsarray: ['1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人', '10人以上',],
    showModal: false,
    zftype: true,
    zfz: false,
    zflx:'wxzf',
  },
  xszz: function () {
    this.setData({
      showModal: true,
    })
  },
  yczz: function () {
    this.setData({
      showModal: false,
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      zflx: e.detail.value
    })
    if (e.detail.value == 'wxzf') {
      this.setData({
        zftype: true,
      })
    }
    if (e.detail.value == 'yezf') {
      this.setData({
        zftype: false,
      })
    }
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindjcrsChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      jindex: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this
    form_id = e.detail.formId
    that.setData({
      form_id: form_id
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var array = this.data.array
    console.log(array)
    if(array.length==0){
      wx.showModal({
        title: '提示',
        content: '商家暂未添加桌位类型，暂时不能预定',
      })
      return 
    }
    var openid = wx.getStorageSync('openid')
    var sjname = this.data.store.name
    var uid = wx.getStorageSync('users').id;
    var storeid = this.data.store.id;
    var date = e.detail.value.datepicker, time = e.detail.value.timepicker, zwtype = e.detail.value.zwpicker.name,
      zwid = e.detail.value.zwpicker.id, zdxf = e.detail.value.zwpicker.zd_cost, lxr = e.detail.value.lxr, jcrs = e.detail.value.jcrs, tel = e.detail.value.tel, ydcost = parseFloat(e.detail.value.zwpicker.yd_cost),
      beizhu = e.detail.value.beizhu;
    console.log(openid,sjname,uid, storeid, date, time, zwtype, zwid, lxr, jcrs, tel,ydcost, beizhu)
    that.setData({
      ydcost:ydcost,
      forminfo: e.detail.value
    })
    var warn = "";
    var flag = true;
    if (lxr == "") {
      warn = "请填写您的姓名！";
    } else if (jcrs == '') {
      warn = "请选择您的就惨人数"
    } else if (tel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(tel))) {
      warn = "手机号格式不正确";
    } else {
      flag = false;
      if (form_id == '') {
        wx: wx.showToast({
          title: '网络不好',
          icon: 'loading',
          duration: 500,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        // if (that.data.store.is_yypay == '1') {}
           if(ydcost>0){
             that.setData({
               showModal: true,
             })
           }
           else{
             app.util.request({
               'url': 'entry/wxapp/Reservation',
               'cachetime': '0',
               data: {
                 store_id: storeid, user_id: uid, xz_date: date, yjdd_date: time,
                 table_type_id: zwid, table_type_name: zwtype, zd_cost: zdxf, link_name: lxr, link_tel: tel, jc_num: jcrs, remark: beizhu, money: ydcost, ydcode:''
               },
               success: function (res) {
                 console.log(res)
                 if (res.data != '预定失败') {
                   wx.showModal({
                     title: '提示',
                     content: '预约成功等待审核',
                     showCancel:false,
                   })
                   setTimeout(function () {
                     wx.redirectTo({
                       url: 'reserveinfo?ydid=' + res.data,
                     })
                   }, 1000)
                   //发邮件
                   if (that.data.ptxx.is_email == '1') {
                     app.util.request({
                       'url': 'entry/wxapp/email',
                       'cachetime': '0',
                       data: { store_id: storeid, type: '预约' },
                       success: function (res) {
                         console.log(res)
                       },
                     })
                   }
                   //发短信 
                   app.util.request({
                     'url': 'entry/wxapp/sms2',
                     'cachetime': '0',
                     data: { store_id: storeid },
                     success: function (res) {
                     },
                   })
                   //发模板消息
                   app.util.request({
                     'url': 'entry/wxapp/Message3',
                     'cachetime': '0',
                     data: {
                       openid: openid, form_id: form_id, xz_date: date, store_name: sjname, yjdd_date: time,
                       link_name: lxr, link_tel: tel, jc_num: jcrs, remark: beizhu
                     },
                     success: function (res) {
                       console.log(res)
                     },
                   })
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
           } 
      }
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
  },
  qdzf:function(){
    this.setData({
      zfz: true,
    })
    var that = this;
    var forminfo=this.data.forminfo,zflx=this.data.zflx;
    var openid = wx.getStorageSync('openid')
    var sjname = this.data.store.name
    var uid = wx.getStorageSync('users').id;
    var storeid = this.data.store.id;
    var date = forminfo.datepicker, time = forminfo.timepicker, zwtype = forminfo.zwpicker.name,
      zwid = forminfo.zwpicker.id, zdxf = forminfo.zwpicker.zd_cost, lxr = forminfo.lxr, jcrs = forminfo.jcrs, tel = forminfo.tel, ydcost = parseFloat(forminfo.zwpicker.yd_cost),beizhu = forminfo.beizhu;
    console.log(openid, sjname, uid, storeid, date, time, zwtype, zwid, lxr, jcrs, tel, ydcost, beizhu)
    console.log(forminfo,form_id,zflx)
      if (zflx == 'yezf'){
          var ye = Number(this.data.wallet), money = Number(this.data.ydcost);
          console.log(ye, money)
          if (ye < money) {
            wx.showToast({
              title: '余额不足支付',
              icon: 'loading',
            })
            that.setData({
              zfz: false,
            })
            return
          }
        
               console.log('余额支付流程')
               app.util.request({
                         'url': 'entry/wxapp/Reservation',
                         'cachetime': '0',
                         data: {
                           store_id: storeid, user_id: uid, xz_date: date, yjdd_date: time,
                           table_type_id: zwid, table_type_name: zwtype, zd_cost: zdxf, link_name: lxr, link_tel: tel, jc_num: jcrs, remark: beizhu, money: ydcost, ydcode: '',is_yue:1
                         },
                         success: function (res) {
                           console.log(res)
                           if (res.data != '预定失败') {
                             wx.showModal({
                               title: '提示',
                               content: '预约成功等待审核',
                               showCancel: false,
                             })
                             that.setData({
                               showModal: false,
                             })
                             setTimeout(function () {
                               wx.redirectTo({
                                 url: 'reserveinfo?ydid=' + res.data,
                               })
                             }, 1000)
                             //发邮件
                             if (that.data.ptxx.is_email == '1') {
                               app.util.request({
                                 'url': 'entry/wxapp/email',
                                 'cachetime': '0',
                                 data: { store_id: storeid, type: '预约' },
                                 success: function (res) {
                                   console.log(res)
                                 },
                               })
                             }
                             //发短信 
                             app.util.request({
                               'url': 'entry/wxapp/sms2',
                               'cachetime': '0',
                               data: { store_id: storeid },
                               success: function (res) {
                               },
                             })
                             //发模板消息
                             app.util.request({
                               'url': 'entry/wxapp/Message3',
                               'cachetime': '0',
                               data: {
                                 openid: openid, form_id: form_id, xz_date: date, store_name: sjname, yjdd_date: time,
                                 link_name: lxr, link_tel: tel, jc_num: jcrs, remark: beizhu
                               },
                               success: function (res) {
                                 console.log(res)
                               },
                             })
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
             }
             else{
               console.log('微信支付流程')
               app.util.request({
                 'url': 'entry/wxapp/pay2',
                 'cachetime': '0',
                 data: { openid: openid, money: ydcost },
                 success: function (res) {
                   console.log(res)
                   that.setData({
                         showModal: false,
                       })
                   var ydcode = res.data.b
                   // 支付
                   wx.requestPayment({
                     'timeStamp': res.data.a.timeStamp,
                     'nonceStr': res.data.a.nonceStr,
                     'package': res.data.a.package,
                     'signType': res.data.a.signType,
                     'paySign': res.data.a.paySign,
                     'success': function (res) {
                       console.log(res)
                       wx.showToast({
                         title: '支付成功',
                         duration: 1000
                       })
                       console.log(that.data.store)
                       app.util.request({
                         'url': 'entry/wxapp/Reservation',
                         'cachetime': '0',
                         data: {
                           store_id: storeid, user_id: uid, xz_date: date, yjdd_date: time,
                           table_type_id: zwid, table_type_name: zwtype, zd_cost: zdxf, link_name: lxr, link_tel: tel, jc_num: jcrs, remark: beizhu, money: ydcost, ydcode: ydcode,is_yue:2
                         },
                         success: function (res) {
                           console.log(res)
                           if (res.data != '预定失败') {
                             wx.showModal({
                               title: '提示',
                               content: '预约成功等待审核',
                               showCancel: false,
                             })
                             setTimeout(function () {
                               wx.redirectTo({
                                 url: 'reserveinfo?ydid=' + res.data,
                               })
                             }, 1000)
                             //发邮件
                             if (that.data.ptxx.is_email == '1') {
                               app.util.request({
                                 'url': 'entry/wxapp/email',
                                 'cachetime': '0',
                                 data: { store_id: storeid, type: '预约' },
                                 success: function (res) {
                                   console.log(res)
                                 },
                               })
                             }
                             //发短信 
                             app.util.request({
                               'url': 'entry/wxapp/sms2',
                               'cachetime': '0',
                               data: { store_id: storeid },
                               success: function (res) {
                               },
                             })
                             //发模板消息
                             app.util.request({
                               'url': 'entry/wxapp/Message3',
                               'cachetime': '0',
                               data: {
                                 openid: openid, form_id: form_id, xz_date: date, store_name: sjname, yjdd_date: time,
                                 link_name: lxr, link_tel: tel, jc_num: jcrs, remark: beizhu
                               },
                               success: function (res) {
                                 console.log(res)
                               },
                             })
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
                     },
                     'complete': function (res) {
                       console.log(res)
                       wx.showToast({
                         title: '取消支付',
                         icon:'loading'
                       })
                       that.setData({
                         zfz: false,
                       })
                     }
                   })
                 },
               })
             }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var end =util.formatTime(new Date).substring(0, 10).replace(/\//g, "-");
    console.log(end.toString())
    this.setData({
      date:end
    })
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          ptxx: res.data
        })
        if (res.data.is_yue == '1') {
          that.setData({
            kqyue: true
          })
        }
        else {
          that.setData({
            kqyue: false
          })
        }
      },
    })
    var user_id = wx.getStorageSync('users').id
    // 积分
    app.util.request({
      'url': 'entry/wxapp/UserInfo',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
        console.log(res)
        that.setData({
          wallet: res.data.wallet
        })
      }
    })
    app.util.request({
      'url': 'entry/wxapp/TableType',
      'cachetime': '0',
      data:{store_id:getApp().sjid},
      success: function (res) {
        console.log(res)
        that.setData({
          array: res.data
        })
      },
    })
    app.util.request({
      'url': 'entry/wxapp/Store',
      'cachetime': '0',
      data: { id: getApp().sjid },
      success: function (res) {
        console.log(res)
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: res.data.color,
        })
        that.setData({
          store: res.data,
          color:res.data.color
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
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