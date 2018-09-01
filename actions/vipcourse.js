import DB from '@DB'
import UUID from 'uuid/v1'

// 接收课程详情数据
const RECEIVECOURSEDEL = 'receiveCourseDtl'
// 获得课程详情数据
const UPDATECOURSEDEL = 'updateCourseDtl'
// 新增内容信息
const ADDCONTENT = 'addContent'
// 修改内容信息
const UPDATECONTENT = 'updateContent'
// 删除内容信息
const REMOVECONTENT = 'removeContent'


// 接收课程详情数据
export const receiveCourseDtl = (data) => {
	return {
		type: RECEIVECOURSEDEL,
		data:data
	}
}

// 获得课程详情数据
export const getCourseDtl = (id) => (dispatch, getState)=>{
	return DB.course.VipCourseDtl({
		q:id
	})
	.then( (res)=> {
        dispatch(receiveCourseDtl({
			name:'haha',
			describe:'我是藐视',
			start_time:(new Date).valueOf(),
			end_time:(new Date).valueOf(),
			type:'分类二',
			typeList:['分类一','分类二','分类三'],
			payType:1,
			currentPrice:'111',
			originPrice:'222',
			peopleNum:111,
			teacher:'老王',
			teacherList:['老张','老王','老李'],
			contentList:[{
				title:'哈哈',
				start_time:(new Date).valueOf(),
				end_time:(new Date).valueOf(),
				describe:'我是描述啊',
				teacherList:['老张','小王','小米'],
				teacher:'小王',
			},{
				title:'哈哈',
				start_time:(new Date).valueOf(),
				end_time:(new Date).valueOf(),
				describe:'我是描述啊',
				teacherList:['老张','小王','小米'],
				teacher:'小王',
			}],
			loading:false,
		}))
    });
}

// 修改课程详情
export const updateCourseDtl = (data) => {
	return {
		type: UPDATECOURSEDEL,
		data:data
	}
}




// 新增内容信息
export const addContent = () => {
	return {
		type: ADDCONTENT
	}
}

// 修改内容信息
export const updateContent = (data) => {
	return {
		type: UPDATECONTENT,
		data:data
	}
}

// 删除内容信息
export const removeContent = (data) => {
	return {
		type: REMOVECONTENT,
		data:data
	}
}







// export const ACTION_HANDLERS = {
// 	[RECEIVECOURSEDEL]: (state , { data }) => {
// 		return {
// 			...state,
// 			...data,
// 		}
// 	},
// 	[UPDATECOURSEDEL]: (state , { data }) => {
// 		return {
// 			...state,
// 			...data,
// 		}
// 	},
// 	[ADDCONTENT]: (state , { }) => {
// 		return {
// 			...state,
// 			contentList:[...state.contentList,{}]
// 		}
// 	},
// }

















// 接收课程详情数据
const RECEIVEVIPDATA = 'receiveVipData'


// 新增一个内容的对象，只是在前台，并未向后台同步新增。
const ADDVIPCONTENTOBJ = 'addVipContentObj'
// 新增VIP课程的内容信息
const ADDVIPCONTENT = 'addVipContent'
// 删除VIP课程的内容信息
const REMOVEVIPCONTENT = 'removeVipContent'
// 新增VIP课程的附件
const ADDVIPCANNEX = 'addVipAnnex'
// 删除VIP课程的附件
const REMOVEVIPCANNEX = 'removeVipAnnex'

// 接收vip课程详情数据
export const receiveVipData = (data) => {
	return {
		type: RECEIVEVIPDATA,
		data:data
	}
}

// 新增一个内容的对象，只是在前台，并未向后台同步新增。
export const addVipContentObj = (data) => {
	return {
		type: ADDVIPCONTENTOBJ,
		data:data
	}
}

// 新增vip课程的内容信息
export const addVipContent = (data) => {
	return {
		type: ADDVIPCONTENT,
		data:data
	}
}

// 删除vip课程的内容信息
export const removeVipContent = (data) => {
	return {
		type: REMOVEVIPCONTENT,
		data:data
	}
}

// 新增vip课程的附件
export const addVipAnnex = (data) => {
	return {
		type: ADDVIPCANNEX,
		data:data
	}
}

// 删除vip课程的附件
export const removeVipAnnex = (uuid,url) => {
	return {
		type: REMOVEVIPCANNEX,
		data:{
			uuid,
			url,
		}
	}
}







export const ACTION_HANDLERS = {
	[RECEIVEVIPDATA]: (state , { data }) => {
		return {
			...state,
			...data,
		}
	},
	[ADDVIPCONTENTOBJ]: (state , { data }) => {
		return {
			...state,
			courses:[...state.courses, {
				uuid:UUID(),
				edit:true
			}]
		}
	},
	[ADDVIPCONTENT]: (state , { data }) => {
		const { uuid, ...other } = data
		return {
			...state,
			courses:state.courses.map((item)=>{
				if(uuid === item.uuid) {
					return {
						...item,
						...other,
					}
				}else{
					return item
				}
			})
		}
	},
	// 删除vip内容，仅本地删除
	[REMOVEVIPCONTENT]: (state , { data }) => {
		return {
			...state,
			courses:state.courses.filter((item)=>item.uuid !== data)
		}
	},
	[ADDVIPCANNEX]: (state , { data }) => {
		const { uuid, annexUrl } = data
		return {
			...state,
			courses: state.courses.map((item)=>{
				if(item.uuid === uuid) {
					const annex = !item.annex ? [annexUrl] : [...item.annex,annexUrl];
					item.annex = annex;
					return item
				}else{
					return item;
				}
			})
		}
	},
	[REMOVEVIPCANNEX]: (state , { data }) => {
		const { uuid,url } = data;
		return {
			...state,
			courses: state.courses.map((item)=>{
				if(item.uuid === uuid) {
					const annex = item.annex.filter(item2=>{
						return item2 !== url
					})
					const tem = item;
					tem.annex = annex;
					return tem;
				}else{
					return item
				}
			})
		}
	},
}
