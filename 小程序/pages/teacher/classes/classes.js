// pages/teacher/classes/classes.js
var app = getApp();
Page({
  data:{
    tapIndex:null,
    touchStart:null,
    touchEnd:null,
    hiddenClassRegister: true,
    hiddenClassShow: true,
    hiddenClassUpdate: true,
    hiddenInform:true,
    hiddenUpload:true,
    hiddenTargetModalClass:true,
    hiddenTargetStudentModal:true,
    hiddenStudentUpdate:true,
    hiddenAddStudent:true,
    cName:null,
    cNewName:null,
    cArray:null,
    sArray: null,
    title:null,
    content:null,
    image:null,
    tempFilePaths:null,
    sId:null,
    sName:null,
    sNewName:null,
    sNewPwd:null,
    sNewClass:null
  },
  onPullDownRefresh: function () {
    this.onLoad();
    wx.stopPullDownRefresh()
  },
  showStudentUpdateAction:function(e){
    console.log(e);
    this.setData({ hiddenStudentUpdate: false, sname: e.currentTarget.dataset.sname});
  },
  studentUpdateCancel:function(e){
    this.setData({hiddenStudentUpdate:true})
  },
  sNewNameInput: function (e) {
    console.log(e);
    this.setData({ sNewName:e.detail.value})
  },
  sNewPwdInput: function (e) {
    this.setData({ sNewPwd: e.detail.value })
  },
  sNewClassInput: function (e) {
    this.setData({ sNewClass: e.detail.value })
  },
  showStudentAction: function (e) {
    console.log(e);
    this.setData({ sName: e.currentTarget.dataset.sname,sId:e.currentTarget.dataset.sid})
    var that = this;
    wx.showActionSheet({
      itemList: ['更改学生信息', '删除学生',],
      success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          that.setData({hiddenStudentUpdate:false})
        }
        else if(res.tapIndex == 1)
          {
          wx.request({
            url: 'https://www.talkischeap0.cn/teacher/deleteStudent',
            data: {
              tId: app.globalData.tId,
              sId:that.data.sId
            },
            success(res) {
              console.log(res);
              that.onLoad()
            }
          })
          }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  updateStudent:function(e){
    var that  = this;
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/updateStudent',
      data:{
            sId:this.data.sId,
            sName:this.data.sNewName,
            pwd:this.data.sNewPwd,
            cName:this.data.sNewClass
      },
      success(res){
        console.log(res);
        that.setData({hiddenStudentUpdate:true});
        that.onLoad()
      }
    })
  },
  showTargetStudentModal:function(e){
    var cArray = this.data.cArray;
    for(var i=0;i<this.data.cArray.length;i++){
      if(cArray[i].cname==e.currentTarget.dataset.cname){
        console.log(cArray[i]);
        if (cArray[i].checked == false) {
          this.setData({ hiddenTargetStudentModal: false, cName: e.currentTarget.dataset.cname });
          break;
        }
      }
    } 
    console.log(e);
  },
  targetStudentModalCancel:function(){
    this.setData({hiddenTargetStudentModal:true})
  },
  onLoad:function(){
    var that =this;
    console.log(app.globalData.tId);
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/class',
      data: {
        tId: app.globalData.tId
      },
      success(res) {
        console.log(res);
        for (let i = 0; i < res.data.className.length; i++) {
          res.data.className[i].checked = false;
          console.log(res.data.className[i].checked)
        }
        for (let i = 0; i < res.data.students.length; i++) {
          res.data.students[i].checked = false;
          console.log(res.data.students[i].checked)
        }
        that.setData({cArray: res.data.className,sArray:res.data.students});


      }
    })
  },
  addClassName:function(){
    let that  = this;
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/addClass',
      data: {
        tId: app.globalData.tId,
        cName:this.data.cNewName
      },
      success(res) {
        console.log(res);
        console.log(that);
        that.onLoad();
        that.setData({ hiddenClassRegister:true});
      }
    })
  },
  sIdInput:function(e){
    this.setData({sId:e.detail.value})
  },
  studentAddCancel:function(e){
    this.setData({ hiddenAddStudent: true})
  },
  showAddStudent:function(e){
    this.setData({hiddenAddStudent:false})
  },
  addStudent:function(e){
    var that = this;
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/addStudent',
      data:{sId:this.data.sId,
            sName:this.data.sNewName,
            pwd:this.data.sNewPwd,
            cName:this.data.cName
      },
      success(res){
        console.log(res);
        that.onLoad(  )
      }
    })
  },
  uploadS:function(){
    let that = this;
    let cName = that.data.cName;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        console.log(res);
        const filePath = res.tempFiles[0].path;
        console.log(filePath);
        wx.uploadFile({
          url: 'https://www.talkischeap0.cn/upload/uploadStuTemplate',
          filePath: filePath,
          formData: { cName: cName },
          name: 'file',
          success(res) {
            console.log(res);
            that.onLoad();
          }
        });
      }
    });
  },
  showTargetModalClass:function(e){
    this.setData({ hiddenTargetModalClass:false});
  },
  showInfoModal: function () {
    this.setData({ hiddenInform: false });
  },
  titleInput: function (e) {
    this.data.title = e.detail.value
  },
  contentInput: function (e) {
    this.data.content = e.detail.value
  },
  chooseImage:function(){
    var that = this;
    wx.chooseImage({
      count: 10,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        that.setData({tempFilePaths:res.tempFilePaths})
      }
    })
  },
  sendInfoToDatabase:function(){
    let  that = this;
    console.log(this.data.tempFilePaths.length);
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/infoText',
      data: { tId: app.globalData.tId,title:this.data.title,content:this.data.content},
      success(res){
        for (var i = 0; i < that.data.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: 'https://www.talkischeap0.cn/teacher/infoImage',
            filePath: that.data.tempFilePaths[i],
            name: 'Image',
            formData: { tId: app.globalData.tId, title: that.data.title, content: that.data.content },
            success(res) {
              console.log(res)
            }
          })
        }
      }
    })
  },
  checkboxClassChange:function(e){
    console.log(e);
    var cArray = this.data.cArray;
    for(var i  =0;i<cArray.length;i++){
      if (cArray[i].cname == e.currentTarget.dataset.cname) {
        cArray[i].checked = !cArray[i].checked
      }
      console.log(cArray[i].checked);
    };
    var sArray = this.data.sArray;
    for(var i = 0;i<sArray.length;i++){
      if (sArray[i].cName == e.currentTarget.dataset.cname){
        sArray[i].checked = !sArray[i].checked;
      }
      console.log(sArray[i].checked)
    }
  },
  checkboxStudentChange:function(e){
    console.log(e);
    var sArray = this.data.sArray;
    for (var i = 0; i < sArray.length; i++) {
      if (sArray[i].sName == e.currentTarget.dataset.sname) {
        sArray[i].checked = !sArray[i].checked;
      }
      console.log(sArray[i].checked)
    }
  },
  titleCheck:function(){
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/informCheck',
      data:{tId:app.globalData.tId,title:this.data.title},
      success(res){
        console.log(res)
      }
    })
  },
  cNewNameInput:function(e){
    console.log(e);
    this.setData({cNewName:e.detail.value})
  },
  touchStart:function(e){
    console.log(e);
    this.setData({touchStart:e.timeStamp})
  },
  touchEnd: function (e) {
    console.log(e);
    this.setData({ touchEnd: e.timeStamp })
  },
  classRegisterModal: function () {
    this.setData({
      hiddenClassRegister: !this.data.hiddenClassRegister
    })
  },
  classShowModal: function (e) {
    if(this.data.touchEnd-this.data.touchStart <=350){
      console.log(e);
      this.setData({
        hiddenClassShow: !this.data.hiddenClassShow,
        cName: e.currentTarget.dataset.param
      })
    } 
  },
  cancel: function () {
    this.setData({
      hiddenClassRegister: true,
      hiddenClassShow: true,
      hiddenClassUpdate: true,
      hiddenInform:true,
      hiddenTargetModalClass:true,
    });
  },
  confirm: function () {
    this.setData({
      hiddenClassRegister: true,
      hiddenClassShow: true,
    });
    this.onLoad()
  },
  cNameInput:function(e){
    this.setData({cName:e.detail.value})
  },
  updateClassName:function(){
    let that = this;
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/updateClassName',
      data: {
        cName: that.data.cName,
        cNewName: that.data.cNewName
      },
      success(res){
        console.log(res);
        that.setData({ hiddenClassUpdate: true });
        that.onLoad
      }
    })
  },
  downloadT:function(){
    const downloadTask = wx.downloadFile({
      url: 'https://www.talkischeap0.cn/download/stuTemplate', 
      success(res) {
        console.log(res);
        const filePath = res.tempFilePath;
        const fileType='xlsx';
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
  showClassAction:function(e){
    console.log(e);
    this.setData({ cName: e.currentTarget.dataset.param})
    var that = this;
    wx.showActionSheet({
      itemList: ['更改班级名', '删除班级',],
      success(res) {
        console.log(res.tapIndex);
        if(res.tapIndex==1){
          wx.request({
            url: 'https://www.talkischeap0.cn/teacher/deleteClass',
            data: {
              cName: that.data.cName,
            },
            success(res) {
              that.onLoad()
            }
          })
        }else
        that.setData({tapIndex:res.tapIndex,hiddenClassUpdate:false});
        that.onLoad()
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  }
})