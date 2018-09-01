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
} from 'antd'
import DB from '@DB'
import {hot} from 'react-hot-loader'
const {Search} = Input
const {Option} = Select
import moment from 'moment'
import FileUpload from '@modules/FileUpload'

class ImgTxt extends PureComponent{

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
      buttonList:[
          'fontSize',
          'fontFamily',
          'fontFormat',
          'bold',
          'italic',
          'underline',
          'strikeThrough',
          'subscript',
          'superscript',
          'left',
          'center',
          'right',
          'justify',
          'ol',
          'ul',
          'forecolor',
          'bgcolor',
          'link',
          'unlink',

          'image2',
          'audio',
          'video',
          'xhtml',
      ],
    }
  }

  componentDidMount(){
    this._getList()
  }

  async _getList(){
    const {pageNum,search:name,pageSize} = this.state;
    await this.setState({
      loading:true,
    })
    DB.ImgTxt.list({
      pageNum,
      pageSize,
      name,
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
      DB.ImgTxt.delete({
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
                <li>图文名称</li>
                <li>图文封面</li>
                <li>状态</li>
                <li>操作</li>
              </ul>
            </dt>
            {
                list.map((itm)=>(
                    <dd key={itm._id}>
                        <ul className='source_list'>
                            <li>{itm.name}</li>
                            <li><img src={itm.cover}/></li>
                            <li>{itm.status?'上架':'下架'}</li>
                            <li>
                                <Popconfirm title="确认删除?" onConfirm={this._delete.bind(this,itm._id)} okText="删除" cancelText="取消">
                                       <Button disabled={itm.lock} type='danger'>删除</Button>
                                </Popconfirm>
                                &nbsp;
                                <Button onClick={async()=>{
                                    await this.setState({
                                        confirm:{
                                          ...itm,
                                          title:'编辑图文',
                                          show:true,
                                        }
                                    })
                                    this._modaleditor()
                                }} type='primary'>编辑</Button>
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

  async _add(){
    await this.setState({
        showEdit:true,
        confirm:{
            show:true,
            title:'新建图文',
            status:1,
        }
    })

    this._modaleditor()
  }

  _modaleditor(){
      const {buttonList} = this.state
      this.myNicEditor = new nicEditor({
          buttonList,
      });
      this.myNicEditor.setPanel('myNicPanel');
      this.myNicEditor.addInstance('myInstance');
  }

  _Save(){
    const {confirm} = this.state

    DB.ImgTxt.operate({
        ...confirm,
        // desc:encodeURIComponent(this.myInstance.innerHTML)
        desc:this.myInstance.innerHTML
    })
    .then(async ()=>{
        message.success('操作成功');
        await this.setState({
            confirm:{
                show:false,
            }
        })
        this._getList()
    },({errorMsg})=>message.error(errorMsg))
  }
  render(){
    const {image_url,confirm,showEdit,loading,uploading} = this.state;

    return [
         <section key='title' id='title'>图文管理</section>,
         <section className='operate_button flex-space-between' key='operate_button'>
               <Button icon='plus' type="primary" onClick={this._add.bind(this)}>新建图文</Button>
               <Search
                  placeholder="请输入图文名称"
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
           title={confirm.title}
           visible={confirm.show}
           maskClosable={false}
           keyboard={false}
           destroyOnClose={true}
           width={800}
           wrapClassName='mean_modal'
           onCancel={()=>this.setState({
             confirm:{
                 ...confirm,
                 show:false,
             }
           })}
           footer={[
             <Button
             type="danger"
             key='cancel'
             onClick={()=>this.setState({
               confirm:{
                   ...confirm,
                   show:false,
               }
            })}>取消</Button>,
             <Button
               // size='large'
               type="primary"
               key='ok'
               disabled={!confirm.name}
               onClick={this._Save.bind(this)}>确定</Button>
              ]}
         >
             <div className='input_inline'>
                <span>图文名称:</span><Input value={confirm.name} placeholder="请输入图文名称"
                    onChange={e=>this.setState({
                        confirm:{
                            ...confirm,
                            name:e.target.value,
                        }
                    })}/>
              </div>
              <div className='input_inline'>
                 <span>简介:</span><Input value={confirm.synopsis} placeholder="请输入简介"
                     onChange={e=>this.setState({
                         confirm:{
                             ...confirm,
                             synopsis:e.target.value,
                         }
                     })}/>
               </div>
              <div className='input_inline'>
                <span>状态:</span>
                <Select
                  style={{ width: 200 }}
                  value={confirm.status}
                  onChange = {status=>{
                      this.setState({
                          confirm:{
                              ...confirm,
                              status
                          }
                      })
                  }
                }>
                      <Option style={{ width: 200 }} value={1}>上架</Option>
                      <Option value={0}>下架</Option>
                  </Select>
              </div>
                <div className='input_inline'>
                    <span>图文封面:</span>
                    <FileUpload
                        type='image'
                        url={confirm.cover}
                        {...this.props}
                        get={(cover = '') => {
                            this.setState({
                                confirm:{
                                    ...confirm,
                                    cover,
                                }
                            })
                        }}/>
                </div>
                <div id="myNicPanel"></div>
                <div ref={myInstance=>this.myInstance=myInstance}
                     id="myInstance"
                     dangerouslySetInnerHTML={{
                         __html:confirm.desc,
                     }}>
                </div>

                <FileUpload
                    type={this.state.type||'image'}
                    hide={true}
                    {...this.props}
                    get={(url = '') => {
                        const HTML = nicEditors.findEditor('myInstance').getContent()

                        const {type='image'} = this.state
                        if(type === 'image'){
                            nicEditors.findEditor('myInstance').setContent(HTML+`<img src="${url}"/>`)
                        }else if(type === 'audio'){
                            nicEditors.findEditor('myInstance').setContent(HTML+`
                                <div><br/></div>
                                <audio controls class='media-js' src="${url}"></audio>
                                <div><br/></div>`)
                        }else if(type === 'video'){
                            nicEditors.findEditor('myInstance').setContent(HTML+`
                                <div><br/></div>
                                <video controls webkit-playsinline playsinline class='js-video media-js' src="${url}"></video>
                                <div><br/></div>
                                `)
                        }
                    }}/>

                <input type="hidden" id='addimage' onClick={async()=>{
                    await this.setState({
                        type:'image'
                    })
                    $('#myInstance').next().find('input')[0].click()
                }}/>
                <input type="hidden" id='addaudio' onClick={async()=>{
                    await this.setState({
                        type:'audio'
                    })
                    $('#myInstance').next().find('input')[0].click()
                }}/>
                <input type="hidden" id='addvideo' onClick={async()=>{
                    await this.setState({
                        type:'video'
                    })
                    $('#myInstance').next().find('input')[0].click()
                }}/>
       </Modal>,
    ]
  }
}

export default hot(module)(ImgTxt)
