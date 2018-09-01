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
    Upload,
} from 'antd'
import DB from '@DB'
import {hot} from 'react-hot-loader'
const {Search} = Input
const {Option} = Select
import moment from 'moment'
import FileUpload from '@modules/FileUpload'

class Audio extends PureComponent{

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
      fileList: [],
      uploading: false,
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
    DB.Mean.list({
      pageNum,
      pageSize,
      name,
      type:'audio',
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
      DB.Mean.delete({
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
                <li>音频名称</li>
                <li>上传时间</li>
                <li>状态</li>
                <li>操作</li>
              </ul>
            </dt>
            {
                list.map((itm)=>(
                    <dd key={itm._id}>
                        <ul className='source_list'>
                            <li>{itm.name}</li>
                            <li>{itm.uploadTime?moment(itm.uploadTime).format('YYYY-MM-DD HH:mm'):''}</li>
                            <li>{itm.status?'有效':'无效'}</li>
                            <li>
                                <Popconfirm title="确认删除?" onConfirm={this._delete.bind(this,itm._id)} okText="删除" cancelText="取消">
                                       <Button disabled={itm.lock} type='danger'>删除</Button>
                                </Popconfirm>
                                &nbsp;
                                <Button onClick={()=>{
                                    this.setState({
                                        confirm:{
                                          ...itm,
                                          title:'编辑音频',
                                          show:true,
                                        }
                                    })
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

  _add(){
    this.setState({
        showEdit:true,
        confirm:{
            show:true,
            title:'新建音频',
            status:1,
        }
    })
  }

  _Save(){
    const {confirm} = this.state

    DB.Mean.operate({
        ...confirm,
        type:'audio',
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

  // handleUpload = () => {
  //   const { fileList } = this.state;
  //   const formData = new FormData();
  //   fileList.forEach((file) => {
  //     formData.append('files[]', file);
  //   });
  //
  //   this.setState({
  //     uploading: true,
  //   });
  //
  //   // You can use any AJAX library you like
  //   reqwest({
  //     url: '/api/uploadfile',
  //     method: 'post',
  //     processData: false,
  //     data: formData,
  //     success: () => {
  //       this.setState({
  //         fileList: [],
  //         uploading: false,
  //       });
  //       message.success('upload successfully.');
  //     },
  //     error: () => {
  //       this.setState({
  //         uploading: false,
  //       });
  //       message.error('upload failed.');
  //     },
  //   });
  // }

  render(){
    const {image_url,confirm,showEdit,loading,uploading} = this.state;

    const props = {
      action: '/api/uploadfile',
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));
        return false;
      },
      fileList: this.state.fileList,
    };


    return [
         <section key='title' id='title'>音频管理</section>,
         <section className='operate_button flex-space-between' key='operate_button'>
               <Button icon='plus' type="primary" onClick={this._add.bind(this)}>新建音频</Button>
               <Search
                  placeholder="请输入音频名称"
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
                音频名称:<Input value={confirm.name} placeholder="请输入音频名称"
                    onChange={e=>this.setState({
                        confirm:{
                            ...confirm,
                            name:e.target.value,
                        }
                    })}/>
              </div>
              <div className='input_inline'>
                状态:
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
                      <Option style={{ width: 200 }} value={1}>有效</Option>
                      <Option value={0}>无效</Option>
                    </Select>
                </div>
                <div className='input_inline'>
                    上传音频:<FileUpload
                        url={confirm.link}
                        type='audio'
                        {...this.props}
                        get={(link = '') => this.setState({
                            confirm:{
                                ...confirm,
                                link,
                            }
                      })}/>
                </div>
                {/* <div className='file'>
                    上传/替换音频:
                    <Upload {...props}>
                          <Button>
                            <Icon type="upload" /> 选择文件
                          </Button>
                        </Upload>
                        <Button
                          className="upload-demo-start"
                          type="primary"
                          onClick={this.handleUpload}
                          disabled={this.state.fileList.length === 0}
                          loading={uploading}
                        >
                          {uploading ? 'Uploading' : 'Start Upload' }
                    </Button>
                </div>
                <div className="ant-upload-list ant-upload-list-text" style={{
                    display:(confirm.link?'':'none')
                }}>
                    <div className="ant-upload-list-item ant-upload-list-item-done show">
                        <div className="ant-upload-list-item-info">
                            <span>
                                <i className="anticon anticon-paper-clip"></i>
                                <span className="ant-upload-list-item-name" title={confirm.link}>{confirm.link&&confirm.link.substring(109)}</span>
                            </span>
                        </div>
                        <i title="Remove file" className="anticon anticon-cross" onClick={e=>{
                            this.setState({
                                confirm:{
                                    ...confirm,
                                    link:'',
                                }
                            })
                        }}></i>
                    </div>
                </div> */}
       </Modal>,
    ]
  }
}

export default hot(module)(Audio)
