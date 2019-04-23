// pages/teacher/score/score.js
var app= getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cArray: null,
    sArray: null,
    tArray:null,
    mArray:null,
    rArray:null,
    index:0,
    searchContent:null,
    cName: null,
    newMark:null,
    sId:null,
    title:null,
    tempFilePaths:null,
    hiddenClassMarkModal:true,
    hiddenAddClassMarkModal:true,
    hiddenClassMarkView:false,
    hiddenSearchResult:true,
    hiddenUpdateMarkModal:true,
    
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
  },
  onLoad: function () {
    var that = this;
    console.log(app.globalData.tId);
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/class',
      data: {
        tId: app.globalData.tId
      },
      success(res) {
        console.log(res);
        that.setData({ cArray: res.data.className, sArray: res.data.students });
      }
    })
  },

  searchInput: function(e) {
    console.log(e)
    this.setData({ searchContent: e.detail.value })
  },
  cNameInput:function(e){
    console.log(e)
    this.setData({cName:e.currentTarget.dataset.cname})
  }, 
  markInput: function(e) {
    console.log(e)
    this.setData({ newMark: e.detail.value })
  }, 
  titleInput: function(e) {
    console.log(e)
    this.setData({ title: e.detail.value })
  }, 
  showClassMark: function(e) {
    console.log(e);
    let that = this;
    this.setData({ cName: e.currentTarget.dataset.cname })
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/mark',
      data: { cName: e.currentTarget.dataset.cname },
      success(res){
        console.log(res),
        that.setData({mArray:res.data.marks,
                      tArray:res.data.title
        })
      }
    })
  },
  showClassMarkModal:function(e){
    this.setData({ hiddenClassMarkModal:false})
  },
  showAddClassMarkModal: function (e) {
    this.setData({ hiddenAddClassMarkModal: false })
  },
  showUpdateMarkModal: function(e) {
    console.log(e)
    this.setData({ hiddenUpdateMarkModal: false,
                   sId:e.currentTarget.dataset.sid,
                   title:e.currentTarget.dataset.title
     })
  },
  addClassMark:function(e){
    let that = this;
    console.log(this.data.tempFilePaths);
    wx.uploadFile({
      url: 'https://www.talkischeap0.cn/upload/uploadMarkTemplate',
      filePath: this.data.tempFilePaths,
      formData: { title:that.data.title },
      name: 'file',
      success(res) {
        console.log(res);
        that.setData({hiddenAddClassMarkModal:true});
        if(res.msg){
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          })
        }else{
          wx.showToast({
            title:res.msg,
            icon: 'success',
            duration: 1000
          })
        }

        that.onLoad();
      }
    })
  },
  backToScore:function(e){
    this.setData({ hiddenClassMarkModal: true,
                   hiddenAddClassMarkModal:true,
    })
  }, 
  backToClassMark: function(e) {
    this.setData({hiddenUpdateMarkModal:true })
  },
  downloadMarkTemplate:function(e){
    let downloadTask = wx.downloadFile({
      url: 'https://www.talkischeap0.cn/download/MarkTemplate',
      success(res) {
        console.log(res);
        const filePath = res.tempFilePath;
        const fileType = 'xlsx';
        wx.openDocument({
          filePath,
          fileType,
          success(res) {
            console.log('打开文档成功')
          },
          fail: function (res) {
            console.log('fail')
            console.log(res)
          },
        })
      }
    })
    downloadTask.onProgressUpdate((res) => {
      console.log('下载进度', res.progress)
      console.log('已经下载的数据长度', res.totalBytesWritten)
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    })
  },
  uploadMarkTemplate:function(e){
    let that = this;
    let cName = that.data.cName;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        console.log(res);
        that.setData({
            tempFilePaths: res.tempFiles[0].path
        });
      }
    });
  },
  updateStudentMark:function(e){
    let that = this;
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/updateMark',
      data:{sId:this.data.sId,
            title:this.data.title,
            newMark:this.data.newMark},
      success(res){
        console.log(res);
        that.setData({hiddenUpdateMarkModal:true});
        wx.request({
          url: 'https://www.talkischeap0.cn/teacher/mark',
          data: { cName: that.data.cName },
          success(res) {
            console.log(res),
              that.setData({ mArray: res.data })
          }
        });
        that.onLoad();
      }
    })
  },
  search:function(e){
    let that = this;
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/searchStudent',
      data:{condition:this.data.searchContent,
            tId:app.globalData.tId
      },
      success(res){
        console.log(res);
        that.setData({rArray:res.data})
      }
    })
  }
})