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
import FileUpload from '@modules/FileUpload'

class XianSuo extends PureComponent{

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
      upload:{},
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

    DB.Clue.list({
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
                <li>线索名称</li>
                <li>手机号码</li>
                <li>备注</li>
                <li>操作</li>
              </ul>
            </dt>
            {
                list.map((itm)=>(
                    <dd key={itm._id}>
                        <ul className='source_list kechenglist'>
                            <li>{itm.name}</li>
                            <li>{itm.phone}</li>
                            <li>{itm.remark}</li>
                            <li>
                                <Popconfirm title="确认删除?" onConfirm={this._delete.bind(this,itm._id)} okText="删除" cancelText="取消">
                                       <Button disabled={itm.lock} type='danger'>删除</Button>
                                </Popconfirm>
                                &nbsp;
                                <Button
                                    onClick={()=>{
                                        this.setState({
                                            edit:{
                                                ...itm,
                                                show:true,
                                                title:'编辑线索',
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
    DB.Clue.operate(edit)
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

  _Upload(){
      this.setState({
          upload:{
              show:true,
          }
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
        upload,
    } = this.state

    return [
         <section key='title' id='title'>线索管理</section>,
         <section className='operate_button' key='operate_button'>
                <Button icon='plus' type="primary" onClick={()=>{
                    this.setState({
                        edit:{
                            show:true,
                            title:'新建线索',
                        }
                    })
                }}>手动添加</Button>
               <Button icon='plus'
                   onClick={this._Upload.bind(this)}
                   type="default" style={{
                   marginLeft:20,
               }}>批量导入</Button>
         </section>,
         <section key='div' className='xiansuo__find'>
            <span>线索名称: &nbsp;
                <Input
                    value={search.name}
                    placeholder='请输入线索名称'
                    onChange={({target})=>{
                    this.setState({
                        search:{
                            ...search,
                            name:target.value,
                        }
                    })
            }}/></span>
            <span>手机号码:&nbsp; <Input
                value={search.phone}
                placeholder='请输入手机号码'
                onChange={({target})=>{
                    const phone = target.value.replace(/\D/g,'')
                    this.setState({
                        search:{
                            ...search,
                            phone,
                        }
                    })
                }}/></span>
            <div>
                <Button type='primary' onClick={this._getList.bind(this)}>查询</Button>
                <Button onClick={()=>{
                    this.setState({
                        search:{}
                    })
                }}>重置</Button>
            </div>
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
               disabled={!edit.name||!edit.phone}
               onClick={this._Save.bind(this)}>确定</Button>
              ]}
         >
             <div className='input_inline'>
                线索名称:&nbsp;<Input value={edit.name} placeholder="请输入线索名称"
                    onChange={e=>this.setState({
                        edit:{
                            ...edit,
                            name:e.target.value,
                        }
                    })}/>
              </div>
              <div className='input_inline'>
                 &nbsp;&nbsp;&nbsp;&nbsp;手机号:&nbsp;<Input
                     maxLength={11}
                     value={edit.phone} placeholder="请输入手机号"
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
               <div className='input_inline'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  备注:&nbsp;<TextArea autosize value={edit.remark} placeholder="请输入备注内容"
                      onChange={e=>this.setState({
                          edit:{
                              ...edit,
                              remark:e.target.value,
                          }
                      })}/>
                </div>
       </Modal>,
       <Modal
           key='file'
           title='批量导入'
           visible={upload.show}
           okText='确定'
           cancelText='取消'
           onCancel = {
               ()=>{
                   this.setState({
                       upload:{}
                   })
               }
           }
           onOk = {()=>{
               DB.Clue.multiadd({
                   url:upload.link,
               }).then(async ()=>{
                   await this.setState({
                       upload:{}
                   })
                   this._getList()
               },({errorMsg})=>{
                   message.error(errorMsg)
               })
           }}
       >
               <div className='input_inline'>
                   <span>格式demo:</span>
                   <a href="./crm/upload/upload.xlsx" target='_blank'>点击打开demo</a>
               </div>
               <div className='input_inline'>
                   <span>上传文件:</span>
                   <FileUpload
                       type='file'
                       accept='application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                       url={upload.link}
                       {...this.props}
                       get={(link = '') => {
                           this.setState({
                               upload:{
                                   ...upload,
                                   link,
                               }
                           })
                       }}/>
               </div>
       </Modal>,
    ]
  }
}

export default hot(module)(XianSuo)
