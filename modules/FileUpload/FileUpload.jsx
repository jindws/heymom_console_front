import React,{Component} from 'react'
import {
    Upload,
    Icon,
    Modal,
    message,
    Button,
} from 'antd'

import UUID from 'uuid/v1'
import {hot} from 'react-hot-loader'

class FileUpload extends Component {
    constructor(props) {
        super(props)

        let accept='*'

        switch (props.type) {
            case 'image':
                accept = 'image/*'
                break;
            case 'audio':
                accept = 'audio/*'
                break;
            case 'video':
                accept = 'video/*'
                break;
            case 'file':
                accept = props.accept
                break;
        }

        this.state = {
            previewVisible: false,
            preview: '',
            ossFile: null,
            fileList:[],
            accept,
        }
    }

    componentDidMount(){
        this._set_FileList(this.props);
    }

    componentWillReceiveProps(props){
        let accept='*'

        switch (props.type) {
            case 'image':
                accept = 'image/*'
                break;
            case 'audio':
                accept = 'audio/*'
                break;
            case 'video':
                accept = 'video/*'
                break;
            case 'file':
                accept = props.accept
                break;
        }
        this.setState({
            accept,
        })
        this._set_FileList(props);
    }

    _set_FileList(props){
      const {url} = props;
      const fileList = [];
      if (url) {
          fileList.push({
              uid: -1,
              status: 'done',
              url,
              name:url.substring(47)
          })
      }
      this.setState({
          fileList
      })
    }

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            preview: file.url || file.thumbUrl,
            previewVisible: true
        });
    }

    // oss() {
    //     const {ossFile} = this.state;
    //     const fileName = ossFile.name;
    //     const suffix = fileName.substring(fileName.lastIndexOf('.'))
    //     const path = this.props.path//||'js/console/image';
    //     // const key = `${path}/${UUID()}${suffix}`;
    //
    //     const key = `${path}/${UUID()}${fileName}`;
    //
    //     const t = this;
    //
    //     ossUpload.upload({
    //         // 必传参数, 需要上传的文件对象
    //         file: ossFile,
    //         // 必传参数, 文件上传到 oss 后的名称, 包含路径
    //         key,
    //         // 上传失败后重试次数
    //         maxRetry: 3,
    //         // OSS支持4个 HTTP RFC2616(https://www.ietf.org/rfc/rfc2616.txt)协议规定的Header 字段：
    //         // Cache-Control、Expires、Content-Encoding、Content-Disposition。
    //         // 如果上传Object时设置了这些Header，则这个Object被下载时，相应的Header值会被自动设置成上传时的值
    //         // 可选参数
    //         headers: {
    //             'CacheControl': 'public',
    //             'Expires': '',
    //             'ContentEncoding': '',
    //             'ContentDisposition': '',
    //             // oss 支持的 header, 目前仅支持 x-oss-server-side-encryption
    //             'ServerSideEncryption': ''
    //         },
    //         // 文件上传中调用, 可选参数
    //         onprogress: function(evt) {
    //             console.log('onprogress', evt);
    //         },
    //         // 文件上传失败后调用, 可选参数
    //         onerror: function(evt) {
    //             console.log('onerror', evt);
    //             this.error()
    //         },
    //         error() {
    //             t.setState({fileList: []})
    //             t.props.get();
    //             message.error('上传失败,请重新上传!');
    //             OssUpload().then(data => ossUpload = data)
    //         },
    //         // 文件上传成功调用, 可选参数
    //         oncomplete(res) {
    //             if(!t.state.ossFile){
    //                 return;
    //             }
    //             const head = __PRO__?'https://jiaopeitoutiao.oss-cn-hangzhou.aliyuncs.com/':'https://jiaopeitoutiao-test.oss-cn-hangzhou.aliyuncs.com/';
    //             const url = head + key;
    //             t.props.get(url);
    //             // const img = new Image;
    //             // img.src = url;
    //             // img.onload = () => {
    //             //     t.setState({
    //             //         fileList: [
    //             //             {
    //             //                 uid: -1,
    //             //                 url,
    //             //                 status: 'done'
    //             //             }
    //             //         ]
    //             //     })
    //             //     t.props.get(url);
    //             // }
    //             // img.onerror = () => this.error()
    //         }
    //     });
    // }

    async handleChange({fileList}) {
        await this.setState({fileList})
        if (this.state.ossFile) {
            let formData = new FormData()
            formData.append('files',this.state.ossFile)
            fetch('/crm/api/uploadfile',{
                method: "POST",
                body: formData
            }).then(data=>data.json()).then(({data})=>{
                this.setState({
                    preview:data.src
                })
                this.props.get(data.src);
            })
        }
    }

    _previewModal(){
        const {type} = this.props
        const {preview} = this.state

        if(type === 'image'){
            return <img style={{
                width: '100%'
                }} src={preview}/>
        }

        if(type === 'audio'){
            return <audio controls="controls" src={preview}/>
        }

        if(type === 'video'){
            return <video controls="controls" src={preview}/>
        }
    }

    render() {
        const {
            previewVisible,
            preview,
            fileList,
            accept,
        } = this.state

        const {type,hide=false} = this.props

        let uploadButton,listType;

        if(type !== 'image'){
            uploadButton = <Button shape="circle" icon="plus" />
            listType = 'text'
        }else{
            uploadButton = <div>
                    <Icon type="plus"/>
                    <div className="ant-upload-text">点击上传</div>
                </div>
            listType = 'picture-card'
        }

        return (
            <div className="clearfix" style={{
                display:(hide?'none':'')
            }}>
                <Upload customRequest={
                    data => {
                      this.setState({ossFile: data.file})
                    }}
                    listType={listType}
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange.bind(this)}
                    onRemove={() => {
                      this.props.get('');
                      this.setState({fileList: [], ossFile: null});
                    }}
                    accept={accept}>
                    {fileList.length
                        ? null
                        : uploadButton}
                </Upload>
                <Modal width={1000}
                    visible={previewVisible}
                    footer={null}
                    style={{textAlign:'center'}}
                    destroyOnClose={true}
                    keyboard = {true}
                    onCancel={this.handleCancel}>
                    {this._previewModal()}
                </Modal>
            </div>
        );
    }
}


export default hot(module)(FileUpload)
