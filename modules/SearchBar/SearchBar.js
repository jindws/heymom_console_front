import React, {Component} from 'react'
import {Form, Row, Col, Input, Button, Icon,notification,AutoComplete,Select,DatePicker} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import moment from 'moment'
import DB from '@DB'
import './SearchBar.scss'
const { RangePicker } = DatePicker;

class SearchBar extends Component {
    constructor(props){
        super(props)
        this.state = {
            // phone:'',
            // danhao:'',
            // goods_id:'',
            // orderType:'',
            // startTime:'',
            // endTime:'',
            // status:'',
            // free:'',
        }
        // DB.Order.getCourseList().then(data=>{
		// 	let courseList = data.map((item,index)=>{
		// 		return {
		// 			key:index,
		// 			value:item._id,
		// 			text:item.title,
		// 		}
		// 	})
		// 	this.setState({
		// 		courseList,
		// 	})
		// },err=>{
		// 	notification.error({
		// 		message: '警告',
		// 		description: err.errorMsg,
		// 	});
		// })
    }

    // 修改下单时间范围
    changeRange = (value, dateString) =>{
        let startTime = value[0].startOf('day').valueOf();
        let endTime = value[1].endOf('day').valueOf()
        this.setState({
            startTime,
            // 获取当天23:59:59的时间毫秒数
            endTime,
        },()=>{
            this.props.form.setFieldsValue({
              '下单时间': [moment(startTime),moment(endTime)],
            });
        })

        // this.props.onChangeTime(value[0].valueOf(),value[1].valueOf())
    }

    // 修改支付时间范围
    changePayRange = (value, dateString) =>{
        let payStartTime = value[0].startOf('day').valueOf();
        let payEndTime = value[1].endOf('day').valueOf()
        this.setState({
            payStartTime,
            // 获取当天23:59:59的时间毫秒数
            payEndTime,
        },()=>{
            this.props.form.setFieldsValue({
              '支付时间': [moment(payStartTime),moment(payEndTime)],
            });
        })

        // this.props.onChangeTime(value[0].valueOf(),value[1].valueOf())
    }

    search = () =>{
        this.props.form.validateFields((err, values) => {
            if(!err) {
                this.props.onSure(this.formatState(this.state))
            }
        })
    }

    formatState(state){
        let result = Object.assign({},state)
        for(var i in result) {
            if(result[i] === '') {
                delete result[i]
            }
        }
        return result
    }

