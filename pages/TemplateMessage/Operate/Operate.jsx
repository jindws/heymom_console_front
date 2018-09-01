import React, {Component} from 'react'
import {
    Button,
    notification,
    Select,
    Checkbox,
    Input,
    DatePicker,
    Form,
    Popover,
} from 'antd'
import {SwatchesPicker} from 'react-color'
const Option = Select.Option;
const FormItem = Form.Item;
import DB from '@DB'
import {Link,withRouter} from 'react-router-dom'
import './Operate.css'
import moment from 'moment'

class Operate extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // 选中的模板提供的配置信息
            temlSettings : {
                // 'result':{
                //     title:'领奖金额',
                // },
                // 'time':{
                //     title:'时间',
                // },
                // 'info':{
                //     title:'银行信息',
                // },
                // 'pay':{
                //     title:'到账时间',
                // },
            },
            // 选中的消息配置项
            choosedSettings:[],
            // 模板列表
            temlList:[],
            // 选中的模板
            choosedTeml:{},
            // 配置跳转URL
            url:'',
            // 推送时间，可不配置
            push_time:'',
            // 模板消息title
            message_desc:'',

            // 已提交
            hasSubmit:false,

        }
    }

    componentDidMount() {
        // 获取模板列表
        this.getTemplateList()

        const {
            messageid
        } = this.props.match.params
        if(messageid !== 'new') {
            // 获取消息详情
            this.getDetail(messageid)
        }
    }

    getDetail = (messageid) =>{
        DB.Message.getDetail({
            push_id:messageid,
        })
        .then(res=>{
            let {
                url = '',
                message_desc = '',
                push_time,
                data ={},

                template_id = '',
                title = '',
                content = '',
                // deputy_industry = '',
                example = '',
                // primary_industry = '',

                // 消息状态
                is_do = false,
                in_pushing = false,
                has_push = false,
            } = res
            this.setState({
                url,
                message_desc,
                push_time,
                choosedTeml:{
                    template_id,
                    title,
                    content,
                    // deputy_industry,
                    example,
                    // primary_industry,
                },
                temlSettings:data,
            })
        })
    }

    // 获取模板列表
    getTemplateList=()=>{
        DB.Message.getTemplateList()
        .then(data=>{
            this.setState({
                temlList:data
            })
        },err=>{
            notification.error({
                message: '操作失败',
                description:'获取模板列表出错',
            });
        })
    }

    // 获取已选择的配置预览
    getChoosedDom = () =>{
        // let st = this.state.temlSettings || {}
        // let ct = this.state.choosedSettings || []
        //
        // let dom = ct.map((item,index)=>{
        //     return (
        //         <div key={index} className="opt-setting-item">
        //             <div className="osc-left">
        //                 {st[item] && st[item].title}:
        //             </div>
        //             <div className="osc-right">
        //                 {st[item] && st[item].value}
        //             </div>
        //         </div>
        //     )
        // })
        // return dom

        let t = this
        let st = this.state.temlSettings || {}

        // 将换行/n处理成<br />标签
        let content = t.state.choosedTeml.content || ''
        let reg = new RegExp('\n','g')
        let dom = content.replace(reg,'<br />')


        for(let key in st) {
            if(st[key] && st[key].value !== '') {
                dom = dom.replace(`{{${key}.DATA}}`,`<span style='color:${st[key].color}'>${st[key].value}</span>`)
            }
        }

        return dom
    }

    // 获取配置项dom
    getSettingsDom = () =>{
        let t = this
        let dom = []
        let st = t.state.temlSettings || {}
        const { getFieldDecorator,setFieldsValue } = this.props.form;
        const formItemLayout = {
	        labelCol: {
	            xs: { span: 24 },
	            sm: { span: 5 },
	        },
	        wrapperCol: {
	            xs: { span: 24 },
	            sm: { span: 19 },
	        },
	    };
        for(let key in st) {
            dom.push(
                <FormItem
                    key={key}
					{...formItemLayout}
					label={key}>
					{getFieldDecorator(key, {
			            rules: [{ required:true, message: `请输入${key}` }],
                        initialValue:st[key].value || '',
			        })(
                        <Input
                            // value={st[key].value || ''}
                            onChange={t.changeSetting.bind(t,key)}
                            style={{width:'300px'}} />
			        )}
                    <Popover
                        trigger="click"
                        placement="top"
                        content={
                            <SwatchesPicker
                                onChangeComplete={this.changeColor.bind(t,key)}
                                color={st[key].color}
                            />
                        }>
                        <div
                            style={{background:st[key].color}}
                            className='opt-color'>
                        </div>
                    </Popover>
				</FormItem>
            )
        }

        return dom

    }

    // 更改配置内容,配置项文案被改变时触发
    changeSetting = (key, e) =>{
        let st = this.state.temlSettings || {}

        let value = e.target.value
        let temlSettings = Object.assign({},st)
        temlSettings[key].value = value
        this.setState({
            temlSettings,
        })
    }

    // 更改配置颜色
    changeColor = (key, color) =>{
        let st = this.state.temlSettings || {}

        let temlSettings = Object.assign({},st)
        temlSettings[key].color = color.hex
        this.setState({
            temlSettings,
        })
    }

    // 更改配置是否选中，配置项选中状态被改变时触发
    chooseSetting = (key, e) =>{
        let ct = this.state.choosedSettings || []

        let checked = e.target.checked
        // 如果配置项被选中
        if(checked) {
            // 如果配置项没有在数组中
            if(ct.indexOf(key) === -1) {
                ct.push(key)
            }
        }else{
            // 如果配置项没有在数组中
            if(ct.indexOf(key) !== -1) {
                let temIndex = ct.indexOf(key)
                ct.splice(temIndex,1)
            }
        }
        this.setState({
            choosedSettings:ct
        })
    }

    // 选择模板
    chooseTeml =(value) =>{
        let template_id = value
        let t = this
        let res = t.state.temlList.filter((item,index)=>{
            return item.template_id === template_id
        })
        let choosedTeml = res[0] || {}

        // 将选中的模板中的content解析
        let content = choosedTeml.content

        // 文本解析结果
        let result = content.match(/{{(.+?)}}/g)

        // 配置对象 例如：{first:{value:''}}
        let temlSettings = {}
        result.map(item=>{
            temlSettings[item.slice(2,-7)] = {
                value:'',
                color:'#333',
            }
            // return item.slice(2,-7)
        })

        delete choosedTeml.primary_industry
        delete choosedTeml.deputy_industry

        this.setState({
            choosedTeml,
            temlSettings,
        })
        // 将模板输入的内容清空
        this.props.form.resetFields();
    }

    // 发送模板消息的请求
    save = () =>{
        let t = this
        t.setState({
            hasSubmit:true,
        })
        // 要发送的数据对象
        let data = {}

        let teml = this.state.choosedTeml || {}
        if(teml.template_id) {
            data = {...teml}
        }

        data.touser_type = 'all'

        // 校验title是否输入
        if(t.state.message_desc === '') {
            notification.error({
                message: '操作失败',
                description:'请填写模板消息title',
            });
            t.setState({
                hasSubmit:false,
            })
            return
        }
        data.message_desc = this.state.message_desc

        // 校验跳转url是否输入
        if(t.state.url === '') {
            notification.error({
                message: '操作失败',
                description:'请填写跳转url',
            });
            t.setState({
                hasSubmit:false,
            })
            return
        }
        data.url = this.state.url
        t.state.push_time !== '' && (data.push_time = this.state.push_time)

        this.props.form.validateFields((err, values) => {
			if (!err) {
                data.data = t.state.temlSettings

                // 保存example
                let example = this.getChoosedDom()
                data.example = example

                const {
                    messageid = ''
                } = this.props.match.params
                // 如果消息不为new说明是更新，走更新接口,如果是new，走新建接口
                if(messageid === 'new') {
                    console.log(data)
                    DB.Message.sendMessage(data)
                    .then(res=>{
                        t.setState({
                            hasSubmit:false,
                        })
                        window.location.href = '#/weixin'
                        notification.success({
                            message: '操作成功',
                            description:res,
                        });

                    },err=>{
                        t.setState({
                            hasSubmit:false,
                        })
                        notification.error({
                            message: '操作失败',
                            description:'新建消息失败',
                        });
                    })
                }else{
                    data.push_id = messageid
                    DB.Message.updateMessage(data)
                    .then(res=>{
                        t.setState({
                            hasSubmit:false,
                        })
                        if(res === '保存成功!') {
                            window.location.href = '#/weixin'
                            notification.success({
                                message: '操作成功',
                                description:'更新消息成功',
                            });
                        }
                    },err=>{
                        t.setState({
                            hasSubmit:false,
                        })
                        notification.error({
                            message: '操作失败',
                            description:'保存消息失败',
                        });
                    })
                }


			}else{
                t.setState({
                    hasSubmit:false,
                })
                notification.error({
                    message: '操作失败',
                    description:'请完善消息配置项',
                });
			}
	    });


    }



    render() {
        const {
            messageid = ''
        } = this.props.match.params
        return [
            <section key='1' className="operate-wrap">
                <p id='title' className='operate-title'>{messageid === 'new' ?'新建消息':'编辑消息'}</p>

                <div className="operate-content">



                    {/* 操作面板 */}
                    <div className="opt-wrap">
                        <Button
                            loading={this.state.hasSubmit}
                            onClick={this.save}
                            type='primary'
                            style={{marginRight:'20px'}}
                            size='large' >
                            保存
                        </Button>
                    </div>

                    {/* 消息编辑面板 */}
                    <div className="opt-message">
                        {/* 当消息处于操作中或发送中状态时，遮罩显示 */}
                        {/* {
                            this.state.status === 'operating' && <div className="operate-overlay"></div>
                        } */}

                        <div className="opt-tip">
                            您可以在右侧选择模板并且配置关键词，在左边预览效果
                        </div>

                        <div className="opt-content">
                            <section className="opt-left">
                                <div className='opt-yulan'>
                                    {/* <img src="http://cdn.xueyuan.xiaobao100.com/shield/image/share-icon.png" alt=""/> */}
                                    <span style={{marginTop:-18}}>XXX</span>
                                </div>
                                <div className="opt-left-content">
                                    <div className="opt-setting-title">
                                        {this.state.choosedTeml.title || ''}
                                    </div>
                                    <br />
                                    <br />
                                    <div dangerouslySetInnerHTML={{__html:this.getChoosedDom()}}></div>
                                    {/* 获取选中的配置项的预览dom */}
                                    {/* {this.getChoosedDom()} */}
                                </div>
                                <div onClick={()=>{
                                    this.state.url !== '' && (window.location.href = this.state.url)
                                }} className="opt-left-bottom">
                                    查看详情
                                </div>
                            </section>
                            <section className="opt-right">

                                {/* 配置消息title */}
                                <div className="opt-right-title">
                                    配置消息title
                                </div>
                                <Input
                                    value={this.state.message_desc}
                                    onChange={(e)=>this.setState({message_desc:e.target.value})}
                                    style={{width:'300px'}} />

                                <Select
                                    value={this.state.choosedTeml && this.state.choosedTeml.template_id}
                                    style={{ width: '100%',marginTop:'20px',borderTop:'1px solid #e7e7e7',paddingTop:'20px'  }}
                                    placeholder="选择一个消息模板"
                                    // optionFilterProp="children"
                                    onChange={this.chooseTeml}
                                    // onFocus={handleFocus}
                                    // onBlur={handleBlur}
                                    // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        this.state.temlList.map((item,index)=>{
                                            return (
                                                <Option
                                                    key={index}
                                                    style={{width:'100%'}}
                                                    value={item.template_id}>
                                                    {item.title}
                                                </Option>
                                            )
                                        })
                                    }
                                </Select>

                                <div className="opt-right-title">
                                    配置关键词
                                </div>

                                <div className="opt-right-content">
                                    <ul>
                                        <Form>
                                        {
                                            // 配置项dom
                                            this.getSettingsDom()
                                        }
                                        </Form>
                                    </ul>
                                </div>

                                {/* 配置跳转url */}
                                <div className="opt-right-title">
                                    配置跳转URL
                                </div>
                                <Input
                                    value={this.state.url}
                                    onChange={(e)=>this.setState({url:e.target.value})}
                                    style={{width:'300px'}} />

                                <div className="opt-right-title">
                                    选择消息推送时间
                                </div>
                                <DatePicker
                                    allowClear={false}
                                    value={this.state.push_time ? moment(this.state.push_time):null}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    placeholder="请选择时间"
                                    onChange={(time)=>this.setState({
    									push_time:time.valueOf()
    								})}
                                />
                            </section>
                        </div>

                    </div>

                </div>
            </section>,
        ]
    }
}

export default withRouter(Form.create()(Operate))
