// zh_tcwq/pages/merchant/cash/cash.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open:false,
    kong:true,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
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
    // czhd
    app.util.request({
      'url': 'entry/wxapp/Czhd',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          czhd: res.data
        })
      }
    })
  },
   jsmj:function(num,arr){
    var index;
    for(let i=0;i<arr.length;i++){
      if (Number(num)>=Number(arr[i].full)){
         index=i;
         break;
      }
    }
    return index
  },
  bindInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      czje: e.detail.value
    })
    if (e.detail.value!=''){
       this.setData({
         kong:false,
       })
    }
    else{
      this.setData({
        kong: true,
      })
    }
  },
  tradeinfo:function(){
    var that=this;
    this.setData({
      open:!that.data.open
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail, e.detail.formId)
    var openid = wx.getStorageSync('openid'), money = e.detail.value.czje,czhd=this.data.czhd;
    var uid = wx.getStorageSync('users').id;
    console.log(czhd)
    if (czhd.length==0){
      var czmoney = money
    }
    else if (Number(money) >= Number(this.data.czhd[czhd.length-1].full)){
      var czhdindex = this.jsmj(money, czhd)
      console.log(czhdindex)
      var czmoney = Number(money) + Number(czhd[czhdindex].reduction)
    }
    else{
      var czmoney=money
    }
    console.log(openid,money,uid,czmoney)
    app.util.request({
      'url': 'entry/wxapp/pay',
      'cachetime': '0',
      data: { openid: openid, money: money },
      success: function (res) {
        console.log(res)
        // 支付
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            console.log(res)
            // Recharge
            app.util.request({
              'url': 'entry/wxapp/Recharge',
              'cachetime': '0',
              data: { user_id: uid, money:czmoney},
              success: function (res) {
                console.log(res)
                if(res.data==1){
                  wx.showToast({
                    title: '充值成功',
                    duration: 1000
                  })
                  setTimeout(function(){
                    wx.navigateBack({
                      
                    })
                  },1000)
                }
              }
            })
          },
          'complete': function (res) {
            console.log(res)
            wx.showToast({
              title: '取消支付',
            })
          }
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