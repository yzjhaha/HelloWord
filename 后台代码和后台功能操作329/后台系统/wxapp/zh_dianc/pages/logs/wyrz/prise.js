// zh_hdbm/pages/logs/geren/geren.js
var app = getApp();
var siteinfo = require('../../../../siteinfo.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    in1: false,
    in2: false,
    in3: false,
    logg: false,
    log: false,
    lo: false,
    fwxy: true,
    yyzz:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.util.request({
      'url': 'entry/wxapp/system',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          rzxy: res.data.rzxy
        })
      },
    })
  },
  dingwei: function (e) {
    console.log(e)
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          sjdz: res.address + res.name,
        })
      }
    })
  }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  lookFwxy: function () {
    this.setData({
      fwxy: false
    })
  },
  queren: function () {
    this.setData({
      fwxy: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 点击选择图片
  choose: function (e) {
    var that = this
    console.log(siteinfo)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res.tempFilePaths)
        var path = res.tempFilePaths
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        })
        wx.uploadFile({
          url: siteinfo.siteroot + '?i=' + siteinfo.uniacid + '&c=entry&a=wxapp&do=upload&m=zh_dianc',
          filePath: res.tempFilePaths[0],
          name: 'upfile',
          success: function (res) {
            console.log(res);
            that.setData({
              yyzz:res.data
            })
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
              return;
            }
            that.setData({
              files: path,
            });
          },
          fail: function (e) {
            console.log(e);
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            })
          },
          complete: function () {
            wx.hideToast();  //隐藏Toast
          }
        })
      }
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var user_id = wx.getStorageSync('users').id, sjname = e.detail.value.sjname, sjdz = e.detail.value.sjdz, lxtel = e.detail.value.lxtel, faname = e.detail.value.faname;
    var yyzz=this.data.yyzz;
    console.log(user_id,sjname,sjdz,lxtel,faname,yyzz)
    var warn = "";
    var flag = true;
    if (sjname == "") {
      warn = "请填写商家名称！";
    } else if (lxtel == "") {
      warn = "请填写联系电话！";
    } else if (!(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(lxtel)) || lxtel.length != 11) {
      warn = "手机号错误！";
    } else if (faname == '') {
      warn = "请填写法定代表人姓名！";
    } else if (yyzz == '') {
      warn = "请上传营业执照图片！";
    } else {
      flag = false;//若必要信息都填写，则不用弹框
      app.util.request({
        'url': 'entry/wxapp/ruzhu',
        'cachetime': '0',
        data: { user_id: user_id, store_name: sjname, tel: lxtel, user_name: faname, img: yyzz, address:sjdz},
        success: function (res) {
          console.log(res)
          if (res.data == 1) {
            wx.showToast({
              title: '提交成功',
            })
            setTimeout(function () {
              wx.navigateBack({

              })
            }, 1000)
          }
          else {
            wx.showToast({
              title: '请重试！',
              icon: 'loading'
            })
          }
        }
      })
    }
    if (flag == true) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }
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