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
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { RangePicker } = DatePicker
import locale from 'antd/lib/date-picker/locale/zh_CN';

class ChaKan extends PureComponent{

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
    }
  }

  componentDidMount(){
    this._getList()
    DB.XiTong.zhanghaoList().then(({list:teacherList})=>{
        this.setState({
            teacherList,
        })
    },({errorMsg})=>message.error(errorMsg))
  }

  async _getList(){
    const {pageNum,search,pageSize} = this.state;
    await this.setState({
      loading:true,
    })
    DB.YongHu.getUserList({
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
                <li>头像</li>
                <li>微信名称</li>
                <li>手机号码</li>
                <li>宝贝姓名</li>
                <li>宝贝性别</li>
                <li>宝贝生日</li>
                <li>宝贝年级</li>
                <li>责任老师</li>
                <li>备注</li>
                <li>操作</li>
              </ul>
            </dt>
            {
                list.map((itm)=>{
                    const {wx={},info={}} = itm
                    return <dd key={itm._id}>
                        <ul className='source_list'>
                            <li><img style={{maxWidth:'100%',marginLeft: 2,}} src={wx.headimgurl}/></li>
                            <li>{wx.nickname}</li>
                            <li>{itm.phone}</li>
                            <li>{info.child_name}</li>
                            <li>{info.sex === 1?'男':(info.sex === 0)?'女':''}</li>
                            <li>{info.birthday?moment(info.birthday).format('YYYY-MM-DD'):''}</li>
                            <li>{info.class}</li>
                            <li>{itm.teacher}</li>
                            <li>{itm.remark}</li>
                            <li>
                                {/* <Popconfirm title="确认删除?此操作不可撤销" onConfirm={this._delete.bind(this,itm._id)} okText="删除" cancelText="取消">
                                       <Button size='small' disabled={itm.lock} type='danger'>删除</Button>
                                </Popconfirm>
                                &nbsp; */}
                                <Button size='small' onClick={()=>{
                                    this.setState({
                                        confirm:{
                                          ...itm,
                                          title:'编辑用户',
                                          show:true,
                                        }
                                    })
                                }} type='primary'>编辑</Button>
                            </li>
                        </ul>
                    </dd>
                })
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
    const {confirm={}} = this.state
    // const reg = new RegExp(
    //     /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57]|166)[0-9]{8}$/,
    // )
    //
    // if(!reg.test(confirm.phone)){
    //     message.error('手机号格式不正确')
    //     return
    // }

    await DB.YongHu.userOperate(confirm)
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
    } = this.state


    const {wx={},info={}} = confirm||{}

    return [
         <section key='title' id='title'>用户管理</section>,
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
                     <Input value={search.weixin} placeholder="请输入微信名称"
                        onChange={e=>this.setState({
                            search:{
                                ...search,
                                weixin:e.target.value,
                            }
                        })}/>
                 </dd>
                 <dd>
                     <span>宝贝姓名:</span>
                     <Input value={search.babyname} placeholder="请输入宝贝姓名"
                        onChange={e=>this.setState({
                            search:{
                                ...search,
                                babyname:e.target.value,
                            }
                        })}/>
                 </dd>
                 <dd>
                     <span>宝贝性别:</span>
                    <Select
                        allowClear
                      style={{ width: 200 }}
                      value={search.sex}
                      placeholder='请选择性别'
                      onChange = {sex=>{
                          this.setState({
                              search:{
                                  ...search,
                                  sex
                              }
                          })
                      }
                    }>
                      <Option style={{ width: 200 }} value={1}>男</Option>
                      <Option value={0}>女</Option>
                    </Select>
                 </dd>
                 <dd>
                     <span>手机号:</span>
                     <Input value={search.mobile}
                         // maxLength = {11}
                         placeholder="请输入手机号"
                        onChange={e=>{
                            // let mobile = e.target.value
                            //
                            // if(mobile){
                            //     mobile = mobile.replace(/\D/g,'')
                            // }
                            this.setState({
                                search:{
                                    ...search,
                                    mobile:e.target.value
                                }
                            })
                        }}/>
                 </dd>
                 <dd>
                     <span>责任老师:</span>
                     <Select
                         style={{ width: 150 }}
                         allowClear
                       value={search.teacherId}
                       placeholder='请选择老师'
                       onChange = {teacherId=>{
                           this.setState({
                               search:{
                                   ...search,
                                   teacherId
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
                     <span>宝贝生日:</span>
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
           title={confirm.title}
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
               disabled={!wx.nickname}
               onClick={this._Save.bind(this)}>确定</Button>
              ]}
         >
             <div className='input_inline'>
                 <span>微信名称:</span>
                 <Input value={wx.nickname} placeholder="请输入微信名称"
                    onChange={e=>this.setState({
                        confirm:{
                            ...confirm,
                            wx:{
                                ...wx,
                                nickname:e.target.value,
                            }
                        }
                    })}/>
              </div>

              <div className='input_inline'>
                  <span>手机号:</span>
                  <Input
                      value={confirm.phone}
                      placeholder="请输入手机号"
                     onChange={e=>{
                         // let phone = e.target.value
                         //
                         // if(phone){
                         //     phone = phone.replace(/\D/g,'')
                         // }
                         this.setState({
                             confirm:{
                                 ...confirm,
                                 phone:e.target.value,
                             }
                         })}}/>
               </div>

               <div className='input_inline'>
                   <span>宝贝姓名:</span>
                   <Input value={info.child_name} placeholder="请输入宝贝姓名"
                      onChange={e=>this.setState({
                          confirm:{
                              ...confirm,
                              info:{
                                  ...info,
                                  child_name:e.target.value,
                              }
                          }
                      })}/>
                </div>

                <div className='input_inline'>
                    <span>宝贝性别:</span>
                    <Select
                      style={{ width: 200 }}
                      value={info.sex}
                      placeholder='请选择性别'
                      onChange = {sex=>{
                          this.setState({
                              confirm:{
                                  ...confirm,
                                  info:{
                                      ...info,
                                      sex,
                                  }
                              }
                          })
                      }
                    }>
                      <Option style={{ width: 200 }} value={1}>男</Option>
                      <Option value={0}>女</Option>
                    </Select>
                </div>


              <div className='input_inline'>
                 <span>宝贝生日:</span>
                 <DatePicker
                     value={info.birthday?moment(info.birthday):undefined}
                     placeholder="请选择宝贝生日"
                     locale={locale}
                     onChange={e=>{
                         this.setState({
                             confirm:{
                                 ...confirm,
                                 info:{
                                     ...info,
                                     birthday:e.valueOf()
                                 }
                             }
                         })
                     }}/>
               </div>

               <div className='input_inline'>
                  <span>宝贝年级:</span>
                  <Select
                    style={{ width: 200 }}
                    value={info.class}
                    placeholder='请选择年级'
                    onChange = {_class =>{
                        this.setState({
                            confirm:{
                                ...confirm,
                                info:{
                                    ...info,
                                    class:_class,
                                }
                            }
                        })
                    }
                  }>
                    {
                        ['一年级','二年级','三年级','四年级','五年级','六年级','学前班','托班','大班','中班','小班']
                        .map(itm=><Option key={itm}>{itm}</Option>)
                    }
                  </Select>
                </div>

                <div className='input_inline'>
                   <span>责任老师:</span>
                   <Select
                     style={{ width: 200 }}
                     value={confirm.teacherId}
                     placeholder='请选择老师'
                     onChange = {teacherId=>{
                         this.setState({
                             confirm:{
                                 ...confirm,
                                 teacherId
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
                   <span>备注:</span>
                   <TextArea autosize value={confirm.remark} placeholder="请输入备注"
                       onChange={e=>this.setState({
                           confirm:{
                               ...confirm,
                               remark:e.target.value,
                           }
                       })}/>
                 </div>
       </Modal>,
    ]
  }
}

export default hot(module)(ChaKan)
