import React, {Component} from 'react'
import DB from '@DB'

import {Link} from 'react-router-dom'
import {
    Button,
    Table,
    Modal,
    Input,
    AutoComplete,
    DatePicker,
    notification,
    Pagination,
    Form,
    Popconfirm,
	Select,
    message,
} from 'antd'
import moment from 'moment'
const FormItem = Form.Item;
import SearchBar from '@modules/SearchBar'
import JSON2EXCEL from '@modules/Export'
const Option = Select.Option
import FileUpload from '@modules/FileUpload'

class Import extends Component {
	constructor(props) {
        super(props);
		this.state = {
			// 控制录入弹框的显示与隐藏
			visible:false,

			// 课程列表
			courseList:[],
			// 订单列表
			orderList:[],
			// 讲师列表
			teacherList:[],

			// 录入订单时输入的数据临时保存的变量
			create_time:'',
			phone:'',
			goods_id:'',
			amount:'',

			// 分页信息
			pageCount:10,
			pageNum:1,

			// 点击了正在导入
			isImport:false,

			// 搜索条件
			searchs:{},

			// 数据正在查询中
			loading:false,
            edit:{},
            upload:{},
		}


    }

	componentDidMount(){
		DB.Order.getCourseList().then(data=>{
			let courseList = data.map((item,index)=>{
				return {
					key:index,
					value:item._id,
					text:item.title,
				}
			})
			this.setState({
				courseList,
			})
		},err=>{
			notification.error({
				message: '警告',
				description: err.errorMsg,
			});
		})

		this.getOrderList()
		// this.getTeacherList()
	}

	// getTeacherList = () =>{
	// 	DB.course.teacherList()
	// 	.then(data=>{
	// 		this.setState({
	// 			teacherList:data,
	// 		})
	// 	},err=>{
	// 		notification.error('获取教师列表失败')
	// 	})
	// }

	getOrderList =(pageNum,searchs ={})=>{
		this.setState({
			loading:true,
		})
		DB.Order.getOrderList({
			...searchs,
			pageNum:pageNum||this.state.pageNum,
			pageCount:this.state.pageCount,
		}).then(data=>{
			let orderList = data.list.map((item,index)=>{
				const {user = {},order={},operated={}} = item
				return {
					key:index,
					_id:order._id,
					user:{
						headimgurl:user.wx && user.wx.headimgurl,
						nickname:user.wx && user.wx.nickname,
					},
					type:order.type || '普通订单',
					// phone:user.shield && user.shield.phone,
					phone:user.phone,
					status:order.status===1?'未支付':order.status===2?'已完成':order.status===0?'已作废':'暂无状态',
					amount:order.amount/100,
					goods_name:item.title,
					teacher:item.teacher || '暂无',
					create_time:moment(order.create_time).format('YYYY-MM-DD HH:mm:ss'),
					// pay_time:order.wx?(order.wx.time ? moment(order.wx.time,'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'):' '):' ',
					pay_time:order.wx?(order.wx.time ? moment(order.wx.time).format('YYYY-MM-DD HH:mm:ss'):' '):' ',
					opt_time:(operated.time ?moment(operated.time).format('YYYY-MM-DD HH:mm:ss') : ''),
					opt_type:operated.type || '',
					opt_mobile:operated.mobile || '',
                    remark:order.remark || '',
                    express:order.express || '',
                    address:order.shou_huo_info&&order.shou_huo_info.address || '',
				}
			})
			// console.log(orderList)
			this.setState({
				count:data.count,
				orderList:orderList,
				loading:false,
			})
			// console.log(data)
		},err=>{
			notification.error({
				message: '警告',
				description: err.errorMsg,
			});
		})
	}

	search = (searchs) =>{
		this.setState({
			searchs,
			pageNum:1,
		})
		this.getOrderList(1,searchs)
	}

	// 更改订单类型
	changeOrderSatus = (order) =>{
		console.log(order._id)
		DB.Order.success({
			order_id:order._id,
		})
		.then(res=>{
			if(res === '操作成功') {
				this.getOrderList(this.state.pageNum,this.state.searchs)
			}
		},err=>{
			console.log(err)
			notification.error({
				message: '警告',
				description: err.errorMsg,
			});
		})
	}

