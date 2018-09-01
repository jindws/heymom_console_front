import React,{PureComponent} from 'react'
import {
    Button,
    Input,
    Modal,
    Select,
    Tag,
    message,
    Popconfirm,
    notification,
    Icon,
    Pagination,
    Spin,
    Alert,
    Checkbox,
    InputNumber,
    DatePicker,
} from 'antd'
import moment from 'moment'
import DB from '@DB'
import {hot} from 'react-hot-loader'
const {TextArea} = Input
const {Option} = Select

class Main extends PureComponent{

  constructor(props){
    super(props)
    this.state = {
      showEdit:false,
      confirm:{},
      list:[],
      pageNum:1,
      search:'',
      count:0,
      loading:true,
      pageSize:10,
      teacherList:[],
      userId:props.match.params.userId,
    }
  }

  componentDidMount(){
      DB.XiTong.zhanghaoList().then(({list:teacherList})=>{
          this.setState({
              teacherList,
          })
      },({errorMsg})=>message.error(errorMsg))
      this._getList()
  }

  async _getList(){
    const {pageNum,search,pageSize,userId} = this.state;
    await this.setState({
      loading:true,
    })

    DB.YongHu.returnMainList({
      pageNum,
      pageSize,
      ...search,
      userId,
    }).then(({list,count})=>{
          this.setState({
            list,
            count,
          })
      },({errorMsg})=>{
          message.error(errorMsg)
      }).then(()=>{
          this.setState({
            loading:false,
          })
      })
  }

  _delete(_id){
      DB.Clue.delete({
          _id
      }).then(()=>{
          message.success('操作成功')
          this._getList()
      },({errorMsg})=>{
          message.error(errorMsg)
      })
  }

  _changeStatus(itm){
      DB.Source.changeStatus(itm).then(data=>this._getList())
  }

  _list(){
    const {list,count,loading,pageSize} = this.state;

    if(count){
      return [<dl className='list' key='list'>
            <dt>
              <ul>
                <li>回访时间</li>
                <li>回访人</li>
                <li>回访内容</li>
                <li>操作</li>
              </ul>
            </dt>
            {
                list.map((itm)=>(
                    <dd key={itm._id}>
                        <ul className='source_list kechenglist'>
                            <li>{moment(itm.time).format('YYYY-MM-DD HH:mm:SS')}</li>
                            <li>{itm.returnTeacher}</li>
                            <li>{itm.content}</li>
                            <li>
                                {/* <Popconfirm title="确认删除?" onConfirm={this._delete.bind(this,itm._id)} okText="删除" cancelText="取消">
                                       <Button disabled={itm.lock} type='danger'>删除</Button>
                                </Popconfirm>
                                &nbsp; */}
                                <Button
                                    onClick={()=>{
                                        this.setState({
                                            edit:{
                                                ...itm,
                                                show:true,
                                                title:'编辑回访记录',
                                            }
                                        })
                                    }}
                                    type='primary'>编辑</Button>
                            </li>
                        </ul>
                    </dd>
                ))
            }
          </dl>,
          <Pagination
            showQuickJumper
            defaultCurrent={1}
            total={count}
            defaultPageSize={pageSize}
            key='pagination'
            onChange={async pageNum=>{
              await this.setState({
                pageNum,
              })
              this._getList()
            }}
        />]
    }else if(!loading){
        return <Alert
            message="温馨提示"
            description="暂无数据,请点击新建添加"
            type="warning"
            showIcon/>
    }
  }

  async _Save(){
    const {edit,userId} = this.state
    await this.setState({
        edit:{
            ...edit,
            loading:true,
        }
    })
    DB.YongHu.returnOperate({
        ...edit,
        userId,
    })
    .then(()=>{
        this.setState({
            edit:{}
        })
        this._getList()
    },({errorMsg})=>{
        message.error(errorMsg)
        this.setState({
            edit:{
                ...edit,
                loading:false,
            }
        })
    })
  }

  render(){

    const {
        image_url,
        confirm,
        showEdit,
        loading,
        search,
        edit = {},
        teacherList
    } = this.state;

    return [
         <section key='title' id='title'>回访记录</section>,
         <section className='operate_button flex-space-between' key='operate_button'>
                <Button icon='plus' type="primary" onClick={()=>{
                    this.setState({
                        edit:{
                            show:true,
                            title:'新建回访记录',
                            time:Date.now(),
                        }
                    })
                }}>新建回访记录</Button>
         </section>,
         <section key='div' className='xiansuo__find'>
            {/* <span>回访人: &nbsp;
                <Select
                    style={{ width: 150 }}
                  value={search.returnTeacherId}
                  placeholder='请选择回访人'
                  onChange = {returnTeacherId=>{
                          this.setState({
                              search:{
                                  ...search,
                                  returnTeacherId,
                              }
                          })
                      }
                    }
                >
                  {
                      teacherList.map(itm=><Option key={itm._id} value={itm._id}>{itm.weixin}</Option>)
                  }
                </Select>
            </span>

            <div>
                <Button type='primary' onClick={this._getList.bind(this)}>查询</Button>
                <Button onClick={()=>{
                    this.setState({
                        search:{}
                    })
                }}>重置</Button>
            </div> */}
         </section>,
         <Spin key='main' spinning={loading}>
            {this._list()}
         </Spin>,
         <Modal key='edit'
           title={edit.title}
           visible={edit.show}
           maskClosable={false}
           closable={false}
           // onCancel={()=>this.setState({
           //   showEdit:false,
           // })}
           footer={[
             <Button
             // size='large'
             type="danger"
             key='cancel'
             onClick={()=>this.setState({
               edit:{},
            })}>取消</Button>,
             <Button
               // size='large'
               type="primary"
               key='ok'
               loading={edit.loading}
               disabled={!edit.returnTeacherId}
               onClick={this._Save.bind(this)}>确定</Button>
              ]}
         >
             <div className='input_inline'>
                回访人:&nbsp;
                <Select
                    style={{ width: 150 }}
                  value={edit.returnTeacherId}
                  placeholder='请选择回访人'
                  onChange = {returnTeacherId=>{
                      this.setState({
                          edit:{
                              ...edit,
                              returnTeacherId,
                          }
                      })
                  }
                }>
                  {
                      teacherList.map(itm=><Option key={itm._id}>{itm.weixin}</Option>)
                  }
                </Select>
              </div>
              <div className='input_inline'>
                 回访时间:&nbsp;
                 <DatePicker
                     placeholder='请选择回访时间'
                     showTime
                     format="YYYY/MM/DD HH:mm:ss"
                     value={moment(edit.time)}
                     onChange={e => {
                         let time;
                         if(e){
                             time = e.valueOf()
                         }
                        this.setState({
                            edit:{
                                ...edit,
                                time,
                            }
                        })
                    }}/>
                 {/* <Input value={edit.phone} placeholder="请输入手机号"
                     onChange={({target})=>{
                            const phone = target.value.replace(/\D/g,'')
                             this.setState({
                             edit:{
                                 ...edit,
                                 phone,
                             }
                        })
                     }}/> */}
               </div>
               <div className='input_inline'>
                  回访内容:&nbsp;<TextArea autosize value={edit.content} placeholder="请输入回访内容"
                      onChange={e=>this.setState({
                          edit:{
                              ...edit,
                              content:e.target.value,
                          }
                      })}/>
                </div>
       </Modal>,
    ]
  }
}

export default hot(module)(Main)
