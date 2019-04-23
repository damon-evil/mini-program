// pages/teacher/course/course.js
var app = getApp();
Page({
  data: {
    cName:null,
    week:1,
    day:null,
    lesson:null,
    courseList:null,
    classArray:null,
		touchStart:null,
		touchEnd:null,
		hiddenCourseListDelete:true,
  },
  onLoad(){
    let that = this;
    wx.request({
      url: 'https://www.talkischeap0.cn/course/queryCourseList',
      data: { tId: app.globalData.tId },
      success(res){
        console.log(res)
        that.setData({
          courseList:res.data
        })
      }
    });
    wx.request({
      url: 'https://www.talkischeap0.cn/teacher/class',
      data:{ tId:app.globalData.tId },
      success(res){
        console.log(res);
        that.setData({
          classArray:res.data.className
        })
      }
    })
  },
  classCourse(e){
		console.log(e);
		this.setData({
			cName: e.currentTarget.dataset.cname,
		})
		console.log(e);
		this.setData({
			cName:e.currentTarget.dataset.cname
		})
		wx.navigateTo({
			url: 'classcourse/classcourse?cname=' + e.currentTarget.dataset.cname,
		})
  },
	deleteCourseList(e){
		console.log(e)
		wx.showModal({
			title:'提示',
			content:'是否确认清空该班级课表?',
			success(res){
				if(res.confirm){
					wx.request({
						url:'https://www.talkischeap0.cn/course/deleteCourseList',
						data:{ cName:e.currentTarget.dataset.cname},
						success(res){
							console.log(res)
						}
					})
				}
			}
		})
	}
})