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
    Select,
} from 'antd'

const { TextArea } = Input
const {Option} = Select
import { hot } from 'react-hot-loader'
import DB from '@DB'

// import PictureUpload from '@modules/PictureUpload'
import FileUpload from '@modules/FileUpload'

class ZhangHao extends Component {
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
        DB.XiTong.zhanghaoList().then(data=>{
            this.setState({
                loading:false,
                List:data.list,
            })
        })
    }

    _edit() {
        this.setState({
          dialogTitle:'新建账号',
          edit: {
              show:true
          }
       })
    }

    componentDidMount() {
        this._getList()
    }

    _delete(_id){
        DB.XiTong.zhanghaodelete({
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
                        <span>手机号</span>
                        <span>微信名称</span>
                        <span>身份权限</span>
                        <div>操作</div>
                    </dt>
                    {List.map((itm, ind) => <dd key={`lecture_dd_${ind}`}>
                        <span>{itm.phone}</span>
                        <span>{itm.weixin}</span>
                        <span>{itm.shenfen}</span>
                        <div>
                            <Button size="small"
                                type="primary" onClick={()=>{
                                this.setState({
                                    dialogTitle:'编辑帐号',
                                    edit:{
                                        ...itm,
                                        show:true,
                                    }
                                })
                            }}>编辑</Button>
                            <Popconfirm
                                title="确定重置密码?"
                                onConfirm={()=>{
                                    DB.XiTong.zhanghaoresetpsd({
                                        _id:itm._id
                                    }).then(()=>message.success('操作成功'),
                                    ()=>message.error('操作失败'))
                                }}
                            okText="确定" cancelText="取消">
                                <Button size="small">重置密码</Button>
                            </Popconfirm>
                            <Popconfirm title="确定删除项目?" onConfirm={this._delete.bind(this,itm._id)} okText="确定" cancelText="取消">
                                <Button size="small" type="danger">删除</Button>
                            </Popconfirm>
                        </div>
                    </dd>)}
                </dl>
            )
            // Lists.push(<Pagination key='Pagination' defaultCurrent={1} total={10} />)
        } else if (!loading) {
            return <Alert message="温馨提示" description={error||"暂无数据,请点击新建按钮添加"} type="warning" showIcon/>
        }
        return Lists;
    }

    render() {
        const {previewVisible, previewImage, fileList, edit,loading,error,dialogTitle} = this.state;
        const { phone, weixin,shenfen,defaultpassword} = edit;

        return <section className='zhanghao lecturer'>
            <p id='topBanner'>帐号管理</p>
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
                    <Button key='ok' type="primary" disabled={!weixin||!phone||!shenfen||!defaultpassword}
                onClick={async()=>{
                    await this.setState({
                        edit:{
                            ...edit,
                            loading:true,
                        }
                    })

                    DB.XiTong.zhanghaoOperate(edit).then(()=>{
                        message.success('操作成功')
                        this.setState({
                            edit:{
                                ...edit,
                                show:false,
                            }
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
                <dl className='lecturer__edit zhanghao__edit'>
                    <dd>
                        <label>手机号:</label><Input placeholder="请输入手机号" value={edit.phone} onChange={e => {
                          const phone = e.target.value.replace(/\D/g,'')
                          this.setState({
                              edit:{
                                  ...edit,
                                  phone,
                              }
                          })
                      }}/>
                    </dd>
                    <dd>
                        <label>微信名称:</label><Input placeholder="请输入微信名称" value={edit.weixin} onChange={e => {
                          const weixin = e.target.value;
                          this.setState({
                              edit:{
                                  ...edit,
                                  weixin,
                              }
                          })
                      }}/>
                    </dd>

                    <dd>
                        <label>身份权限:</label>
                        <Select
                          value={edit.shenfen}
                          placeholder='请选择身份权限'
                          onChange = {shenfen=>{
                              this.setState({
                                  edit:{
                                      ...edit,
                                      shenfen,
                                  }
                              })
                          }
                        }>
                          <Option value='管理员'>管理员</Option>
                          <Option value='操作员'>操作员</Option>
                        </Select>
                    </dd>

                    <dd>
                          <label>默认密码:</label>
                          <Input
                              placeholder="请输入默认密码"
                              value={edit.defaultpassword}
                              onChange={e => {
                                  const defaultpassword = e.target.value;
                                  this.setState({
                                      edit:{
                                          ...edit,
                                          defaultpassword,
                                      }
                                  })
                              }}/>
                    </dd>

                    <dd>
                        <label>上传二维码:</label>
                        <FileUpload
                            type='image'
                            url={edit.erweima}
                            {...this.props}
                            get={(erweima = '') => {
                                this.setState({
                                    edit:{
                                        ...edit,
                                        erweima,
                                    }
                                })
                            }}/>
                        {/* <PictureUpload
                            url={edit.erweima}
                            {...this.props}
                            getImg={(erweima = '') => this.setState({
                                edit:{
                                    ...edit,
                                    erweima,
                                }
                          })}/> */}
                          （选填，责任老师必填）
                    </dd>
                </dl>
            </Modal>
        </section>
    }
}

export default hot(module)(ZhangHao)