	luru = () =>{
		if(this.state.isImport) return
		console.log(222222)
		this.setState({
			isImport:true,
		})
		// console.log(this.state)
		this.props.form.validateFields((err, values) => {
			if (!err) {
				DB.Order.import({
					...values,
					create_time:values.create_time.valueOf()
				}).then(res=>{
					this.getOrderList()
					this.setState({
						visible:false,
						isImport:false,
						create_time:'',
						phone:'',
						goods_id:'',
						amount:'',
					})
					this.props.form.resetFields();
				},err=>{
					this.setState({
						isImport:false,
					})
					notification.error({
	                    message: '警告',
	                    description: err.errorMsg,
	                });
				})
			}else{
				this.setState({
					isImport:false,
				})
			}
	    });
	}

	// changeTime = (start_time,end_time) =>{
	// 	this.setState({
	// 		start_time,
	// 		end_time,
	// 	},()=>{
	// 		console.log(this.state.start_time,this.state.end_time)
	// 	})
	//
	// }

	// 导出订单
	daochu = () =>{
		// console.log(this.state.start_time,this.state.end_time)
		DB.Order.getAllOrderList({
			...this.state.searchs,
			// startTime:this.state.start_time,
			// endTime:this.state.end_time,
		}).then(data=>{
			let dt = data.list.map((item,index)=>{
				const {user = {},order={},operated={}} = item
				return {
					// nicheng:user.wx && user.wx.nickname,
					phone:user.phone,
					// type:order.type || '普通订单',
					goods_name:item.title,
					amount:order.amount/100||'0',
					// status:order.status===1?'未支付':order.status===2?'已完成':order.status===0?'已作废':'暂无状态',
					create_time:moment(order.create_time).format('YYYY-MM-DD HH:mm:ss'),
					pay_time:order.wx?(order.wx.time ? moment(order.wx.time).format('YYYY-MM-DD HH:mm:ss'):' '):' ',
					// opt_mobile:operated.mobile || '',
					// opt_time:(operated.time ?moment(operated.time).format('YYYY-MM-DD HH:mm:ss') : ''),
					// opt_type:operated.type || '',
					// trade_no:order.trade_no || '',
					// order_id:order._id,
				}
			})

			// console.log(dt)
			JSON2EXCEL(dt,'订单导出记录',['手机号','课程名称','订单金额(元)','下单时间','支付时间'])

			// JSON2EXCEL(dt,'订单导出记录',['昵称','手机号','订单类型','课程名称','订单金额(元)','订单状态','下单时间','支付时间','操作人','操作时间','操作类型','商户单号','订单ID' ])

		},err=>{
			notification.error({
				message: '警告',
				description: err.errorMsg,
			});
		})
	}

    _Upload(){
        this.setState({
            upload:{
                show:true,
            }
        })
    }

