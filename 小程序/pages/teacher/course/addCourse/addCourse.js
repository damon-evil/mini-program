Page({

	data: {
		cname:null,
		courseName: null,
		tName: null,
		classRoom: null,
		ps:null,
		weekArray: [{
				name: 1,
				value: 1
			},
			{
				name: 2,
				value: 2
			},
			{
				name: 3,
				value: 3
			},
			{
				name: 4,
				value: 4
			},
			{
				name: 5,
				value: 5
			},
			{
				name: 6,
				value: 6
			},
			{
				name: 7,
				value: 7
			},
			{
				name: 8,
				value: 8
			},
			{
				name: 9,
				value: 9
			},
			{
				name: 10,
				value: 10
			},
			{
				name: 11,
				value: 11
			},
			{
				name: 12,
				value: 12
			},
			{
				name: 13,
				value: 13
			},
			{
				name: 14,
				value: 14
			},
			{
				name: 15,
				value: 15
			},
			{
				name: 16,
				value: 16
			},
			{
				name: 17,
				value: 17
			},
			{
				name: 18,
				value: 18
			},
			{
				name: 19,
				value: 19
			},
			{
				name: 20,
				value: 20
			},
		],
		weekSelectedArr: [],
		hiddenWeekCheckbox: true,
		oddSelected: false,
		evenSelected: false,
		selectedAll: false,
		lessonArray: [
			['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			['第一节', '第二节', '第三节', '第四节', '第五节']
		],
		multiIndex: [0, 0],
	},
	//取出选中班级
	onLoad(options){
		this.setData({
			cname:options.cname
		})
	},
	//展开周数选框
	showCheckboxWeek() {
		this.setData({
			hiddenWeekCheckbox: false
		})
	},
	//取消
	cancel() {
		this.setData({
			hiddenWeekCheckbox: true
		})
	},
	//确认
	confirm(e){
		this.setData({
			hiddenWeekCheckbox: true
		})
	},
	//选中周数
	weekCheck(e) {
		console.log(e)
		let that = this,
			index = e.currentTarget.dataset.index,
			value = e.currentTarget.dataset.value,
			weekArray = that.data.weekArray,
			val = weekArray[index].selected,
			arr = that.data.weekSelectedArr;
		if (!val) {
			arr.push(value);
		} else {
			for (var i in arr) {
				if (arr[i] == value) {
					arr.splice(i, 1);
				}
			}
		}
		weekArray[index].selected = !val;
		that.setData({
			weekArray: weekArray,
			arr: arr
		})
	},
	//选中和取消单周操作
	oddWeek(e) {
		console.log(e)
		let arr = this.data.weekArray,
			arr1 = [],
			val = this.data.oddSelected;
		for (let i = 0; i < arr.length;) {
			if (!val) {
				arr[i].selected = true
			} else {
				arr[i].selected = false
			}
			i += 2
		}
		for (let i in arr) {
			if (arr[i].selected == true) {
				arr1.push(arr[i].value)
			}
		}
		this.setData({
			weekArray: arr,
			weekSelectedArr: arr1,
			oddSelected: !val
		})
	},
	//选中和取消双周操作
	evenWeek(e) {
		console.log(e)
		let arr = this.data.weekArray,
			arr1 = [],
			val = this.data.evenSelected;
		for (let i = 1; i < arr.length;) {
			if (!val) {
				arr[i].selected = true
			} else {
				arr[i].selected = false
			}
			i += 2
		}
		for (let i in arr) {
			if (arr[i].selected == true) {
				arr1.push(arr[i].value)
			}
		}
		this.setData({
			weekArray: arr,
			weekSelectedArr: arr1,
			evenSelected: !val
		})
	},
	//全选操作
	selectAll(e) {
		console.log(e)
		let arr = this.data.weekArray,
			arr1 = [],
			val = this.data.selectedAll;
		for (let i = 0; i < arr.length; i++) {
			if (!val) {
				arr[i].selected = true
			} else {
				arr[i].selected = false
			}
		}
		for (let i in arr) {
			if (arr[i].selected == true) {
				arr1.push(arr[i].value)
			}
		}
		this.setData({
			weekArray: arr,
			weekSelectedArr: arr1,
			selectedAll: !val
		})
	},
	//节数多项选择器操作
	lessonChange(e){
		console.log(e.detail.value)
		this.setData({
			multiIndex:e.detail.value
		})
	},
	//添加课程请求
	addCourse(e){
		wx.request({
			url:'https://www.talkischeap0.cn/course/addCourse',
			data:{
				cname:this.data.cname,
				courseName:this.data.courseName,
				tName:this.data.tName,
				classRoom:this.data.classRoom,
				week:this.data.weekSelectedArr,
				lesson:this.data.multiIndex,
				ps:this.data.ps
			},
			success(res){
				console.log(res)
				if(res.data.flag==1){
					wx.navigateTo({
						url:'../course'
					})
				}
			}
		})
	},
	//读取输入并更改data数据
	courseName(e){
		this.setData({
			courseName:e.detail.value
		})
	},
	tName(e){
		this.setData({
			tName:e.detail.value
		})
	},
	classRoom(e){
		this.setData({
			classRoom:e.detail.value
		})
	},
	ps(e){
		this.setData({
			ps:e.detail.value
		})
	},
})
