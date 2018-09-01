import React, {Component} from 'react'
import {
    Button,
    Table,
    notification,
    Popconfirm,
    Modal,
    Spin,
} from 'antd'
import {Link,withRouter} from 'react-router-dom'
import DB from '@DB'
import './List.css'
const confirm = Modal.confirm;
import moment from 'moment'

class List extends Component {

    constructor() {
        super()
        this.state = {
            // 消息列表
            messageList:[],
            // 正在发送请求
            hasSubmit:false,
        }
    }

    componentDidMount() {
        this.getMessageList()
    }


    // 获取推送消息列表
    getMessageList(){
        return DB.Message.getMessageList()
        .then(data=>{
            let dt = data.map((item,index)=>{
                item.key = index

                // 处理状态显示
                if(item.is_do) {
                    item.status = '已定时发送'
                }else if(item.in_pushing) {
                    item.status = '正在推送中'
                }else if(item.has_push) {
                    item.status = '推送成功'
                }else {
                    item.status = '未定时发送'
                }
                item.push_time = moment(item.push_time).format('YYYY-MM-DD \r HH:mm:ss')
                return item
            })
            this.setState({
                messageList:dt
            })
        },err=>{
            notification.error({
                message: '操作失败',
                description:'获取推送消息列表出错',
            });
        })
        // this.setState({
        //     messageList:[{
        //         _id:'11111',
        //         title:111,
        //         push_time:111111111111,
        //         is_do:false,
        //         example:'<div>123123</div>',
        //     }]
        // })
    }

    // 再次确认是否删除的弹框
    showDeleteConfirm = (record) =>{
        const t = this
        if(record.is_do) {
            notification.error({
                message: '操作失败',
                description:'请先撤销推送',
            })
            return
        }
        confirm({
            title: '确定删除本条通知消息吗？本操作将不能撤销',
            content: <div dangerouslySetInnerHTML={{__html:record.example}}>

            </div>,
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                DB.Message.delete({
                    push_id:record._id,
                })
                .then(res=>{
                    t.getMessageList()
                    notification.success({
                        message: '操作成功',
                        description:'消息已删除',
                    })
                },err=>{
                    notification.error({
                        message: '操作失败',
                        description:'消息删除失败',
                    })
                })
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }

    // 编辑消息
    edit = (record) =>{
        if(record.is_do) {
            notification.error({
                message: '操作失败',
                description:'请先撤销推送',
            })
            return
        }
        window.location.href = '#/weixin/operate/' + record._id
    }

    // 加入或撤销推送
    undo = (push_id) =>{
        let t = this
        t.setState({
            hasSubmit:true,
        })
        DB.Message.undo({
            push_id,
        })
        .then(res=>{
            t.setState({
                hasSubmit:false,
            })
            this.getMessageList()
            notification.success({
                message: '操作成功',
                description:res,
            })
        },err=>{
            t.setState({
                hasSubmit:false,
            })
            notification.error({
                message: '警告',
                description:'推送时间已过',
            })
        })
    }

    // 立即推送
    pushNow = (push_id) =>{
        let t = this
        t.setState({
            hasSubmit:true,
        })
        DB.Message.immediately({
            push_id,
        })
        .then(res=>{
            t.setState({
                hasSubmit:false,
            })
            this.getMessageList()
            notification.success({
                message: '操作成功',
                description:res,
            })
        },err=>{
            t.setState({
                hasSubmit:false,
            })
            notification.error({
                message: '操作失败',
                description:'请求错误',
            })
        })
    }

    // 测试推送请求
    test = (push_id) =>{
        let t = this
        t.setState({
            hasSubmit:true,
        })
        DB.Message.test({
            push_id,
        })
        .then(res=>{
            t.setState({
                hasSubmit:false,
            })
            this.getMessageList()
            notification.success({
                message: '操作成功',
                description:res,
            })
        },err=>{
            t.setState({
                hasSubmit:false,
            })
            notification.error({
                message: '操作失败',
                description:'请求错误',
            })
        })
    }

    render() {
        let columns = [{
            title: '日期',
            width: 90,
            dataIndex: 'push_time',
            key: 'push_time',
            // fixed:'left',
        },{
            title: '消息名称',
            width: 120,
            dataIndex: 'message_desc',
            key: 'message_desc',
        },{
            title: '内容',
            dataIndex: 'example',
            width: 200,
            key: 'example',
            render:(text,record)=>(
				<div dangerouslySetInnerHTML={{__html:text}}></div>
			),
        },{
            title: 'URL',
            dataIndex: 'url',
            width: 200,
            key: 'url',
        },
        // {
        //     title: '推送规则',
        //     dataIndex: 'touser_type',
        //     key: 'touser_type',
        //     width: 120,
        // },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
        },{
            title: '发送数据',
            dataIndex: 'sendStatus',
            key: 'sendStatus',
            width: 120,
            render:(text, record)=>[
                <div style={{textAlign:'left'}} key='1'>
                    发送总人数：<br/>{record.push_user_count_plan || '暂无'}
                </div>,
                <div style={{textAlign:'left'}} key='2'>
                    发送成功人数：<br/>{record.push_user_count_real || '暂无'}
                </div>,
                <div style={{textAlign:'left'}} key='3'>
                    点击次数：<br/>{record.push_user_count_click || '暂无'}
                </div>,
            ]
        },{
            title: '操作',
            width: 200,
            key: 'action',
            render:(text, record)=>[
                <Button disabled={record.in_pushing ? true:false} onClick={this.undo.bind(this,record._id)} style={{marginTop:'10px'}} key='queue'>{record.is_do ?'撤销推送':'定时发送'}</Button>,
                <Button disabled={record.in_pushing ? true:false} onClick={this.pushNow.bind(this,record._id)} style={{marginTop:'10px',marginLeft:'10px'}} key='push'>立即推送</Button>,
                <br key='2' />,

                <Button disabled={record.in_pushing ? true:false} style={{marginTop:'10px'}} key='test' onClick={this.test.bind(this,record._id)}>测试推送</Button>,
                <br key='9' />,

                <Button disabled={record.in_pushing ? true:false} style={{marginTop:'10px'}} key='edit' onClick={this.edit.bind(this,record)} icon="edit">编辑</Button>,
                <Popconfirm
                    key='delete'
                    title="确认删除模板消息吗?"
                    onConfirm={this.showDeleteConfirm.bind(this,record)}
                    okText="删除"
                    okType= 'danger'
                    cancelText="取消">
                    <Button disabled={record.in_pushing ? true:false}
                        type="danger"
                        style={{marginTop:'10px',marginLeft:'10px'}}
                        icon="delete">
                        删除
                    </Button>
                </Popconfirm>,
            ]
        }]
        let {
            url = ''
        }= this.props.match
        return [
            <section key='1' className="message-wrap">
                <p className='message-title'>模板消息列表</p>

                <div className="message-content">

                    <Link to={`${url}/operate/new`}>
                        <Button type="primary">新建模板消息</Button>
                    </Link>

                    <Spin spinning={this.state.hasSubmit}>
                        <Table
                            style={{marginTop:'20px'}}
                            columns={columns}
                            dataSource={this.state.messageList || []}
                            // onChange={this.sorterFetch.bind(this)}
                            // scroll={{
                            //   x: '110%'
                            // }}
                            pagination={false}/>
                    </Spin>
                </div>
            </section>,
        ]
    }
}

export default withRouter(List)