    disabledDate =(current)=>{
        return current && current.valueOf() > Date.now();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
        };
        const rangeConfig = {
            rules: [],
        };
        let teacherList = this.props.teacherList.map(item=>{
            return {
                text:item.name,
                // value:item._id,
                value:item.name,
            }
        })
        return (
            <div className="search-wrap">
                <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSearch}
                    >
                    <div style={{margin:'-9px 0 10px -3px',fontSize:'16px'}}>
                        筛选条件
                    </div>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label={`用户姓名`}>
                                {getFieldDecorator('shou_huo_name')(
        				            <Input
        								// value={this.state.shou_huo_name}
        								onChange={(e)=>this.setState({shou_huo_name:e.target.value})}
        								placeholder="请输入用户姓名" />
        				        )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label={`手机号`}>
                                {getFieldDecorator('phone', {
        				            rules: [{ pattern:/^(0|86|17951)?(13[0-9]|15[012356789]|17[0123678]|18[0-9]|14[57])[0-9]{8}$/, message: '手机号码格式不正确' }],
        				        })(
        				            <Input
        								// value={this.state.phone}
        								onChange={(e)=>this.setState({phone:e.target.value})}
        								placeholder="请输入手机号" />
        				        )}
                            </FormItem>
                        </Col>
                        {/* <Col span={8}>
                            <FormItem {...formItemLayout} label={`商户单号`}>
                                {getFieldDecorator(`商户单号`)(
                                    <Input
                                        onChange={(e)=>this.setState({danhao:e.target.value})}
                                        placeholder="请输入商户单号" />
                                )}
                            </FormItem>
                        </Col> */}
                        <Col span={8}>
                            <FormItem
                              label="订单类型"
                              {...formItemLayout}
                            >
                              {getFieldDecorator('订单类型')(
                                <Select
                                    size='default'
                                    placeholder="选择订单类型"
                                    onChange={(value)=>this.setState({
    									orderType:value
    								})}
                                >
                                    <Option value="普通订单">普通订单</Option>
                                    <Option value="手动添加">手动添加</Option>
                                    {/* <Option value="系统赠送">系统赠送</Option> */}
                                    {/* <Option value="邀请卡兑换">邀请卡兑换</Option> */}
                                </Select>
                              )}
                            </FormItem>

                        </Col>

                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label={`课程名称`}>
                                {getFieldDecorator(`课程名称`)(
                                    <AutoComplete
                                        size='default'
        						        dataSource={this.props.courseList}
        								filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                        onChange={(value)=>this.setState({goods_id:value})}
        						        // onSelect={(value)=>this.setState({goods_id:value})}
        						        placeholder="请选择课程名称"
        						    />
                                )}
                            </FormItem>

                        </Col>
                        <Col span={8}>
                            <FormItem
                              label="订单状态"
                              {...formItemLayout}
                            >
                              {getFieldDecorator('订单状态')(
                                <Select
                                    size='default'
                                    placeholder="选择订单状态"
                                    onChange={(value)=>this.setState({
    									status:value
    								})}
                                >
                                    <Option value="2">已完成</Option>
                                    <Option value="1">未支付</Option>
                                    <Option value="0">已作废</Option>
                                </Select>
                              )}
                            </FormItem>

                        </Col>
                        <Col span={8}>
                            <FormItem
                              label="订单金额"
                              {...formItemLayout}
                            >
                              {getFieldDecorator('订单金额',{
                                  rules: [{ pattern:/^\d{0,8}\.{0,1}(\d{1,2})?$/, message: '请输入数字,不超过2位小数' }],
                              })(
                                  <Input
                                      addonAfter="元"
                                      onChange={(e)=>{
                                          // const amount=e.target.value.replace(/\D/g,'')
                                          // console.log(amount)
                                          this.setState({
                                              amount:e.target.value
                                          })
                                      }}
                                      placeholder="请输入订单金额" />
                                // <Select
                                //     showSearch
                                //     size='default'
                                //     placeholder="选择订单金额"
                                //     onChange={(value)=>this.setState({
    							// 		free:value
    							// 	})}
                                // >
                                //     <Option value='1'>0</Option>
                                //     <Option value='0'>其他</Option>
                                // </Select>
                              )}
                            </FormItem>

                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 4}}
                                wrapperCol={{span: 18}}
                                label="下单时间"
                            >
                                {getFieldDecorator('下单时间', rangeConfig)(
                                    <RangePicker
                                        style={{width:'100%'}}
                                        allowClear={false}
                                        size='default'
                                        disabledDate={this.disabledDate}
                                        onChange={this.changeRange}
                                        format="YYYY-MM-DD HH:mm:ss" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 4}}
                                wrapperCol={{span: 18}}
                                label="支付时间"
                            >
                                {getFieldDecorator('支付时间', rangeConfig)(
                                    <RangePicker
                                        style={{width:'100%'}}
                                        allowClear={false}
                                        size='default'
                                        disabledDate={this.disabledDate}
                                        onChange={this.changePayRange}
                                        format="YYYY-MM-DD HH:mm:ss" />
                                )}
                            </FormItem>
                        </Col>

                    </Row>
                    {/* <Row>
                        <Col span={8}>
                            <FormItem
                              label="讲师"
                              {...formItemLayout}
                            >
                              {getFieldDecorator('讲师')(
                                <AutoComplete
                                    size='default'
                                    dataSource={teacherList}
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                    onChange={(value = '')=>this.setState({teacher:value})}
                                    // onSelect={(value)=>this.setState({goods_id:value})}
                                    placeholder="请选择讲师"
                                />

                              )}
                            </FormItem>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button
                                onClick={this.search}
                                type="primary">搜索</Button>
                            <Button
                                style={{ marginLeft: 8 }}
                                onClick={()=>{
                                    this.setState({
                                        phone:'',
                                        danhao:'',
                                        goods_id:'',
                                        orderType:'',
                                        startTime:'',
                                        endEime:'',
                                        status:'',
                                        free:'',
                                        payStartTime:'',
                                        payEndTime:'',
                                        teacher:'',
                                        shou_huo_name:'',
                                        amount:'',
                                    })
                                    this.props.form.resetFields();
                                }}>
                              清空
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}



export default Form.create()(SearchBar)
