import React,{PureComponent} from 'react'
import {Link} from 'react-router-dom'
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
import DB from '@DB'
import {hot} from 'react-hot-loader'
const {Search,TextArea} = Input
const {Option} = Select
import moment from 'moment'
const { RangePicker } = DatePicker

class Progress extends PureComponent{

  constructor(){
    super()
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
      courseList:[],
      userList:[],
    }
  }

  componentDidMount(){
    this._getList()
    DB.XiTong.zhanghaoList().then(({list:teacherList})=>{
        this.setState({
            teacherList,
        })
    },({errorMsg})=>message.error(errorMsg))


    DB.YongHu.getUserList2().then(({list:userList})=>{
        this.setState({
            userList,
        })
    })
  }

  async _getList(){
    const {pageNum, search, pageSize} = this.state;
    await this.setState({
      loading:true,
    })
    DB.YongHu.returnList({
      pageNum,
      pageSize,
      ...search,
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

  _edit(_id){
    DB.Source.detail({
      _id,
    }).then(data=>{
      const {content_from:from,logo:image_url} = data;
      this.setState({
        confirm:Object.assign({},data,{
          title:'编辑来源',
          edit:true,
          _id,
          from,
        }),
        showEdit:true,
        image_url,
      })
    },({errorMsg:description})=>{
      notification.open({
        message: '温馨提示',
        description,
        icon: <Icon type="frown" style={{ color: '#ccc' }} />,
      });
    })
  }

  _delete(_id){
      DB.YongHu.userDelete({
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
                <li>微信名称</li>
                <li>手机号码</li>
                <li>宝贝姓名</li>
                <li>宝贝年级</li>
                <li>责任老师</li>
                <li>回访人</li>
                <li>回访时间</li>
                <li>回访内容</li>
                <li>操作</li>
              </ul>
            </dt>
            {
                list.map((itm,index)=>(
                    <dd key={index}>
                        <ul className='source_list' id='progress_list'>
                            <li>{itm.wxname}</li>
                            <li>{itm.phone}</li>
                            <li>{itm.child_name}</li>
                            <li>{itm.class}</li>
                            <li></li>
                            <li>{itm.returnTeacher}</li>
                            <li>{moment(itm.time).format('YYYY-MM-DD HH:mm:SS')}</li>
                            <li>{itm.content}</li>
                            <li><Link to={`return/${itm.userId}`}>查看</Link></li>
                            {/* <li>
                                <Popconfirm title="确认删除?此操作不可撤销" onConfirm={this._delete.bind(this,itm._id)} okText="删除" cancelText="取消">
                                       <Button size='small' disabled={itm.lock} type='danger'>删除</Button>
                                </Popconfirm>
                                &nbsp;
                                <Button size='small' onClick={()=>{
                                    this.setState({
                                        confirm:{
                                          ...itm,
                                          title:'编辑用户',
                                          show:true,
                                        }
                                    })
                                }} type='primary'>编辑</Button>
                            </li> */}
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

  _add(){
    this.setState({
        showEdit:true,
        confirm:{
          show:true,
          title:'查看用户',
        }
    })
  }

  async _Save(){
    const {confirm} = this.state

    await DB.YongHu.progressupdate({
        ...confirm,
    })
    .then(async ()=>{
        await this.setState({
            confirm:{
                ...confirm,
                show:false,
            }
        })
        this._getList()
    },({errorMsg})=>message.error(errorMsg))
  }

  render(){
    const {
        image_url,
        confirm,
        showEdit,
        loading,
        teacherList,
        search,
        courseList,
        userList,
    } = this.state

    return [
         <section key='title' id='title'>回访记录</section>,
         <section className='operate_button flex-space-between' key='operate_button'>
               <Button icon='plus' type="primary" onClick={this._add.bind(this)}>新增</Button>
               {/* <Search
                  placeholder="请输入手机号"
                  style={{ width: 200 }}
                  onSearch={async phone => {
                    await this.setState({
                      search:{
                          phone
                      },
                      pageNum:1,
                    })
                    this._getList();
                  }}
                /> */}
         </section>,
         <section key='search' id='search'>
             筛选项
             <dl>
                 <dd>
                     <span>微信名称:</span>
                     <Input value={search.nickname} placeholder="请输入微信名称"
                        onChange={e=>this.setState({
                            search:{
                                ...search,
                                nickname:e.target.value,
                            }
                        })}/>
                 </dd>
                 <dd>
                     <span>宝贝姓名:</span>
                     <Input value={search.child_name}
                         placeholder="请输入宝贝姓名"
                         onChange={e=>this.setState({
                            search:{
                                ...search,
                                child_name:e.target.value,
                            }
                        })}/>
                 </dd>
                 <dd>
                     <span>手机号:</span>
                     <Input value={search.phone} placeholder="请输入手机号"
                        onChange={e=>this.setState({
                            search:{
                                ...search,
                                phone:e.target.value,
                            }
                        })}/>
                 </dd>

                 <dd>
                     <span>责任老师:</span>
                     <Select
                         style={{ width: 150 }}
                       value={search.teacherId}
                       placeholder='请选择责任老师'
                       onChange = {teacherId=>{
                           this.setState({
                               search:{
                                   ...search,
                                   teacherId,
                               }
                           })
                       }
                     }>
                       {
                           teacherList.map(itm=><Option key={itm._id}>{itm.weixin}</Option>)
                       }
                     </Select>
                 </dd>


                 <dd>
                     <span>回访人:</span>
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
                     }>
                       {
                           teacherList.map(itm=><Option key={itm._id}>{itm.weixin}</Option>)
                       }
                     </Select>
                 </dd>

                 <dd>
                     <span>回访时间:</span>
                     <RangePicker
                         placeholder={['开始时间','结束时间']}
                         value={search.startTime?[moment(search.startTime),moment(search.endTime)]:[undefined,undefined]}
                          onChange={e=>{
                              let startTime,endTime
                              if(e.length){
                                  startTime = e[0].valueOf()
                                  endTime = e[1].valueOf()
                              }
                              this.setState({
                                  search:{
                                      ...search,
                                      startTime,
                                      endTime,
                                  }
                              })
                         }} />
                 </dd>

             </dl>
             <div>
                 <Button type='primary' onClick={()=>{
                     this.setState({
                         search:{
                             ...search,
                             phone:'',
                         }
                     })
                     this._getList()
                 }}>搜索</Button>
                 <Button onClick={()=>{
                     this.setState({
                         search:{
                             phone:search.phone,
                         }
                     })
                 }}>重置</Button>
             </div>
         </section>,
         <Spin key='main' spinning={loading}>
            {this._list()}
         </Spin>,
         <Modal key='edit'
           title='新增回访记录'
           visible={confirm.show}
           maskClosable={false}
           onCancel={()=>this.setState({
               confirm:{
                   ...confirm,
                   show:false
               }
           })}
           footer={[
             <Button
             type="danger"
             key='cancel'
             onClick={()=>this.setState({
               confirm:{
                   ...confirm,
                   show:false
               }
            })}>取消</Button>,
             <Button
               type="primary"
               key='ok'
               disabled={!confirm.userId}
               onClick={()=>{
                   location.hash = `yonghu/return/${confirm.userId}`
               }}>确定</Button>
              ]}
         >
                <div className='input_inline'>
                    <span>选择用户:</span>
                    <Select
                      style={{ width: 200 }}
                      value={confirm.userId}
                      placeholder='请选择用户'
                      onChange = {userId=>{
                          this.setState({
                              confirm:{
                                  ...confirm,
                                  userId
                              }
                          })
                      }
                    }>
                        {
                            userList.map((itm,index)=><Option style={{ width: 200 }} key={itm._id}>{itm.name}</Option>)
                        }
                    </Select>
                </div>
       </Modal>,
    ]
  }
}

export default hot(module)(Progress)
