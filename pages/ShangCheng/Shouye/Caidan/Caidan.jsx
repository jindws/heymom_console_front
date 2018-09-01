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
    notification,
    Popconfirm,
    Select,
} from 'antd'
import Dragula from 'react-dragula'
import FileUpload from '@modules/FileUpload'
const {Option} = Select

import DB from '@DB'

class Caidan extends Component {
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
            },
            List: [],
            error:false,
            dialogTitle:'',
            dragZindex: 9,
            dragtype: 'dashed',
            drag: false,
        }
    }

    _edit(itm) {
        // if (itm) {//编辑
            this.setState({
              dialogTitle:'编辑菜单',
                  edit: {
                      ...itm,
                      show:true,
                  }
            })
        // } else {//新增
        //     this.setState({
        //       dialogTitle:'添加菜单',
        //       edit: {
        //           show:true,
        //       }
        //    })
        // }
    }

    componentWillMount(){
        this._getList()
    }

    _getList() {
        DB.ShangCheng.getCaidanList()
        .then(({list:List}) => this.setState({
            List,
            none:!List.length,
        }),({errorMsg})=>{
              notification['error']({message: '温馨提示', description: errorMsg})
              this.setState({
                 error: errorMsg
              })
        })
        .then(()=>{
              this.setState({
                 loading: false
              })
        })
    }

    _delete(_id){
        DB.ShangCheng.deleteCaidan({
            _id
        }).then(()=>{
            message.success('操作成功')
            this._getList()
        },({errorMsg})=>{
            message.error(errorMsg)
        })
    }

    dragulaDecorator = componentBackingInstance => {
        if (componentBackingInstance) {
            let options = {};
            Dragula([componentBackingInstance], options);
        }
    }

    _List() {
        const {
            List,
            loading,
            none,
            error,
            dragZindex,
            zIndex = dragZindex,
        } = this.state;
        const Lists = [];
        if (List.length) {
            Lists.push(
                <dl key='lecture_dl'>
                    <a href="javascript:;" style={{
                        zIndex
                    }}></a>
                    <dt>
                        <span>菜单名称</span>
                        <span>链接地址</span>
                        <div>操作</div>
                    </dt>
                    <object ref={this.dragulaDecorator}>
                        {List.map((itm, ind) => <dd className='caidan__dd' key={`lecture_dd_${ind}`} data-id={itm._id}>
                            <span>{itm.name}</span>
                            <span>{itm.url}</span>
                            <div>
                                <Button type="primary" onClick={this._edit.bind(this, itm)}>编辑</Button>
                                <Popconfirm title="确定删除项目?" onConfirm={this._delete.bind(this,itm._id)} okText="确定" cancelText="取消">
                                    <Button type="danger">删除</Button>
                                </Popconfirm>
                            </div>
                        </dd>)}
                    </object>
                </dl>
            )
        } else if (!loading) {
            Lists.push(
                <dl key='lecture_dl'>
                    <Alert message="温馨提示" description={error||"暂无数据,请点击新建按钮添加"} type="warning" showIcon/>
                </dl>
            )
        }
        return Lists;
    }

    async _operate(){
        const {edit} = this.state
        const {image,name,_id,link,addonBefore} = edit
        await this.setState({
            edit:{
                ...edit,
                loading:true,
            }
        })

        DB.ShangCheng.operateCaidan({
            _id,
            image,
            name,
            addonBefore,
            link,
        }).then(()=>{
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
    }

    async _drag() {
        if (this.state.drag) {
            this.setState({loading: true})
            const orders = document.querySelectorAll('.caidan__dd');
            const bids = [];
            for (let i = 0; i < orders.length; i++) {
                bids.push(orders[i].getAttribute('data-id'))
            }

            DB.ShangCheng.paixuCaidan({
                bids
            }).then(() => {
                notification['success']({message: '退出排序模式', description: '保存成功'});
            }, re => {
                notification['error']({message: '退出排序模式', description: re.errorMsg});
            }).then(() => this.setState({dragtype: 'dashed', dragZindex: 9, drag: false, loading: false}))
        } else {
            await this.setState({dragtype: 'primary', dragZindex: -1, drag: true});
            notification['info']({message: '进入排序模式', description: '请拖动列表进行排序,再次点击排序按钮保存'});
        }
    }

    render() {
        const {edit,loading,error,dialogTitle,drag,none,dragtype} = this.state;
        const {name, _id} = edit;

        return <section className='lecturer'>
            <p id='topBanner'>菜单管理</p>
            <div className='shouye__bannerPc__button'>
                <Button icon="plus" onClick={()=>{
                    this.setState({
                      dialogTitle:'添加菜单',
                      edit: {
                          show:true,
                          addonBefore:'https://',
                      }
                   })
                }} disabled={error}>新建</Button>
                <Button
                    disabled={none}
                    icon="retweet"
                    type={dragtype}
                    onClick={this._drag.bind(this)}
                    loading={loading}>
                    {drag? '保存排序': '排序'}
                </Button>
            </div>
            <Spin spinning={loading}>
                {this._List()}
            </Spin>
            <Modal title="温馨提示" visible={this.state.delete.show} onOk={() => {
                this.setState(prevState => ({delete: Object.assign({}, prevState.delete, {loading: true})}));
                this._delete_operate();
            }} confirmLoading={this.state.delete.loading} onCancel={() => this.setState(prevState => ({delete: Object.assign({}, prevState.delete, {show: false})}))}>
                <p>确认删除项目?</p>
            </Modal>
            <Modal
                maskClosable={false}
                title={dialogTitle}
                visible={edit.show}
                footer={
                    <Button
                        type="primary"
                        disabled={!name}
                        loading={edit.loading}
                        onClick={this._operate.bind(this)}>确定</Button>
                }
                onCancel={() => {
                    this.setState({
                        edit: {
                            show: false
                        }
                    })
                }}>
                <dl className='lecturer__edit'>
                    <dd>
                        <label>菜单名称:</label>
                        <Input placeholder="请输入菜单名称" value={edit.name} onChange={e => {
                          const name = e.target.value;
                          this.setState({
                              edit:{
                                  ...edit,
                                  name,
                              }
                          })
                      }}/>
                  </dd>
                  <dd>
                      <label>图标:</label>
                      <FileUpload
                          type='image'
                          url={edit.image}
                          {...this.props}
                          get={(image = '') => {
                              this.setState({
                                  edit:{
                                      ...edit,
                                      image,
                                  }
                              })
                          }}/>
                  </dd>
                  <dd>
                      <label>链接地址:</label>
                      <Input
                          addonBefore={<Select defaultValue={edit.addonBefore} style={{ width: 100 }}
                              onChange={addonBefore=>this.setState({
                                  edit:{
                                      ...edit,
                                      addonBefore,
                                  }
                              })}>
                                              <Option value="https://">https://</Option>
                                              <Option value="http://">http://</Option>
                                            </Select>
                            }
                          onChange={e => {
                              this.setState({
                                  edit:{
                                      ...edit,
                                      link: e.target.value,
                                  }
                              })
                          }}
                          value={edit.link}
                          placeholder="链接地址"/>
                  </dd>
                </dl>
            </Modal>
        </section>
    }
}

export default Caidan
