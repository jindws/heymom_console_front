import React, {Component} from 'react'
import Dragula from 'react-dragula'
import {Link, withRouter} from 'react-router-dom'
import FileUpload from '@modules/FileUpload'

import './Lunbo.scss'

import {
    Button,
    Icon,
    Modal,
    notification,
    Spin,
    message,
    Alert,
    Popover,
    Select,
    Input,
    Popconfirm,
} from 'antd'
const confirm = Modal.confirm
const {Option} = Select
import DB from '@DB'

class Lunbo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dragZindex: 9,
            dragtype: 'dashed',
            drag: false,
            loading: true,
            delete: {
                show: false,
                loading: false,
                deleteId: null
            },
            list: [],
            none: false,
            showImage: {
              show:false,
              src:'',
            },
            error:false,
            type:props.match.params.type === 'PC'?'pc_home_setting':'mobile_home_setting',

            addonBefore:'https://',
            modal:{},//operate专用
        }
    }

    async componentWillReceiveProps(props) {
        await this.setState({
            type:props.match.params.type === 'PC'?'pc_home_setting':'mobile_home_setting',
        })
        this._getList();
    }

    componentDidMount() {
        this._getList();
    }

    _getList() {
        DB.ShangCheng.getLunboList({
            // pageSize:10,
            // pageNum:1,
        })
        .then(({list,count}) => {
            this.setState({
                list,
                count,
                none: !list.length
            })
        },re=>{
          notification['error']({message: '温馨提示', description: re.errorMsg})
          this.setState({
            none:true,
            error:re.errorMsg
          })
        }).then(()=>{
          this.setState({
            loading: false,
          })
        })
    }

    dragulaDecorator = componentBackingInstance => {
        if (componentBackingInstance) {
            let options = {};
            Dragula([componentBackingInstance], options);
        }
    }

    async _drag() {
        if (this.state.drag) {
            this.setState({loading: true})
            const orders = document.querySelectorAll('.shouye__bannerPc__dd');
            const bids = [];
            for (let i = 0; i < orders.length; i++) {
                bids.push(orders[i].getAttribute('data-id'))
            }

            DB.ShangCheng.paixuLunbo({
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

    _delete(_id) {
        DB.ShangCheng.deleteLunbo({
            _id,
        }).then(()=>{
            message.success('删除成功')
            this._getList()
        },({errorMsg})=>{
            message.error(errorMsg)
        })
    }

    _showImg(src = '') {
        this.setState({showImage:{show:true,src}})
    }

    _ListMain() {
        const list = [];
        const {drag} = this.state;
        this.state.list.map((itm, ind) => {
            list.push(
                <dd className='shouye__bannerPc__dd' key={ind} data-id={itm._id}>
                    <ul className='shouye__bannerPc__ul'>
                        <li className='shouye__bannerPc__image'>
                            <img src={itm.image}/>
                            <Button type="primary" shape="circle" icon="arrows-alt" onClick={this._showImg.bind(this, itm.image)} />
                        </li>
                        <li className='shouye__bannerPc__lianjie'>
                            {itm.link}
                        </li>
                        <li className='shouye__bannerPc__operate'>
                            {/* <Button type="primary" disabled={drag}>
                                <Link to={`${this.props.match.url}/operate?id=${itm.bid}&link=${encodeURIComponent(itm.link)}&image_url=${itm.image_url}`}>编辑</Link>
                            </Button> */}
                            {/* <Button
                                type="danger"
                                onClick={this._delete.bind(this, itm._id)}
                                disabled={drag}>删除</Button> */}
                                <Button type="primary"
                                    disabled={drag}
                                    onClick={()=>{
                                        const addonBefore = itm.link.startsWith('https://')?'https://':'http://'
                                        const link = itm.link.substring(addonBefore.length)
                                        this.setState({
                                            modal:{
                                                show:true,
                                                _id:itm._id,
                                            },
                                            image_url:itm.image,
                                            link,
                                            addonBefore,
                                        })
                                    }}
                                    >编辑</Button>
                                <Popconfirm title="确定删除项目?" onConfirm={this._delete.bind(this,itm._id)} okText="确定" cancelText="取消">
                                    <Button
                                        type="danger"
                                        disabled={drag}>删除</Button>
                                </Popconfirm>
                        </li>
                    </ul>
                </dd>
            )
        })
        return list;
    }

    _List() {
        const {
            none,
            dragZindex,
            error,
            zIndex = dragZindex
        } = this.state;
        if (none) {
            return <dl>
                <Alert message="温馨提示" description={error||"暂无数据,请点击新增按钮添加"} type="warning" showIcon/>
            </dl>
        } else {
            return <dl>
                <a href="javascript:;" style={{
                    zIndex
                }}></a>
                <dt>
                    <ul className='shouye__bannerPc__ul'>
                        <li className='shouye__bannerPc__image'>图片</li>
                        <li>链接地址</li>
                        <li>操作</li>
                    </ul>
                </dt>
                <object ref={this.dragulaDecorator}>
                    {this._ListMain()}
                </object>
            </dl>
        }
    }

    _publish() {
        const {image_url:image,link,addonBefore,modal} = this.state
        DB.ShangCheng.operateLunbo({
            _id:modal._id,
            image,
            link:addonBefore+link,
        }).then(()=>{
            message.success('操作成功')
            this.setState({
                modal:{
                    ...modal,
                    show:false,
                }
            })
            this._getList()
        },({errorMsg})=>{
            message.error(errorMsg)
        })
    }

    _operateModal(){
        const {link, image_url,modal} = this.state;
        const preSelect = <Select defaultValue={this.state.addonBefore} style={{ width: 100 }} onChange={addonBefore=>this.setState({addonBefore})}>
                            <Option value="https://">https://</Option>
                            <Option value="http://">http://</Option>
                          </Select>
        const title = modal._id?'编辑':'新建'

        return <Modal
                title={`${title}轮播图`}
                visible={modal.show}
                width={1000}
                footer={[
                    <Button type="danger" key='cancel' onClick={()=>{
                        this.setState({
                            modal:{
                                ...modal,
                                show:false,
                            }
                        })
                    }}>
                        取消
                    </Button>,
                    <Button type="primary"
                        key='ok'
                        onClick={this._publish.bind(this)}
                        disabled={!image_url || !link}>确认发布</Button>
                ]}
                onCancel={()=>{
                    this.setState({
                        modal:{
                            ...modal,
                            show:false,
                        }
                    })
                }}
                afterClose={()=>{
                    this.setState({
                        modal:{}
                    })
                }}
            >
            <section className='shouye__operate'>
                <dl>
                    <dd>
                        <label>上传图片</label>
                        <FileUpload
                            type='image'
                            url={image_url}
                            {...this.props}
                            get={(image_url = '') => {
                                this.setState({
                                    image_url
                                })
                            }}/>
                            上传图片建议尺寸为375*250
                    </dd>
                    <dd>
                        <label>链接地址:</label>
                        <Input
                            addonBefore={preSelect}
                            onChange={e => this.setState({link: e.target.value})}
                            value={link}
                            placeholder="链接地址"/>

                    </dd>
                </dl>
            </section>
        </Modal>
    }

    render() {
        const {type} = this.props.match.params;
        const {loading, dragtype, none, drag, showImage,error} = this.state;

        return <section className='shouye__bannerPc'>

            <p id='topBanner'>轮播图管理</p>
            <div className='shouye__bannerPc__button'>
                <Button icon="plus" disabled={error} onClick={()=>{
                    this.setState({
                        modal:{
                            show:true,
                        },
                        addonBefore:'https://',
                        link:'',
                        image_url:'',
                    })
                }}>新建</Button>
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

            <Modal width={1000} footer={null} visible={showImage.show}
              afterClose={()=>this.setState({showImage: Object.assign({},showImage,{src:''})})}
              onCancel={() => this.setState({showImage: Object.assign({},showImage,{show:false})})}>
                <img style={{
                    maxWidth: '100%',
                    margin: 'auto',
                    display: 'block'
                }} src={showImage.src} alt=""/>
            </Modal>
            {this._operateModal()}
        </section>
    }
}

export default withRouter(Lunbo);
