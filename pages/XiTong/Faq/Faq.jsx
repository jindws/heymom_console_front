import React, {Component} from 'react'
import {
    Button,
    Modal,
    Input,
    InputNumber,
    Icon,
    Spin,
    Alert,
    message,
    Popconfirm,
} from 'antd'

const { TextArea } = Input

import { hot } from 'react-hot-loader'
import DB from '@DB'

class Faq extends Component {
    constructor() {
        super()
        this.state = {
            delete: {
                show: false,
                _id: null
            },
            loading: true,
            edit: {
                show: false,
                name: '',
                phone: '',
                headimgurl:'',
            },
            fileList: [],
            previewVisible: false,
            previewImage: '',
            List: [],
            error:false,
            dialogTitle:'',
        }
    }

    _getList(){
        DB.XiTong.faqList().then(data=>{
            this.setState({
                loading:false,
                List:data.list,
            })
        })
    }

    _edit() {
        this.setState({
          dialogTitle:'新建常见问题',
          edit: {
              show:true
          }
       })
    }

    componentDidMount() {
        this._getList()
    }

    _delete(_id){
        DB.XiTong.faqdelete({
            _id
        }).then(()=>{
            message.success('操作成功')
            this._getList()
        },({errorMsg})=>{
            message.error(errorMsg)
        })
    }

    _List() {
        const {List,loading,error} = this.state;
        const Lists = [];
        if (List.length) {
            Lists.push(
                <dl key='lecture_dl'>
                    <dt>
                        <span>问题</span>
                        <span>答案</span>
                        <div>操作</div>
                    </dt>
                    {List.map((itm, ind) => <dd key={`lecture_dd_${ind}`}>
                        <span>{itm.question}</span>
                        <span>{itm.answer}</span>
                        <div>
                            <Button type="primary" onClick={()=>{
                                this.setState({
                                    dialogTitle:'编辑常见问题',
                                    edit:{
                                        ...itm,
                                        show:true,
                                    }
                                })
                            }}>编辑</Button>
                            <Popconfirm title="确定删除项目?" onConfirm={this._delete.bind(this,itm._id)} okText="确定" cancelText="取消">
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                        </div>
                    </dd>)}
                </dl>
            )
            // Lists.push(<Pagination key='Pagination' defaultCurrent={1} total={10} />)
        } else if (!loading) {
            Lists.push(
                <dl key='lecture_dl'>
                    <Alert message="温馨提示" description={error||"暂无数据,请点击新建按钮添加"} type="warning" showIcon/>
                </dl>
            )
        }
        return Lists;
    }

    render() {
        const {previewVisible, previewImage, fileList, edit,loading,error,dialogTitle} = this.state;
        const {name, phone, desc, _id,headimgurl,question,answer} = edit;

        return <section className='faq lecturer'>
            <p id='topBanner'>常见问题管理</p>
            <Button icon="plus" type='primary' onClick={this._edit.bind(this, false)} disabled={error}>新建</Button>
            <Spin spinning={loading}>
                {this._List()}
            </Spin>
            <Modal
                maskClosable={false}
                title={dialogTitle}
                visible={edit.show}
                closable={false}
                confirmLoading={edit.loading}
                footer={[
                    <Button key='no' type='danger' onClick={()=>{
                        this.setState({
                            edit:{}
                        })
                    }}>取消</Button>,
                    <Button key='ok' type="primary" disabled={!question||!answer}
                onClick={async()=>{
                    await this.setState({
                        edit:{
                            ...edit,
                            loading:true,
                        }
                    })

                    DB.XiTong.faqOperate(edit).then(()=>{
                        message.success('操作成功')
                        this.setState({
                            edit:{}
                        })
                        this._getList()
                    },({errorMsg})=>{
                        this.setState({
                            edit:{
                                ...edit,
                                loading:false,
                            }
                        })
                        message.error(errorMsg)
                    })
            }}>确定</Button>]}
            onCancel={() => {
                this.setState({
                    edit: {
                        show: false
                    }
                })
            }}>
                <dl className='lecturer__edit'>
                    <dd>
                        <label>问题:</label><Input placeholder="问题" value={edit.question} onChange={e => {
                          const question = e.target.value;
                          this.setState({
                              edit:{
                                  ...edit,
                                  question,
                              }
                          })
                      }}/>
                    </dd>
                    <dd>
                        <label>答案:</label><TextArea autosize placeholder="答案" value={edit.answer} onChange={e => {
                          const answer = e.target.value;
                          this.setState({
                              edit:{
                                  ...edit,
                                  answer,
                              }
                          })
                      }}/>
                    </dd>
                </dl>
            </Modal>
        </section>
    }
}

export default hot(module)(Faq)
