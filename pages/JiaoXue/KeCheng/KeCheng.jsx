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
    InputNumber
} from 'antd'
import DB from '@DB'
import {hot} from 'react-hot-loader'
const {Search} = Input
const {Option} = Select

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
    }
  }

  componentDidMount(){
    this._getList()
  }

  async _getList(){
    const {pageNum,search,pageSize} = this.state;
    await this.setState({
      loading:true,
    })

    DB.JiaoXue.getKeChengList({
      pageNum,
      pageSize,
      search,
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
      DB.JiaoXue.deleteKeCheng({
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
                <li>课程名称</li>
                <li>课程图片</li>
                {/* <li>课程老师</li> */}
                <li>课程原价</li>
                <li>课程现价</li>
                <li>状态</li>
                <li>操作</li>
              </ul>
            </dt>
            {
                list.map((itm)=>(
                    <dd key={itm._id}>
                        <ul className='source_list kechenglist'>
                            <li>{itm.title}</li>
                            <li><img src={itm.image}/></li>
                            {/* <li>{itm.teacher}</li> */}
                            <li>{itm.origin_bill}</li>
                            <li>{itm.bill}</li>
                            <li>{itm.status?'上架':'下架'}</li>
                            <li>
                                <Popconfirm title="确认修改状态?" onConfirm={()=>{
                                    DB.JiaoXue.status({
                                        _id:itm._id,
                                        status:!itm.status,
                                    }).then(()=>{
                                        message.success('操作成功')
                                        this._getList()
                                    },({errorMsg})=>{
                                        message.error(errorMsg)
                                    })
                                }} okText="确定" cancelText="取消">
                                       <Button size='small' type={itm.status?'danger':''} icon={itm.status?'close':'check'}>{!itm.status?'上架':'下架'}</Button>
                                </Popconfirm>
                                &nbsp;
                                <Popconfirm title="确认删除?此操作不可撤销" onConfirm={this._delete.bind(this,itm._id)} okText="删除" cancelText="取消">
                                       <Button size='small' type='dashed' shape="circle" icon='delete'></Button>
                                </Popconfirm>
                                &nbsp;
                                <Button
                                    size='small'
                                    onClick={()=>location.hash = `jiaoxue/kechengOperate/${itm._id}`}
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
    const {confirm} = this.state

    await DB.YongHu.userOperate(confirm)
    .then(async ()=>{
        await this.setState({
            showEdit:false,
        })
        this._getList()
    })
  }

  render(){
    const {image_url,confirm,showEdit,loading} = this.state;
    const {name,babyname,buykechengname,study=1,title} = confirm

    return [
         <section key='title' id='title'>课程管理</section>,
         <section className='operate_button flex-space-between' key='operate_button'>
                <Button icon='plus' type="primary" onClick={()=>{
                    DB.course.createCourse().then(({_id})=>{
                        location.hash = `jiaoxue/kechengOperate/${_id}`
                    })
                }}>新建课程</Button>
               {/* <Button icon='plus' type="primary" onClick={()=>location.hash='jiaoxue/kechengOperate'}>新建课程</Button> */}
               <Search
                  placeholder="请输入课程名称"
                  style={{ width: 200 }}
                  onSearch={async search => {
                    await this.setState({
                      search,
                      pageNum:1,
                    })
                    this._getList();
                  }}
                />
         </section>,
         <Spin key='main' spinning={loading}>
            {this._list()}
         </Spin>,
         <Modal key='edit'
           title={title}
           visible={showEdit}
           maskClosable={false}
           onCancel={()=>this.setState({
             showEdit:false,
           })}
           footer={[
             <Button
             // size='large'
             type="danger"
             icon="close"
             key='cancel'
             onClick={()=>this.setState({
               showEdit:false,
            })}>取消</Button>,
             <Button
               // size='large'
               type="primary"
               icon="check"
               key='ok'
               disabled={!name||!babyname||!buykechengname}
               onClick={()=>this._Save()}>确定</Button>
              ]}
         >
             <div className='input_inline'>
                <Input addonBefore="用户名称" value={name} placeholder="请输入用户名称"
                    onChange={e=>this.setState({
                        confirm:{
                            ...confirm,
                            name:e.target.value,
                        }
                    })}/>
              </div>
              <div className='input_inline'>
                 <Input addonBefore="孩子姓名" value={babyname} placeholder="请输入孩子姓名"
                     onChange={e=>this.setState({
                         confirm:{
                             ...confirm,
                             babyname:e.target.value,
                         }
                     })}/>
               </div>
               <div className='input_inline'>
                  <Input addonBefore="购买课程名称" value={buykechengname} placeholder="请输入购买课程名称"
                      onChange={e=>this.setState({
                          confirm:{
                              ...confirm,
                              buykechengname:e.target.value,
                          }
                      })}/>
                </div>
                <Tag>状态</Tag>
                <Select
                  style={{ width: 200 }}
                  value={study?1:0}
                  onChange = {study=>{
                      this.setState({
                          confirm:{
                              ...confirm,
                              study
                          }
                      })
                  }
                }>
                  <Option style={{ width: 200 }} value={1}>学习中</Option>
                  <Option value={0}>已结束</Option>
                </Select>
       </Modal>,
    ]
  }
}

export default hot(module)(ChaKan)
