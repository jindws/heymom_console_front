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
import {hot} from 'react-hot-loader'
import DB from '@DB'
const {Option} = Select

class Operate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delete: {
                show: false,
                _id: null
            },
            loading: true,
            edit: {
                show: false,
                list:[],
            },
            List: [],
            error:false,
            dialogTitle:'',
            dragZindex: 9,
            dragtype: 'dashed',
            drag: false,
            _id:props.match.params._id,
            name:'',
        }
    }

    // _edit(_id,name) {
    //     if (_id) {//编辑
    //         this.setState({
    //           dialogTitle:'编辑模块',
    //               edit: {
    //                   show:true,
    //                   _id,
    //                   name,
    //               }
    //         })
    //     } else {//新增
    //         this.setState({
    //           dialogTitle:'添加模块',
    //           edit: {
    //               show:true,
    //           }
    //        })
    //     }
    // }

    componentWillMount(){
        this._getList()
        const {_id} = this.state

        DB.ShangCheng.getModuleName({
            _id
        }).then(({name})=>{
            this.setState({
                name
            })
        },({errorMsg})=>message.error(errorMsg))
    }

    _getList() {
        const {_id} = this.state
        DB.ShangCheng.moduleGoods({
            _id,
        })
        .then(({list:List}) =>
            this.setState({
                List,
                none:!List.length,
            }),({errorMsg})=>{
              notification['error']({message: '温馨提示', description: errorMsg})
              this.setState({
                 error: errorMsg,
              })
        })
        .then(()=>{
              this.setState({
                 loading: false
              })
        })
    }

    _hide(_id,hidden){
        DB.ShangCheng.hideMoKuai({
            _id,
            hidden,
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
                        <span>课程图片</span>
                        <div>课程名称</div>
                        <div>课程标签</div>
                        <div>课程状态</div>
                        <div>操作</div>
                    </dt>
                    <object ref={this.dragulaDecorator}>
                        {List.map((itm, ind) => <dd className='caidan__dd' key={`lecture_dd_${ind}`} data-id={itm._id}>
                            <span>
                                <img style={{
                                    maxWidth:'100%',
                                    height:100,
                                }}
                                src={itm.image}/>
                            </span>
                            <span>{itm.title}</span>
                            <span>{itm.category}</span>
                            <span>{itm.status?'上架':'下架'}</span>
                            <div>
                                {/* <Button type="primary" onClick={()=>location.hash=`shangcheng/shouye/module/${itm._id}`}>编辑</Button> */}
                                <Popconfirm
                                    title={`确认删除?`}
                                    onConfirm={this._operate.bind(this,false,itm._id)}
                                    okText="确定"
                                    cancelText="取消">
                                    <Button type='danger'>删除</Button>
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

    _operate(join,goodsId){
        const {edit,_id} = this.state
        DB.ShangCheng.moduleGoodsOperate({
            goodsId,
            ...edit,
            _id,
            join,
        }).then(()=>{
            message.success('操作成功')
            this._getList()
            this.setState({
                edit:{
                    ...edit,
                    show:false,
                    goodsId:undefined,
                }
            })
        },({errorMsg})=>[
            message.error(errorMsg)
        ])
        // const {name,_id} = edit
        // this.setState({
        //     edit:{
        //         ...edit,
        //         loading:true,
        //     }
        // })
        // DB.ShangCheng.operateMoKuai({
        //     _id,
        //     name,
        // }).then(()=>{
        //     this.setState({
        //         edit:{}
        //     })
        //     this._getList()
        // },({errorMsg})=>{
        //     this.setState({
        //         edit:{
        //             ...edit,
        //             loading:false,
        //         }
        //     })
        //     message.error(errorMsg)
        // })
    }

    async _drag() {
        const {drag,_id} = this.state
        if (drag) {
            this.setState({loading: true})
            const orders = document.querySelectorAll('.caidan__dd');
            const goods = [];
            for (let i = 0; i < orders.length; i++) {
                goods.push(orders[i].getAttribute('data-id'))
            }

            DB.ShangCheng.modulegoodsPX({
                goods,
                _id,
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
        const {edit,loading,error,dialogTitle,drag,none,dragtype,name,_id} = this.state;

        return <section className='lecturer'>
            <p id='topBanner'>{name}模块</p>
            <div className='shouye__bannerPc__button'>
                <Button icon="plus" onClick={()=>{
                    DB.ShangCheng.moduleAddGoodsList({
                        _id
                    }).then(({list})=>{
                        this.setState({
                            edit:{
                                ...edit,
                                show:true,
                                list,
                            }
                        })
                    },({errorMsg})=>{
                        message.error(errorMsg)
                    })
                }} disabled={error}>添加课程</Button>
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
            {/* <Modal title="温馨提示" visible={this.state.delete.show} onOk={() => {
                this.setState(prevState => ({delete: Object.assign({}, prevState.delete, {loading: true})}));
                this._delete_operate();
            }} confirmLoading={this.state.delete.loading} onCancel={() => this.setState(prevState => ({delete: Object.assign({}, prevState.delete, {show: false})}))}>
                <p>确认删除项目?</p>
            </Modal> */}
            <Modal
                maskClosable={false}
                title='添加课程'
                visible={edit.show}
                maskClosable = {false}
                cancelText='取消'
                okText='确定'
                footer={
                    <Button
                        type="primary"
                        disabled={!edit.goodsId}
                        loading={edit.loading}
                        onClick={this._operate.bind(this,true)}>确定</Button>
                }
                onCancel={() => {
                    this.setState({
                        edit: {
                            ...edit,
                            show: false
                        }
                    })
                }}>
                <dl className='lecturer__edit'>
                    <dd>
                        <label>选择课程:</label>
                        <Select style={{ width: 200 }}
                          placeholder='请选择课程'
                          value={edit.goodsId}
                          onChange = {goodsId=>{
                              this.setState({
                                  edit:{
                                      ...edit,
                                      goodsId
                                  }
                              })
                          }}
                         >
                          {edit.list.map(itm=><Option key={itm._id} value={itm._id}>{itm.title}</Option>)}
                        </Select>
                    </dd>
                </dl>
            </Modal>
        </section>
    }
}

export default hot(module)(Operate)
