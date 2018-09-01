import React, {Component} from 'react'
import {Icon,Button,notification,Popconfirm} from 'antd'
import moment from 'moment'
import { connect } from 'react-redux'
import { addVipContent,removeVipContent } from '../../actions/vipcourse'
import UploadModule from '@modules/UploadModule'
import DB from '@DB'

class ShowContent extends Component {
    constructor(props){
        super(props)
        const {courseId} = props.match.params;
        this.state={
            courseId:courseId === 'vip'?'':courseId
        }
    }

    // 删除内容，如果有_id，那么发请求删除，如果没有，直接本地删除
    removeContent = (_id,uuid) => {
        if(!_id) {
            this.props.removeVipContent(uuid)
        }else{
            DB.course.removeContent({
                gid:this.props.data.gid,
                cid:_id,
            }).then(data=>{
                // DB.course.removeContent({
                //     gid:this.props.data.gid,
                //     cid:_id,
                // }).then(data=>{
                    notification.success({
                        message: '温馨提示',
                        description: data,
                    });
                    this.props.removeVipContent(uuid)
                // })
            })
        }
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

    _shiting(_id,free){
        DB.course.shiting({
            _id,free
        }).then(data=>{
            this.props.update();
        })
    }

    render() {
        const {
            title,
            // start_time,
            // end_time,
            desc,
            teacher_id,
            uuid,
            _id,
            annex = [],
            free
        } = this.props.data;

        let teacherName = '';
        this.props.data.teacherList.map((item)=>{
            if(item._id === teacher_id) {
                teacherName = item.name;
                return;
            }
        })

        const { addVipContent } = this.props;
        return (
            // <div className="add-course-container" style={{borderBottom:'1px solid #ddd'}}>
            //     <div className="add-input-wrap clearfix">
            //         <label className='add-input-label'>主题：</label>
            //         <div className="show-input">
            //             {title}
            //         </div>
            //     </div>
            //     <div className="add-input-wrap clearfix">
            //         <label className='add-input-label'>开课时间：</label>
            //         <div className="show-input">
            //             {!start_time?'--':moment(start_time).format('YYYY-MM-DD HH:MM:SS')}
            //         </div>
            //     </div>
            //
            //     <div className="add-input-wrap clearfix">
            //         <label className='add-input-label'>结束时间：</label>
            //         <div className="show-input">
            //             {!end_time?'--':moment(end_time).format('YYYY-MM-DD HH:MM:SS')}
            //         </div>
            //     </div>
            //
            //     <div className="add-input-wrap clearfix">
            //         <label className='add-input-label'>描述：</label>
            //         <div className="show-input">
            //             {desc}
            //         </div>
            //     </div>
            //
            //     <div className="add-input-wrap clearfix">
            //         <label className='add-input-label'>讲师：</label>
            //         <div className="show-input">
            //             {teacherName}
            //         </div>
            //     </div>
            //
            //     <div className="add-input-wrap clearfix" >
            //         <label className='add-input-label'>附件：</label>
            //         <div className="show-input">
            //             <UploadModule
            //                 limit={0}
            //                 // success={this.uploadSuccess}
            //                 remove={()=>{}}
            //                 fileList={this.handleAnnex(annex)} />
            //         </div>
            //     </div>
            //
            //     <Button
            //         onClick={()=>{addVipContent({
            //             uuid,
            //             edit:true,
            //         })}}
            //         className='course-edit-btn'
            //         type="primary">
            //         编辑
            //     </Button>
            //     <Button
            //         onClick={this.removeContent.bind(this,_id,uuid)}
            //         className='course-delete-btn'
            //         type="danger">
            //         删除
            //     </Button>
            // </div>
            <dd className='show-content-wrap'>
                <ul>
                    <li>{title}</li>
                    <li>
                        {/* {title} */}
                    </li>
                    <li>
                        <div className="show-input">
                             <UploadModule
                                 limit={0}
                                  success={this.uploadSuccess}
                                 remove={()=>{}}
                                 fileList={this.handleAnnex(annex)} />
                         </div>
                    </li>
                    <li>{free?'可试听':'不可试听'}</li>
                    <li className='operate'>
                        <Button
                            onClick={()=>{addVipContent({
                                uuid,
                                edit:true,
                            })}}
                            type="primary">
                            编辑
                        </Button>
                        <div/>
                      <object style={{display:this.state.courseId?'':'none'}}>
                          <Popconfirm title="确认开启试听?" okText="确认" cancelText="取消" onConfirm={this._shiting.bind(this,_id,true)}>
                              <Button style={{display:(free?'none':'')}}>选择试听</Button>
                          </Popconfirm>
                          <Popconfirm title="确认关闭试听?" okText="确认" cancelText="取消" onConfirm={this._shiting.bind(this,_id,false)}>
                              <Button  type="danger" style={{display:(free?'':'none')}}>取消试听</Button>
                          </Popconfirm>
                        </object>
                        <div/>
                        <Button
                            onClick={this.removeContent.bind(this,_id,uuid)}
                            type="danger">
                            删除
                        </Button>
                    </li>
                </ul>
            </dd>
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
}



export default connect(
  	mapStateToProps,
  	mapDispatchToProps
)(ShowContent)
