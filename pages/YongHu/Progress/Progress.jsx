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
      // teacherList:[],
      courseList:[],
      courseName:[],
      progresslist:[],
    }
  }

  componentDidMount(){
    this._getList()
    // DB.XiTong.zhanghaoList().then(({list:teacherList})=>{
    //     this.setState({
    //         teacherList,
    //     })
    // },({errorMsg})=>message.error(errorMsg))
    // DB.XiTong.zhanghaoList().then()
    DB.JiaoXue.getKeChengListTitle().then(({list:courseName})=>{
        this.setState({
            courseName
        })
    })
  }

  async _getList(){
    const {pageNum, search, pageSize} = this.state;
    await this.setState({
      loading:true,
    })
    DB.YongHu.getProgressList({
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
    const {list,count,loading,pageSize,pageNum} = this.state;

    if(count){
      return [<dl className='list' key='list'>
            <dt>
              <ul>
                <li>微信名称</li>
                <li>手机号码</li>
                <li>宝贝姓名</li>
                <li>课程名称</li>
                <li>开课时间</li>
                <li>学习进度</li>
                <li>状态</li>
                {/* <li>备注</li> */}
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
                            <li className='mul'>
                                    {
                                        itm.list.map((it,ind)=><ol key={ind}>
                                            <li>{it.title}</li>
                                            <li>{it.create_time?moment(it.create_time).format('YYYY-MM-DD'):''}</li>
                                            <li>{it.course}</li>
                                            <li>{it.status}</li>
                                            {/* <li></li> */}
                                            <li className='operate'>
                                                <Button onClick={()=>{
                                                    DB.course.list2({
                                                        _id:it.goodsId,
                                                    })
                                                    .then(({list:courseList})=>{
                                                        this.setState({
                                                            courseList,
                                                            confirm:{
                                                                show:true,
                                                                ...it,
                                                            }
                                                        })
                                                    })
                                                }} size='small'>修改进度</Button>

                                                <Button onClick={()=>{
                                                    location.hash = `yonghu/return/${it.userId}`
                                                }}
                                                type='primary'
                                                size='small'>添加回访记录</Button>
                                                <Popconfirm title="确认删除?此操作不可撤销" onConfirm={()=>{
                                                    DB.YongHu.progressdelete({
                                                        _id:it._id
                                                    }).then(()=>{
                                                        message.success('操作成功')
                                                        this._getList()
                                                    },({errorMsg})=>{
                                                        message.error(errorMsg)
                                                    })
                                                }} okText="删除" cancelText="取消">
                                                    <Button type='danger'
                                                    size='small'>删除</Button>
                                                </Popconfirm>

                                            </li>
                                        </ol>)
                                    }
                            </li>
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
            current={pageNum}
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
            description="暂无数据"
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
        // teacherList,
        search,
        courseList,
        courseName,
        progresslist,
    } = this.state

    return [
         <section key='title' id='title'>学习进度</section>,
         <section className='operate_button flex-space-between' key='operate_button'>
               {/* <Button icon='plus' type="primary" onClick={this._add.bind(this)}>新建用户</Button>
               <Search
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
                        onChange={e=>{
                            const phone =e.target.value.replace(/\D/g,'')
                            this.setState({
                                search:{
                                    ...search,
                                    phone,
                                }
                            })
                        }}/>
                 </dd>

                 <dd>
                     <span>开课时间:</span>
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


                 <dd>
                     <span>课程名称:</span>
                     {/* <Input value={search.courseName}
                        placeholder="请输入课程名称"
                        onChange={e=>this.setState({
                            search:{
                                ...search,
                                courseName:e.target.value,
                            }
                        })}/> */}
                     <Select
                         allowClear
                         style={{ width: 150 }}
                       value={search.goods_id}
                       placeholder='请选择课程名称'
                       onChange = {goods_id=>{
                           if(goods_id){
                               DB.course.list2({
                                   _id:goods_id
                               }).then(({list:progresslist})=>{
                                   this.setState({
                                       progresslist,
                                       search:{
                                           ...search,
                                           goods_id,
                                           step:undefined,
                                       }
                                   })
                               })
                           }else{
                               this.setState({
                                   progresslist:[],
                                   search:{
                                       ...search,
                                       goods_id:undefined,
                                       step:undefined,
                                   }
                               })
                           }
                       }
                     }>
                       {
                           courseName.map(itm=><Option key={itm._id}>{itm.title}</Option>)
                       }
                     </Select>
                 </dd>

                 <dd>
                     <span>学习进度:</span>
                     <Select
                         disabled={!search.goods_id}
                         allowClear
                         style={{ width: 150 }}
                       value={search.step}
                       placeholder='请选择学习进度'
                       onChange = {step=>{
                           this.setState({
                               search:{
                                   ...search,
                                   step,
                               }
                           })
                       }
                     }>
                       {
                           progresslist.map(itm=><Option key={itm._id}>{itm.title}</Option>)
                       }
                     </Select>
                     {/* <Input value={search.steps}
                        placeholder="请输入课次名称"
                        onChange={e=>{
                            // const steps =e.target.value.replace(/\D/g,'')
                            this.setState({
                                search:{
                                    ...search,
                                    steps:e.target.value,
                                }
                            })
                        }}/> */}
                </dd>

                {/* <dd>
                    <span>状态:</span>
                    <Select
                        style={{ width: 150 }}
                      value={search.goods_id}
                      placeholder='请选择课程名称'
                      onChange = {goods_id=>{
                          this.setState({
                              search:{
                                  ...search,
                                  goods_id,
                              }
                          })
                      }
                    }>
                      <Option key={itm._id}>学习中</Option>
                      <Option key={itm._id}>未开课</Option>
                      <Option key={itm._id}>已结束</Option>
                    </Select>
               </dd> */}

             </dl>
             <div>
                 <Button type='primary' onClick={async ()=>{
                     await this.setState({
                         pageNum:1,
                     })
                     this._getList()
                 }}>搜索</Button>
                 <Button onClick={()=>{
                     this.setState({
                         search:{
                             // phone:search.phone,
                         }
                     })
                 }}>重置</Button>
             </div>
         </section>,
         <Spin key='main' spinning={loading}>
            {this._list()}
         </Spin>,
         <Modal key='edit'
           title='修改进度'
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
               disabled={!confirm.courseId}
               onClick={this._Save.bind(this)}>确定</Button>
              ]}
         >
                <div className='input_inline'>
                    <span>选择进度:</span>
                    <Select
                      style={{ width: 350 }}
                      value={confirm.courseId}
                      placeholder='请选择进度'
                      onChange = {courseId=>{
                          this.setState({
                              confirm:{
                                  ...confirm,
                                  courseId
                              }
                          })
                      }
                    }>
                        {
                            courseList.map((itm,index)=><Option key={itm._id}>{itm.title}</Option>)
                        }
                    </Select>
                </div>
       </Modal>,
    ]
  }
}

export default hot(module)(Progress)