	render() {
        const {edit={},upload} = this.state
        const {shou_huo_info={}} = edit
		const formItemLayout = {
	      labelCol: {
	        xs: { span: 24 },
	        sm: { span: 4 },
	      },
	      wrapperCol: {
	        xs: { span: 24 },
	        sm: { span: 14 },
	      },
	    };
		let columns = [
			{ title:'头像/昵称',key:'user',fixed: 'left',width:'300px',dataIndex:'user',render:(text,record)=>(
				<div className="ow-row-name">
				    <img
						className='ow-head'
						src={text.headimgurl} />
					{text.nickname}
				</div>
			) },
			{ title:'手机号',width:'300px',key:'phone',dataIndex:'phone'},
			{ title:'订单类型',width:'120px',key:'type',dataIndex:'type' },
			{ title:'课程名称',width:'300px',key:'goods_name',dataIndex:'goods_name' },
			{ title:'订单金额',width:'120px',key:'amount',dataIndex:'amount' },
			{ title:'订单状态',width:'120px',key:'status',dataIndex:'status',render:(text,record)=>(
				<div style={{textAlign:'center'}}>
					{text}
					{

						text ==='已完成'?null:<div style={{color:'#108ee9',marginTop:'4px'}}>
							<Popconfirm title="确定将订单状态改为已完成吗?" onConfirm={this.changeOrderSatus.bind(null,record)} okText="确定" cancelText="取消">
								<Button type='primary' size='small'>手动完成</Button>
							</Popconfirm>

							</div>
					}
				</div>
			) },
			{ title:'下单时间',width:'120px',key:'create_time',dataIndex:'create_time',render:(text,record)=>(
				<div className="ow-row-name">
				    {/* <img
						className='ow-head'
						src={text.headimgurl} /> */}
					{text.split(' ')[0]}
					<br/>
					{text.split(' ')[1]}
				</div>
			) },
			{ title:'支付时间',width:'120px',key:'pay_time',dataIndex:'pay_time' },
			{ title:'操作人',width:'120px',key:'opt_mobile',dataIndex:'opt_mobile' },
			{ title:'操作时间',width:'120px',key:'opt_time',dataIndex:'opt_time' },
			{ title:'操作类型',width:'120px',key:'opt_type',dataIndex:'opt_type' },
            { title:'收货地址',width:'120px',key:'address',dataIndex:'address' },
            { title:'物流单号',width:'250px',key:'express',dataIndex:'express' },
            { title:'备注',width:'120px',key:'remark',dataIndex:'remark'},
            { title:'操作',width:'120px',key:'opt_operate',dataIndex:'opt_operate',render:(text,record)=>{
                return <Button onClick={()=>{
                    console.log(record)
                    this.setState({
                        edit:{
                            ...record,
                            show:true,
                        }
                    })
                }}>编辑</Button>
            }},

		]
		const { getFieldDecorator } = this.props.form;
		const importBtn = (<div className="">
			<Button
				onClick={()=>{
					this.setState({
						visible:false,
						create_time:'',
						phone:'',
						goods_id:'',
						amount:'',
					})
					this.props.form.resetFields();
				}}
				>取消</Button>
			<Button
				disabled={this.state.isImport}
				type='primary'
				onClick={this.luru}
				>确定</Button>
		</div>)
		return (
		<section className='order-wrap'>
			<p>订单管理</p>

            {/* <Button icon='plus'
                onClick={this._Upload.bind(this)}
                type="default" style={{
                marginLeft:20,
            }}>批量导入</Button> */}

			<Button onClick={()=>this.setState({visible:true})} className='addbth' icon="plus" >录入</Button>

			<Button
				style={{marginLeft:'0px'}}
				onClick={this.daochu}
				className='addbth'
				icon="minus" >导出</Button>

			<SearchBar
				// onChangeTime={this.changeTime}
				ref={(el) => { this.searchbar2 = el }}
				onSure={this.search}
				teacherList={this.state.teacherList}
				courseList={this.state.courseList} />

			<div className="ow-table-wrap" id='order'>
				<Table
					loading={this.state.loading}
					scroll={{ x: '200%'}}
					// bordered
			        columns={columns}
			        dataSource={this.state.orderList}
					onChange={this.sort}
			        pagination={false}
			    />
				<Pagination
						showQuickJumper
					onChange={(pageNum)=>{
						this.setState({
							pageNum
						})
						this.getOrderList(pageNum,this.state.searchs)}}
					pageSize={this.state.pageCount}
					style={{marginTop:30}}
					current={this.state.pageNum}
					total={this.state.count} />
			</div>
			<Modal
	          	title="录入订单"
	          	visible={this.state.visible}
				onCancel={()=>{
					this.setState({
						visible:false,
						create_time:'',
						phone:'',
						goods_id:'',
						amount:'',
					})
					this.props.form.resetFields();
				}}
				//        	onOk={this.luru}
				footer={importBtn}
	        >
				<Form className="">
					<FormItem
						{...formItemLayout}
						label="手机号码">
						{getFieldDecorator('phone', {

				            rules: [{ pattern:/^(0|86|17951)?(13[0-9]|15[012356789]|17[0123678]|18[0-9]|14[57])[0-9]{8}$/, message: '手机号码格式不正确' },{ required:true, message: '请输入手机号码' }],
				        })(
				            <Input
								// value={this.state.phone}
								onChange={(e)=>this.setState({phone:e.target.value})}
								style={{ width: 300 }}
								placeholder="请输入手机号" />
				        )}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="课程名称">
						{getFieldDecorator('goods_id', {
				            rules: [{ required:true, message: '请选择课程名称' }],
				        })(
							 <AutoComplete
						        dataSource={this.state.courseList}
						        style={{ width: 300 }}
								filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
						        onSelect={(value)=>this.setState({goods_id:value})}
						        placeholder="请选择课程名称"
						    />
				        )}
					</FormItem>
					{/* <Select  style={{ width: '120px'}}
						placeholder="请选择课程名称"
						size = 'large'
						onSelect={(value)=>this.setState({goods_id:value})}
						>
							{this.state.courseList.map(itm=>{
								console.log(itm)
								return <Option value={itm._id}>{itm.title}</Option>
							})}
					 </Select> */}
					<FormItem
						{...formItemLayout}
						label="订单金额">
						{getFieldDecorator('amount', {
				            rules: [{ required:true, message: '请输入订单金额' },{ pattern:/^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/, message: '请输入数字金额' }],
				        })(
							<Input
								// value={this.state.amount}
								onChange={(e)=>this.setState({amount:e.target.value})}
								style={{ width: 300 }}
								placeholder="请输入订单金额" />
				        )}
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="下单时间">
						{getFieldDecorator('create_time', {
				            rules: [{ required:true, message: '请选择下单时间' }],
				        })(
							<DatePicker
								allowClear={false}
								style={{width:300}}
								showTime
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="请选择下单时间"
								// value={!this.state.create_time? null : moment(this.state.create_time)}
								onChange={(time)=>this.setState({
									create_time:time.valueOf()
								})}
							/>
				        )}
					</FormItem>

				</Form>
	        </Modal>
            <Modal
                title="编辑订单"
                visible={edit.show}
                okText='确定'
                cancelText='取消'
                onOk={()=>{
                    DB.Order.update(edit).then(()=>{
                        message.success('操作成功')
                        this.setState({
                            edit:{},
                        })
                        this.getOrderList()
                    },({errorMsg})=>{
                        message.error(errorMsg)
                    })
                }}
                onCancel={()=>{
                    this.setState({
                      edit:{}
                    })
                }}
                >
                    <div className='input_inline'>
                       <span>物流单号:</span><Input value={edit.express} placeholder="请输入物流单号"
                           onChange={e=>this.setState({
                               edit:{
                                   ...edit,
                                   express:e.target.value,
                               }
                           })}/>
                     </div>
                     <div className='input_inline'>
                        <span>收货地址:</span><Input value={edit.address} placeholder="请输入收货地址"
                            onChange={e=>this.setState({
                                edit:{
                                    ...edit,
                                    address:e.target.value,
                                }
                            })}/>
                      </div>
                      <div className='input_inline'>
                         <span>备注:</span>
                         <Input value={edit.remark} placeholder="请输入备注"
                             onChange={e=>this.setState({
                                 edit:{
                                     ...edit,
                                     remark:e.target.value,
                                 }
                             })}/>
                       </div>
            </Modal>
            <Modal
                key='file'
                title='批量导入'
                visible={upload.show}
                okText='确定'
                cancelText='取消'
                onCancel = {
                    ()=>{
                        this.setState({
                            upload:{}
                        })
                    }
                }
                onOk = {()=>{
                    DB.Order.multiadd({
                        url:upload.link,
                    }).then(async ()=>{
                        await this.setState({
                            upload:{}
                        })
                        this.getOrderList()
                    },({errorMsg})=>{
                        message.error(errorMsg)
                    })
                }}
            >
                    {/* <div className='input_inline'>
                        <span>格式demo:</span>
                        <a href="./crm/upload/upload.xlsx" target='_blank'>点击打开demo</a>
                    </div> */}
                    <div className='input_inline'>
                        <span>上传文件:</span>
                        <FileUpload
                            type='file'
                            accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            url={upload.link}
                            {...this.props}
                            get={(link = '') => {
                                this.setState({
                                    upload:{
                                        ...upload,
                                        link,
                                    }
                                })
                            }}/>
                    </div>
            </Modal>,
		</section>)
	}
}

export default Form.create()(Import)
