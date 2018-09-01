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
const {TextArea} = Input
const {Option} = Select
import QRCode from 'qrcode'

class Channel extends PureComponent{

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

  _qrcode(_id,phone){
      QRCode.toDataURL(`${location.origin}?_id=${_id}`)
        .then(url => {
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          save_link.href = url;
          save_link.download = phone+'.jpg';
          var event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          save_link.dispatchEvent(event);
        })
        .catch(err => {
          console.error(err)
        })
  }

  componentDidMount(){
    this._getList()
  }

  async _getList(){
    const {pageNum,search,pageSize} = this.state;
    await this.setState({
      loading:true,
    })

    DB.Channel.list({
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

  _delete(_id){
      DB.Channel.delete({
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
      return [<dl className='list' key='list-0' id='channel'>
            <dt>
              <ul>
                <li>推广者名称</li>
                <li>手机号码</li>
                <li>邀请人数</li>
                <li>状态</li>
                <li>操作</li>
              </ul>
            </dt>
            {
                list.map((itm)=>(
                    <dd key={itm._id}>
                        <ul className='source_list kechenglist'>
                            <li>{itm.name}</li>
                            <li>{itm.phone}</li>
                            <li>{itm.inviteNum}</li>
                            <li>{itm.status?'生效':'失效'}</li>
                            <li>

                                <Button
                                    size='small'
                                    onClick={()=>{
                                        this.setState({
                                            edit:{
                                                ...itm,
                                                show:true,
                                                title:'编辑渠道',
                                            }
                                        })
                                    }}
                                    icon="edit"
                                    type='primary'>编辑</Button>
                                    <Button
                                        size='small'
                                        type='dashed'
                                        ghost
                                        onClick={this._qrcode.bind(this,itm._id,itm.phone)}
                                        icon="qrcode"
                                        type='primary'>二维码</Button>

                                    <Popconfirm title="确认修改状态?" onConfirm={()=>{
                                        DB.Channel.status({
                                            _id:itm._id,
                                            status:!itm.status,
                                        }).then(()=>{
                                            message.success('操作成功')
                                            this._getList()
                                        },({errorMsg})=>{
                                            message.error(errorMsg)
                                        })
                                    }} okText="确定" cancelText="取消">
                                           <Button size='small'
                                               icon={!itm.status?'check':'close' }
                                               type={itm.status?"danger":""}>{!itm.status?'生效':'失效'}</Button>
                                    </Popconfirm>
                                    <Popconfirm title="确认删除?" onConfirm={this._delete.bind(this,itm._id)} okText="删除" cancelText="取消">
                                           <Button size='small' type='danger' icon="delete" >删除</Button>
                                    </Popconfirm>
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

  _Save(){
    const {edit} = this.state

    const reg = new RegExp(
        /^(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57]|166)[0-9]{8}$/,
    )

    if(!reg.test(edit.phone)){
        message.error('手机号码格式不正确')
        return
    }

    this.setState({
        edit:{
            ...edit,
            loading:true,
        }
    })
    DB.Channel.operate(edit)
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
    const {image_url,confirm,showEdit,loading,search,edit={}} = this.state;

    return [
         <section key='title' id='title'>渠道管理</section>,
         <section className='operate_button flex-space-between' key='operate_button'>
                <Button icon='plus' type="primary" onClick={()=>{
                    this.setState({
                        edit:{
                            show:true,
                            title:'新建渠道',
                        }
                    })
                }}>新建渠道</Button>
         </section>,

         <Spin key='main' spinning={loading}>
            {this._list()}
         </Spin>,
         <Modal key='edit'
           title={edit.title}
           visible={edit.show}
           maskClosable={false}
           onCancel = {()=>{
               this.setState({
                 edit:{},
              })
           }}
           footer={[
             <Button
             type="danger"
             key='cancel'
             onClick={()=>this.setState({
               edit:{},
            })}>取消</Button>,
             <Button
               type="primary"
               key='ok'
               loading={edit.loading}
               disabled={!edit.name||!edit.phone}
               onClick={this._Save.bind(this)}>确定</Button>
              ]}
         >
             <div className='input_inline'>
                推广者名称:&nbsp;<Input value={edit.name} placeholder="请输入推广者名称"
                    onChange={e=>this.setState({
                        edit:{
                            ...edit,
                            name:e.target.value,
                        }
                    })}/>
              </div>
              <div className='input_inline'>
                 推广者手机号:&nbsp;<Input value={edit.phone} placeholder="请输入手机号"
                     onChange={({target})=>{
                            const phone = target.value.replace(/\D/g,'')
                            this.setState({
                             edit:{
                                 ...edit,
                                 phone,
                             }
                        })
                     }}/>
               </div>
       </Modal>,
    ]
  }
}

export default hot(module)(Channel)
