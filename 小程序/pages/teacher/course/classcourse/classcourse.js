// pages/teacher/course/classcourse/classcourse.js
var app = getApp();
Page({

	data: {
		weekArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		index: 0,
		indexClass: 0,
		lesson: [1, 2, 3, 4, 5],
		month: null,
		courseList: null,
		currentCourseList:[],
		cname: null,
		classArray: null,
		touchStart:null,
		touchEnd:null
	},

	onLoad(options) {
		console.log(options);
		let date = new Date();
		console.log(date);
		console.log(date.getMonth() + 1);
		this.setData({
			month: date.getMonth() + 1,
			cname: options.cname
		});
		let that = this;
		wx.request({
			url: 'https://www.talkischeap0.cn/course/queryCourseList',
			data: {
				tId: app.globalData.tId
			},
			success(res) {
				console.log(res)
				let y = 0;
				for(y = 0;y<res.data.cNameList.length;y++){
					if(res.data.cNameList[y].cName==options.cname){
						that.setData({
							courseList:res.data.courseList[y]
						})
						break
					}
				}
				let arr1=[];
				for (let j = 0; j < 5; j++) {
				  let arr0 = [];
				  for (let i = j; i < 35 ; i += 5) {
				    arr0.push(res.data.courseList[y][i]);
				  }
				  arr1.push(arr0);
				};
				that.setData({
					currentCourseList:arr1
				})
			}
		});	
		console.log(this.data.courseList)
	},
	bindPickerChange(e) {
		console.log(e)
		this.changeCurrentCourse(this.data.courseList,e.detail.value)
		this.setData({
			index: e.detail.value
		})
	},
	changeCurrentCourse(arr,week){
		console.log(week)
		this.setData({
			currentCourseList:[]
		})
		let arr1=[];
		for (let j = 0; j < 5; j++) {
		  let arr0 = [];
		  for (let i = 35 * parseInt(week) + j; i < 35 * (parseInt(week)+1); i += 5) {
		    arr0.push(arr[i]);
		  }
		  arr1.push(arr0);
		};
		this.setData({
			currentCourseList:arr1
		})
		console.log(this.data.currentCourseList)
	},
	editCourse(e){
		console.log(e)
		if(this.data.touchEnd-this.data.touchStart <=350){
			if(e.currentTarget.dataset.coursename==''){
				wx.navigateTo({
					url:'../addCourse/addCourse?cname='+this.data.cname
				})
			}else{
				wx.navigateTo({
					url:'../editCourse/editCourse?cname='+this.data.cname+'&courseName='+e.currentTarget.dataset.coursename
				})
			}	
		}
	},
	touchStart:function(e){
	  console.log(e);
	  this.setData({touchStart:e.timeStamp})
	},
	touchEnd: function (e) {
	  console.log(e);
	  this.setData({ touchEnd: e.timeStamp })
	},
	deleteCourse(e){
		console.log(e)
		wx.showModal({
			title: '提示',
			content: '确认删除该课程信息?',
			success(res) {
				if (res.confirm) {
					console.log('用户点击确定')
					wx.request({
						url:'https://www.talkischeap0.cn/course/deleteCourse',
						data:{
							cName:this.data.cname,
							courseName:e.currentTarget.dataset.coursename
						},
						success(res){
							console.log(res)
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	}
})
