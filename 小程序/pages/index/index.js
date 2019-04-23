// pages/index/index.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    message:'',
    tId:null,
    tName:null,
    tPwd:null,
  },

  onLoad: function (options) {
  },
  uIdInput: function (e) {
    this.setData({ tId: e.detail.value })
  },
  uNameInput:function(e){
    this.setData({tName:e.detail.value})
  },
  uPwdInput: function (e) {
    this.setData({ tPwd: e.detail.value })
  },
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  confirm: function () {
    var that = this;
    wx.request({
      url: 'https://www.talkischeap0.cn/register/teacherRegister',
      data:{
        tId: that.data.tId,
        tName: that.data.tName,
        pwd: that.data.tPwd
      },
      success(res) {
        console.log(res);
        if(res.data.flag == 1){
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            hiddenmodalput: true
          })
        }
      }
    })
  },
  loginCheck:function(e){
    let that = this;
    wx.request({
      url: 'https://www.talkischeap0.cn/check/teacherCheck',
      data: {
        tId: that.data.tId,
        pwd: that.data.tPwd
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        if(res.data.flag == '1'){
          app.globalData.tId=that.data.tId;
          wx.switchTab({
            url: '../teacher/classes/classes'
          })
        }else{
          that.setData({message:'用户名或密码错误'})
        }
      }
    })
  }
})