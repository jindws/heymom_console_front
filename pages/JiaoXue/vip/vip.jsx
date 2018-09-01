import React, {Component} from 'react'
import DB from '@DB'
import { connect } from 'react-redux'
import moment from 'moment'
import UUID from 'uuid/v1'
import {withRouter} from 'react-router-dom'
// var Promise = require('es6-promise').Promise;

import {
    Input,
    Upload,
    Icon,
    Modal,
    DatePicker,
    Select,
    Radio,
    Button,
    Spin,
    message,
    notification,
    Alert,
    Popconfirm,
} from 'antd'
const Option = Select.Option;
const RadioGroup = Radio.Group;
import FileUpload from '@modules/FileUpload'

import UploadModule from '@modules/UploadModule'
import ShowContent from '@modules/ShowContent'
import EditContent from '@modules/EditContent'
import { receiveVipData,addVipContent,addVipAnnex,removeVipAnnex,addVipContentObj } from '../../../actions/vipcourse'

class EditVipCourse extends Component {
    constructor(props){
        super(props)
        const t = this
        this.state = {
            edit:{},
            previewVisible: false,
            previewImage: '',
            cover_240x140: [],
            cover_750x300: [],

            // 课程分类
            tags:[],

            // 附件列表
            annex:[],

            // 教师列表
            teacherList:[],

            // 初始获取数据是否成功
            getDataSuccess:false,
            _id:props.match.params.courseId,
            courseList:[],
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

                'indent',
                'outdent',
                'hr',

                'image2',
                'audio',
                'video',
                'xhtml',
            ],
        }

        $('body').addClass('nicEdit-pane2')

