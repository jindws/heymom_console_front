import React, {Component} from 'react'
import {Input,Upload,Icon,DatePicker,Select,Button,Spin,notification} from 'antd'
import moment from 'moment'
import DB from '@DB'
import UUID from 'uuid/v1'

import { connect } from 'react-redux'
import { addVipContent,removeVipContent,addVipAnnex,removeVipAnnex } from '../../actions/vipcourse'
import UploadModule from '@modules/UploadModule'
// import OssUpload from '@AliyunOSS'
// let ossUpload;
// OssUpload().then(data=>{
//     ossUpload = data
// })

const Option = Select.Option;

class EditContent extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading:false,
        }
    }

    // 删除内容，如果有_id，那么发请求删除，如果没有，直接本地删除
    removeContent = (_id,uuid) => {
        if(!_id) {
            this.props.removeVipContent(uuid)
        }else{
            // this.props.removeVipContent(uuid)
            DB.course.removeContent({
                gid:this.props.data.gid,
                cid:_id,
            }).then(data=>{
                notification.success({
                    message: '温馨提示',
                    description: data,
                });
                this.props.removeVipContent(uuid)
            })
        }
    }

    // ossAnnex(file, key) {
    //     const t = this;
    //     ossUpload.upload({
    //           // 必传参数, 需要上传的文件对象
    //           file,
    //           // 必传参数, 文件上传到 oss 后的名称, 包含路径
    //           key,
    //           // 上传失败后重试次数
    //           maxRetry: 3,
    //           // OSS支持4个 HTTP RFC2616(https://www.ietf.org/rfc/rfc2616.txt)协议规定的Header 字段：
    //           // Cache-Control、Expires、Content-Encoding、Content-Disposition。
    //           // 如果上传Object时设置了这些Header，则这个Object被下载时，相应的Header值会被自动设置成上传时的值
    //           // 可选参数
    //           headers: {
    //             'CacheControl': 'public',
    //             'Expires': '',
    //             'ContentEncoding': '',
    //             'ContentDisposition': '',
    //             // oss 支持的 header, 目前仅支持 x-oss-server-side-encryption
    //             'ServerSideEncryption': ''
    //           },
    //           // 文件上传中调用, 可选参数
    //           onprogress: function (evt) {
    //             console.log('onprogress',evt);
    //           },
    //           // 文件上传失败后调用, 可选参数
    //           onerror: function (evt) {
    //             console.log('onerror',evt);
    //           },
    //           // 文件上传成功调用, 可选参数
    //           oncomplete(res) {
    //             const annexUrl = 'https://cdn.xueyuan.xiaobao100.com/'+key;
    //
    //             let annexObj = {
    //                 uid: annexUrl,
    //                 name:file.name,
    //                 url:annexUrl,
    //                 status: 'done'
    //             }
    //
    //             t.props.addVipAnnex({
    //                 ...annexObj,
    //                 uuid:t.props.data.uuid,
    //             })
    //
    //           }
    //     });
    // }

    // // 上传附件
    // uploadAnnex = ({file,fileList}) =>{
    //     const fileName = file.name
    //     const key = `course/${UUID()}_${fileName}`;
    //
    //     // 上传文件
    //     if(file && file.status === 'uploading') {
    //         this.ossAnnex(file.originFileObj,key);
    //     }
    //
    //     // 删除文件
    //     if(file && file.status === 'removed') {
    //         this.props.removeVipAnnex(this.props.data.uuid,file.url)
    //     }
    // }

    save = () =>{
        this.setState({loading:true})
        const data = this.props.data;
        const {
            desc,
            // end_time,
            // start_time,
            teacher_id,
            title,
            annex,
            _id,
            zhibo_video = '',
            kejian_video = '',
        } = data

        if(data._id) {
            console.log(annex,1111)
            DB.course.updateContent({
                desc,
                // end_time,
                // start_time,
                zhibo_video,
                kejian_video,
                teacher_id,
                title,
                annex,
                _id,
            }).then((data)=>{
                console.log(data)
                notification.success({
                    message: '温馨提示',
                    description: '内容添加成功',
                });
                this.props.addVipContent({
                    uuid:this.props.data.uuid,
                    edit:false,
                })
                // this.setState({
                //     loading:false
                // })
            },(res)=>{
                this.setState({loading:false})
                notification.error({
                    message: '警告',
                    description: res.errorMsg,
                });
            })
        }else{

            let gid = this.props.data.gid;
            if(gid === 'vip') {
                gid = ''
            }
            console.log(annex,2222)
            DB.course.addContent({
                gid:gid,
                course:{
                    desc,
                    // end_time,
                    // start_time,
                    teacher_id,
                    title,
                    annex,
                    zhibo_video,
                    kejian_video,
                }
            }).then((data)=>{
                console.log(data)
                this.props.addVipContent({
                    uuid:this.props.data.uuid,
                    _id:data._id,
                    edit:false,
                })
                // this.setState({
                //     loading:false
                // })
            },(res)=>{
                this.setState({loading:false})
                notification.error({
                    message: '警告',
                    description: res.errorMsg,
                });
            })
        }
        // DB.course.saveContent({
        //     ...data
        // }).then((res) => {
        //     console.log(res)
        //     this.props.receiveVipData({loading:false})
        // },(res)=>{
        //     this.props.receiveVipData({loading:false})
        //     notification.error({
        //         message: '警告',
        //         description: res.errorMsg,
        //     });
        // })
    }

    uploadSuccess = (file,key) =>{

        // const head = __PRO__?'https://cdn.xueyuan.xiaobao100.com/':'https://cdn.shield.xiaobao100.com/';
        const prefix = 'http://jiaopeitoutiao-test.oss-cn-hangzhou.aliyuncs.com/'
        const annexUrl = prefix+key;

        // let annexObj = {
        //     uid: annexUrl,
        //     name:file.name,
        //     url:annexUrl,
        //     status: 'done'
        // }

        this.props.addVipAnnex({
            annexUrl,
            uuid:this.props.data.uuid,
        })
    }

    uploadRemove = (file) =>{
        this.props.removeVipAnnex(this.props.data.uuid,file.url)
    }

    handleAnnex = (annex) =>{
        let tem;
        if(!annex) {
            return [];
        }else{
            tem = annex.map(item=>{
                return {
                    uid: item,
                    name:__PRO__?item.substr(79):item.substr(78),
                    url:item,
                    status: 'done'
                }
            })
            return tem
        }
    }

    // 将直播视频处理成数组
    handleVideo = (video) =>{
        if(!video) {
            return [];
        }else{
            return [{
                uid: video,
                name:__PRO__?video.substr(79):video.substr(78),
                url:video,
                status: 'done'
            }]
        }
    }

    // 上传视频中
    uploadingVideo = (type,process) =>{

        console.log(type,process,222)

        let prodom = this.refs[this.props.data.uuid+type]

        if(process === 1) {
            prodom.style.display = 'none';
        }else{
            prodom.style.display = 'block';
            prodom.style.borderLeftWidth=(process)*500+'px'
            prodom.innerHTML = Math.floor((process)*100)+'%'
        }
    }

    // 上传视频成功
    uploadVideoSuccess = (type,file,key) =>{
        console.log(type,file,key)

        // const head = __PRO__?'https://cdn.xueyuan.xiaobao100.com/':'https://cdn.shield.xiaobao100.com/';

        const video = prefix+key;

        this.props.addVipContent({
            uuid:this.props.data.uuid,
            [type]:video
        })
    }

    render() {
        const {
            title,
            // start_time,
            // end_time,
            desc,
            teacherList,
            teacher_id,
            uuid,
            _id,
            gid,
            annex = [],
            zhibo_video,
            kejian_video,
        } = this.props.data;
        const { addVipContent } = this.props;
        return (
            <div className="add-course-container" style={{borderBottom:'1px solid #ddd'}}>

                <Spin tip="正在保存内容，请稍候" spinning={this.state.loading}>
                    <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>课次名称：</label>
                        <div className="add-input">
                            <Input
                                onChange={(e)=>addVipContent({
                                    uuid,
                                    title:e.target.value
                                })}
                                value={title}
                                placeholder="请输入主题" />
                        </div>
                    </div>

                    <div className="add-input-wrap clearfix" >
                        <label className='add-input-label'>音频</label>
                        <div className="add-input">
                            <UploadModule
                                limit={2}
                                success={this.uploadSuccess}
                                remove={this.uploadRemove}
                                fileList={this.handleAnnex(annex)} />
                        </div>
                    </div>

                    <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>视频：</label>
                        <div className="add-input">
                            <UploadModule
                                limit={1}
                                fileList = {this.handleVideo(zhibo_video)}
                                success={this.uploadVideoSuccess.bind(this,'zhibo_video')}
                                process={this.uploadingVideo.bind(this,'zhibo')}
                                remove={()=>{
                                    addVipContent({
                                        uuid,
                                        zhibo_video:''
                                    })
                                }}
                                />
                        </div>
                        <div ref={uuid+'zhibo'} className="big-video-process">
                            0
                        </div>
                    </div>

                    <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>图文：</label>
                        <div className="add-input">
                            <UploadModule
                                limit={1}
                                fileList = {this.handleVideo(kejian_video)}
                                success={this.uploadVideoSuccess.bind(this,'kejian_video')}
                                process={this.uploadingVideo.bind(this,'kejian')}
                                remove={()=>{
                                    addVipContent({
                                        uuid,
                                        kejian_video:''
                                    })
                                }}
                                />
                        </div>
                        <div ref={uuid+'kejian'} className="big-video-process">
                            0
                        </div>
                    </div>

                    {/* <div className="add-input-wrap clearfix">
                        <label className='add-input-label'>课件视频：</label>
                        <div className="add-input">
                            <UploadModule
                                limit={1}
                                fileList = {this.handleVideo(kejian_video)}
                                success={this.uploadVideoSuccess.bind(this,'kejian_video')}
                                process={this.uploadingVideo.bind(this,'kejian')}
                                remove={()=>{
                                    this.props.addBigContent({kejian_video:''})
                                }}
                                />
                        </div>
                    </div> */}


                    <Button
                        onClick={this.save}
                        className='course-edit-btn'
                        type="primary">
                        保存
                    </Button>
                    <Button
                        onClick={this.removeContent.bind(this,_id,uuid)}
                        className='course-delete-btn'
                        type="danger">
                        删除
                    </Button>
                </Spin>
                {/* <Button
                    className='course-default-btn'
                    type="default">
                    取消
                </Button> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
  	vipcourse: state.vipcourse,
})

const mapDispatchToProps = {
    // 新增内容信息
    addVipContent,
    // 本地删除内容信息
    removeVipContent,
    // 新增附件
    addVipAnnex,
    // 删除附件
    removeVipAnnex,
}



export default connect(
  	mapStateToProps,
  	mapDispatchToProps
)(EditContent)