        this.getInitData(this.props.match.params.courseId)
    }


    componentWillUnMount(){
        $('body').removeClass('nicEdit-pane2')
    }

    addImage(){
        this.setState({
            loading:true,
            addModal:{
                show:true,
                type:'image',
            }
        })
        DB.Mean.list({
          type:'image',
          all:true,
        }).then(({list:addlist})=>{
              this.setState({
                addlist,

              })
          },({errorMsg})=>{
              message.error(errorMsg)
          }).then(()=>{
              this.setState({
                loading:false,
              })
          })
    }

    addAudio(){
        this.setState({
            loading:true,
            addModal:{
                show:true,
                type:'audio',
            }
        })
        DB.Mean.list({
          type:'audio',
          all:true,
        }).then(({list:addlist})=>{
              this.setState({
                addlist,
              })
          },({errorMsg})=>{
              message.error(errorMsg)
          }).then(()=>{
              this.setState({
                loading:false,
              })
          })
    }

    addVideo(){
        this.setState({
            loading:true,
            addModal:{
                show:true,
                type:'video',
            }
        })
        DB.Mean.list({
          type:'video',
          all:true,
        }).then(({list:addlist})=>{
              this.setState({
                addlist,
              })
          },({errorMsg})=>{
              message.error(errorMsg)
          }).then(()=>{
              this.setState({
                loading:false,
              })
          })
    }

    componentDidMount(){
        const {buttonList} = this.state
        this.myNicEditor = new nicEditor({
            buttonList,
        });
        this.myNicEditor.setPanel('myNicPanel');
        this.myNicEditor.addInstance('myInstance');

        DB.XiTong.zhanghaoList().then(({list:teacherList})=>{
            this.setState({
                teacherList,
            })
        },({errorMsg})=>message.error(errorMsg))

        DB.course.tagList().then(({list})=>{
            this.setState({
                tags:list
            })
        },(res)=>{
            notification.error({
                message: '警告',
                description: '获取课程分类失败，请刷新重试',
            });
        })

        DB.course.courseDetail({
            _id:this.state._id,
        }).then(({courses,...edit})=>{
            this.setState({
                edit,
                getDataSuccess:true,
                loading:false,
                // desc,
            })

            // myNicEditor&&myNicEditor.findEditor('myNicPanel').setContent(this.state.desc)

            this.props.receiveVipData({
                courses,
            })
        })
        this._getCourseList()
    }

    _getCourseList(){
        DB.course.list2({
            _id:this.state._id,
        }).then(({list:courseList})=>{
            this.setState({
                courseList,
            })
        },({errorMsg})=>{
            message.error(errorMsg)
        })
    }


    getInitData = (course_id) =>{
        Promise.all([
            // DB.course.tagList().then(({list})=>{
    		// 	this.setState({
    		// 		tags:list
    		// 	})
    		// },(res)=>{
    		// 	notification.error({
            //         message: '警告',
            //         description: '获取课程分类失败，请刷新重试',
            //     });
    		// }),
            // DB.course.teacherList().then((teacherList)=>{
    		// 	this.setState({
    		// 		teacherList
    		// 	})
    		// },(res)=>{
    		// 	notification.error({
            //         message: '警告',
            //         description: '获取教师列表失败，请刷新重试',
            //     });
    		// })
        ]).then(()=>{
            if(course_id === 'big' || course_id === 'vip'||true) {
                const title = '';
                const type = (course_id === 'big'?'大课':'VIP课程');
                const cover_240x140 = '';
                const cover_750x300 = '';
                const desc = '';
                    // up_time = '';
                    // down_time = '';
                const bill_type = 'mianfei';
                const category = '';
                const bill = '';
                // 原价
                const origin_bill = '';
                // 截止时间
                const cutoff_time = '';
                    // bill_origin = '';
                const jianjie = '';
                    // class_room = '';
                const courses = [];
                // 学习次数
                // const learn_count = 1500

                this.props.receiveVipData({
                    title,
                    type,
                    cover_240x140,
                    cover_750x300,
                    desc,
                    // up_time,
                    // down_time,
                    category,
                    bill,
                    // bill_origin,
                    jianjie,
                    bill_type,
                    courses,
                    // learn_count,
                    // courses:[{
                    //     desc:'dddd',
                    //     title:'j',
                    //     teacher_id:'5944e743c4b999dc3903ee0e',
                    //     annex:["https://cdn.xueyuan.xiaobao100.com/course/f46a8960-54a1-11e7-a4e3-6d582592308e_test.pptx"]
                    // }],
                    loading:false,
                })
                this.setState({
                    getDataSuccess:true,
                })
            }else{
                DB.course.courseDetail({
                    _id:course_id,
                }).then(data=>{
                    // console.log(data)
                    const {
                        title = '',
                        type = '',
                        _id = '',
                        cover_240x140 = '',
                        cover_750x300 = '',
                        desc = '',
                        // up_time = '',
                        // down_time = '',
                        category = '',
                        bill = '',
                        origin_bill,
                        // 截止时间
                        cutoff_time,
                        // bill_origin = '',
                        jianjie = '',
                        bill_type = 'mianfei',
                        // course_id = [],
                        courses = [],
                        // 学习次数
                    } = data;
                    let temCourses = courses.map((item)=>{
                        delete item.__v;
                        delete item.create_time;
                        item.uuid = UUID();
                        item.edit = false;
                        return item;
                    })

                    this.props.receiveVipData({
                        title,
                        type,
                        _id,
                        cover_240x140,
                        cover_750x300,
                        desc,
                        // up_time,
                        // down_time,
                        category,
                        bill,
                        origin_bill,
                        // 截止时间
                        cutoff_time,
                        // bill_origin,
                        jianjie,
                        bill_type,
                        courses:temCourses,
                        // courses:[{
                        //     desc:'dddd',
                        //     title:'j',
                        //     teacher_id:'5944e743c4b999dc3903ee0e',
                        //     annex:["https://cdn.xueyuan.xiaobao100.com/course/f46a8960-54a1-11e7-a4e3-6d582592308e_test.pptx"]
                        // }],
                        loading:false,
                    })
                    this.setState({
                        getDataSuccess:true,
                    })

                },res=>{
                    notification.error({
                        message: '警告',
                        description: '课程初始化失败，请刷新重试。',
                    });
                })
            }

        })
    }


    handlePreview = (file) => {
        this.setState({
            previewImage: file.url,
            previewVisible: true
        });
    }



    handleCancel = () => this.setState({previewVisible: false})

    // 点击确认保存按钮
    save = () =>{
        const {edit,desc=''} = this.state
        if(!edit.title){
            message.warning('请填写课程名称')
            return
        }
        this.setState({
            loading:true,
        })
        DB.course.updateCourse({
            ...edit,
            _id:this.props.match.params.courseId,
            // desc:this.myInstance.innerHTML,
            desc:encodeURIComponent(this.myInstance.innerHTML)
        }).then(()=>{
            message.success('操作成功')
            location.hash = 'jiaoxue'
        },({errorMsg})=>{
            message.error(errorMsg)
            this.setState({
                loading:false,
            })
        })
    }

    // 渲染课程内容列表
    renderContentList = () => {
        const {courses} = this.props.vipcourse
        if(!courses || courses.length === 0) {
            return <Alert
                    style={{margin:'20px 60px'}}
                    message="温馨提示"
                    description="您还没有添加内容"
                    type="warning"
                    showIcon
                />
            ;
        }


        return courses.map((item,index)=>{
            return (
                <div style={{position:'relative'}} key={index}>
                    {
                        item.edit ? <EditContent data={{
                            gid:this.props.match.params.courseId,
                            ...item,
                            teacherList:this.state.teacherList
                        }} />:<ShowContent {...this.props} data={{
                            gid:this.props.match.params.courseId,
                            ...item,
                            teacherList:this.state.teacherList,
                        }} update = {()=>this.getInitData(this.props.match.params.courseId)} />
                    }
                </div>
            )
        })
        // return list
    }

    uploadImg = (obj,file,key) =>{
        const t = this;
        const image = prefix+key;
        const img = new Image;
        img.src = image;
        img.onload = ()=>{
          t.props.receiveVipData({
              [obj]:image
            })
        }

        img.onerror = ()=>{
          message.error('上传失败');
        }
    }

    removeImg = (obj,file) =>{
        this.props.receiveVipData({[obj]:''})
    }

    // 富文本编辑器上传图片
    // uploadCallback(e,type){
    //     const t = this;
    //     const {editkc={}} = this.state
    //
    //     const file = e.target.files[0]
    //     const fileName = file.name
    //     let formData = new FormData()
    //     formData.append('files',file)
    //     fetch('/crm/api/uploadfile',{
    //         method: "POST",
    //         body: formData
    //     }).then(data=>data.json()).then(({data})=>{
    //         const link = data.src
    //
    //         let editor = (editkc.show?t.editor:t.editor2).getEditor()
    //         let sel = editor.getSelection()
    //
    //         if(type === 'image'){
    //             editor.clipboard.dangerouslyPasteHTML(sel.index, `<img src="${link}"/>` || '');
    //         }
    //
    //         if(type === 'audio'){
    //              editor.clipboard.dangerouslyPasteHTML(sel.index, `<iframe src=${link}></iframe>` || '');
    //         }
    //     })
    // }

    _editclass(itm){
        DB.course.detail2({
            _id:itm._id,
        }).then(async data=>{
            await this.setState({
                editkc:{
                    ...data,
                    _title:'编辑课次',
                    _id:itm._id,
                    show:true,
                },
            })
            this._modaleditor()
            $('body').removeClass('nicEdit-pane2')
        },({errorMsg})=>message.error(errorMsg))
    }

    _addModal(){
        const {addModal={},addlist=[],editkc={}} = this.state

        const {type} = addModal

        return <Modal
            title='选择插入项'
            visible={addModal.show}
            okText='插入'
            cancelText='取消'
            zIndex={200}
            onCancel={()=>{
                this.setState({
                    addModal:{}
                })
            }}
            onOk={()=>{

                const _edit = editkc.show?'myInstance2':'myInstance'

                const HTML = nicEditors.findEditor(_edit).getContent()

                if(type === 'image'){
                    // console.log(nicEditors.findEditor(_edit).selectedInstance)
                    // nicEditors.findEditor(_edit).nicCommand('insertImage',this.state.addModal.url)
                    document.execCommand('insertImage',false,this.state.addModal.url)
                    // nicEditors.findEditor(_edit).setContent(HTML+`<img src="${this.state.addModal.url}"/>`)
                }else if(type === 'audio'){
                    // nicEditors.findEditor(_edit).nicCommand('Paste',this.state.addModal.url)
                    document.execCommand('insertHTML',false,`<audio class='media-js' controls src="${this.state.addModal.url}"/>`)
                    // nicEditors.findEditor(_edit).setContent(HTML+`<audio class='media-js' controls src="${this.state.addModal.url}"/>`)
                }else if(type === 'video'){
                    document.execCommand('insertHTML',false,`
                        <div><br/></div>
                        <video webkit-playsinline playsinline controls class='js-video media-js' src="${this.state.addModal.url}"></video>
                        <div><br/></div>
                        `)

                    // nicEditors.findEditor(_edit).setContent(HTML+`
                    //     <div><br/></div>
                    //     <video webkit-playsinline playsinline controls class='js-video media-js' src="${this.state.addModal.url}"></video>
                    //     <div><br/></div>
                    //     `)
                }
                this.setState({
                    addModal:{},
                    addlist:[],
                })
                // console.log(nicEditors.findEditor('myInstance').getContent())
            }}
            >
                <div className="add-input-wrap clearfix">
                    <div className="add-input">
                        <Select
                            placeholder='请选择插入项'

                            onSelect={(url)=>{
                                let copy;
                                if(type === 'image'){
                                    copy = <img src="${url}"/>
                                }
                                this.setState({
                                    copy,
                                    addModal:{
                                        ...addModal,
                                        url,
                                    },
                                })
                            }}
                            value={addModal.url}
                            style={{width:'100%'}}>
                            {
                                addlist.map((item,index)=>{
                                    return <Option
                                        key={item.link}
                                        >{item.name}</Option>
                                })
                            }
                        </Select>
                    </div>
                </div>
        </Modal>
    }

    _modaleditor(){
        const {buttonList} = this.state
        this.myNicEditor = new nicEditor({
            buttonList,
        });
        this.myNicEditor.setPanel('myNicPanel2');
        this.myNicEditor.addInstance('myInstance2');
    }

    render() {
    	const { match,receiveVipData,addVipContent,addVipContentObj } = this.props;
        const {
            previewVisible,
            previewImage,
            image,
            edit,
            loading,
            desc = '',
            editkc = {},
            _id,
            desc2,
            teacherList,
            buttonList,
        } = this.state

        const radioStyle = {
            display:'block',
            height:30,
            lineHeight:'30px'
        }

        return (
        <section className='add-course'>
            <p className='course-title'>编辑课程</p>
            {this._addModal()}
            <Spin tip="正在初始化课程信息，请稍候" spinning={loading}>
                <div className="add-course-container">
                    <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>课程名称：</label>
                        <div className="add-input">
                            <Input
                                onChange={({target})=>this.setState({
                                    edit:{
                                        ...edit,
                                        title:target.value,
                                    }
                                })}
                                value={edit.title}
                                placeholder="请输入课程名称" />
                        </div>
                    </div>

                    <div className="add-input-wrap clearfix course-small-pic" style={{display:'flex'}}>
                        <label className='add-input-label'>课程图片：</label>
                        <div className="add-input">
                              <FileUpload
                                  type='image'
                                  url={edit.image}
                                  {...this.props}
                                  get={(image = '') => {
                                      this.setState({
                                          edit:{
                                              ...edit,
                                              image,
                                          }
                                      })
                                  }}/>
                        </div>
                    </div>

                    <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>课程标签：</label>
                        <div className="add-input">
                            <Select
                                placeholder='请选择课程标签'
                                onSelect={(category)=>this.setState({
                                    edit:{
                                        ...edit,
                                        category,
                                    }
                                })}
                                value={edit.category}
                                style={{width:'100%'}}>
                                {
                                    this.state.tags.map((item,index)=>{
                                        return <Option
                                            key={index}
                                             value={item._id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>

                    {/* <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>讲师名称:</label>
                        <div className="add-input">
                                <Select
                                    style={{ width: 150 }}
                                    value={edit.teacherId}
                                    placeholder='请选择讲师名称'
                                    onChange = {teacherId=>{
                                      this.setState({
                                          edit:{
                                              ...edit,
                                              teacherId,
                                          }
                                      })
                                  }
                                }>
                                  {
                                      teacherList.map(itm=><Option key={itm._id}>{itm.weixin}</Option>)
                                  }
                                </Select>
                        </div>
                    </div> */}

                    <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>课程原价：</label>
                        <div className="add-input">
                            <Input
                                addonAfter={'元'}
                                value={edit.origin_bill}
                                onChange={({target})=>{
                                    this.setState({
                                        edit:{
                                            ...edit,
                                            origin_bill:target.value,
                                        }
                                    })
                                }}
                                placeholder="课程原价" />
                        </div>
                    </div>

                    <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>课程现价:</label>
                        <div className="add-input">
                            <Input
                                addonAfter={'元'}
                                value={edit.bill}
                                onChange={({target})=>{
                                    this.setState({
                                        edit:{
                                            ...edit,
                                            bill:target.value,
                                        }
                                    })
                                }}
                                placeholder="活动价格" />
                        </div>
                    </div>

                    <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>截止时间：</label>
                        <div className="add-input">
                            <DatePicker
                                style={{width:'100%'}}
                                // format="YYYY-MM-DD HH:mm:ss"
                                // showTime
                                placeholder="请选择截止时间"
                                value={!edit.cutoff_time? null : moment(edit.cutoff_time)}
                                onChange={(cutoff_time)=>{
                                    cutoff_time = cutoff_time.valueOf()
                                    this.setState({
                                        edit:{
                                            ...edit,
                                            cutoff_time,
                                        }
                                    })
                                }}
                            />
                        </div>
                    </div>


                    <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>课程简介:</label>
                        <div className="add-input">
                            <Input
                                value={edit.jianjie}
                                placeholder='请输入课程简介'
                                onChange={({target})=>{
                                    this.setState({
                                        edit:{
                                            ...edit,
                                            jianjie:target.value,
                                        }
                                    })
                                }} />
                        </div>
                    </div>

                    {/* <textarea name="area1" cols="40"></textarea> */}
                    <div id="myNicPanel"></div>
                    <div ref={myInstance=>this.myInstance=myInstance}
                         id="myInstance"
                         dangerouslySetInnerHTML={{
                             __html:edit.desc,
                         }}>
            		</div>

                    {/* <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>课程描述：</label>
                        <div className='clearfix fuwenben-wrap' style={{float:'left',width:'667px'}}>
                            <ReactQuill
                                ref={editor2=>this.editor2=editor2}
                                modules={this.state.modules}
                                value={desc}
                                onChange={(desc='')=>{
                                    console.log(desc)
                                    this.setState({
                                        desc,
                                    })
                                }}
                            />
                        </div>

                    </div> */}
                </div>

                <p className='course-title'>课程节次</p>
                <div className="course-wrap">
                    <Button
                        onClick={async ()=>{
                            await this.setState({
                                editkc:{
                                    _title:'新建课次',
                                    show:true,
                                },
                            })
                            this._modaleditor()
                            $('body').removeClass('nicEdit-pane2')
                        }}
                        style={{position:'absolute',right:'30px',top:'-70px'}}
                        type="default">
                        新建课次
                    </Button>
                    {
                        this.state.courseList.length?<dl>
            				<dt>
            					<ul>
            						<li>课次名称</li>
            						<li>操作</li>
            					</ul>
            				</dt>
                            {
                                this.state.courseList.map(itm=>(
                                    <dd key={itm._id}>
                                        <ul>
                    						<li>{itm.title}</li>
                    						<li>
                                                <Button
                                                    type='primary'
                                                    onClick={this._editclass.bind(this,itm)}
                                                    >编辑</Button>
                                                    &nbsp;
                                                <Popconfirm title="确认删除?" onConfirm={()=>{
                                                    DB.course.delete({
                                                        _id:itm._id
                                                    }).then(()=>{
                                                        message.success('删除成功')
                                                        this._getCourseList()
                                                    },({errorMsg})=>{
                                                        message.error(errorMsg)
                                                    })
                                                }} okText="删除" cancelText="取消">
                                                       <Button type='danger'>删除</Button>
                                                </Popconfirm>
                                            </li>
                    					</ul>
                                    </dd>
                                ))
                            }
            			</dl>:<Alert
                                style={{margin:'20px 60px'}}
                                message="温馨提示"
                                description="暂无课次"
                                type="warning"
                                showIcon
                            />
                    }

                </div>


                <div style={{
                    padding: '30px 60px 50px',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <Button
                        onClick={this.save}
                        size='large'
                        style={{marginRight:20}}
                        type="primary">
                        确定
                    </Button>
                    <Button size='large' onClick={()=>history.go(-1)}>取消</Button>
                </div>
            </Spin>
            <Modal
              title={editkc._title}
              visible={editkc.show}
              zIndex = {100}
              wrapClassName='kc_moddal'
              okText='保存'
              cancelText='取消'
              confirmLoading={editkc.confirm}
              destroyOnClose={true}
              width={800}
              onOk={()=>{
                  if(!editkc.title){
                      message.error('请输入课次名称')
                      return
                  }
                  this.setState({
                      editkc:{
                          ...editkc,
                          confirm:true,
                      }
                  })
                  DB.course.operate({
                      ...editkc,
                      desc:encodeURIComponent(this.myInstance2.innerHTML),
                      goodsId:_id,
                  }).then(async()=>{
                      await this.setState({
                          editkc:{
                              ...editkc,
                              show:false,
                          }
                      })
                      this._getCourseList()
                  },({errorMsg})=>{
                      message.error(errorMsg)
                      this.setState({
                          editkc:{
                              ...editkc,
                              confirm:false,
                          }
                      })
                  })
              }}
              onCancel={()=>{
                  this.setState({
                      editkc:{
                          ...editkc,
                          show:false,
                      }
                  })
                  $('body').addClass('nicEdit-pane2')
              }}
              afterClose={()=>{
                  this.setState({
                      editkc:{}
                  })
              }}
            >
                <section>
                    <p>
                        课次名称:
                        <Input value={editkc.title} onChange={({target})=>{
                            this.setState({
                                editkc:{
                                    ...editkc,
                                    title:target.value,
                                }
                            })
                        }} placeholder='请输课次名称'/>
                    </p>
                    <div id="myNicPanel2"/>
                    <div ref={myInstance2=>this.myInstance2=myInstance2}
                         id="myInstance2"
                         dangerouslySetInnerHTML={{
                             __html:editkc.desc,
                         }}>
            		</div>
                </section>
            </Modal>
            <input type="hidden" id='addimage' onClick={this.addImage.bind(this)}/>
            <input type="hidden" id='addaudio' onClick={this.addAudio.bind(this)}/>
            <input type="hidden" id='addvideo' onClick={this.addVideo.bind(this)}/>
        </section>)
    }
}


const mapStateToProps = (state) => ({
  	vipcourse: state.vipcourse,
})

const mapDispatchToProps = {
    // 更新课程信息
    receiveVipData,
    // 新增内容信息
    addVipContent,
    // 新增VIP课程附件
    addVipAnnex,
    // 删除VIP课程附件
    removeVipAnnex,
    // 新增一个内容的对象，只是在前台，并未向后台同步新增。
    addVipContentObj,
}



export default withRouter(connect(
  	mapStateToProps,
  	mapDispatchToProps
)(EditVipCourse))
