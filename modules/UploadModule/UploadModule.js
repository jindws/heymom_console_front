import React, {Component} from 'react'
import UUID from 'uuid/v1'
import {
    Icon,
    Button,
    Upload,
    notification,
} from 'antd'

export default class UploadModule extends Component {
    constructor(props){
        super(props)
    }

    // 上传附件
    uploadAnnex = ({file,fileList}) =>{
        const fileName = file.name
        const key = `course/${UUID()}_${fileName}`;

        // 上传文件
        if(file && file.status === 'uploading') {
            this.ossAnnex(file.originFileObj,key);
        }

        // 删除文件
        if(file && file.status === 'removed') {
            this.props.remove(file)
            // this.props.removeVipAnnex(this.props.data.uuid,file.url)
        }
    }

    ossAnnex(file, key) {
        const t = this;

        fetch('/api/aliyun/oss_sts_token')
        .then(data => data.json())
        .then(async (result)=>{
            var client = new OSS.Wrapper({
                accessKeyId: result.Credentials.AccessKeyId,
                accessKeySecret: result.Credentials.AccessKeySecret,
                stsToken: result.Credentials.SecurityToken,
                endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
                // bucket: __PRO__?'xbinstitute':'xbinstitute-test'
                bucket: 'jiaopeitoutiao-test',
            });
            client.multipartUpload(key, file,{
                progress:function*(p){
                    if(t.props.process) {
                        t.props.process(p);
                    }
                }
            }).then(res=>{
                // 上传成功
                if(res.res.status === 200) {
                    t.props.success(file,key)
                }else{
                    notification.error({
                        message: '警告',
                        description: '上传失败，请重试',
                    });
                    // 上传失败
                }
            })
            .catch(function (err) {
                notification.error({
                    message: '警告',
                    description: '上传失败，请重试',
                });
                console.log('onerror',err);
            });
        })
        return;
        ossUpload.upload({
              // 必传参数, 需要上传的文件对象
              file,
              // 必传参数, 文件上传到 oss 后的名称, 包含路径
              key,
              // 上传失败后重试次数
              maxRetry: 3,
              // OSS支持4个 HTTP RFC2616(https://www.ietf.org/rfc/rfc2616.txt)协议规定的Header 字段：
              // Cache-Control、Expires、Content-Encoding、Content-Disposition。
              // 如果上传Object时设置了这些Header，则这个Object被下载时，相应的Header值会被自动设置成上传时的值
              // 可选参数
              headers: {
                'CacheControl': 'public',
                'Expires': '',
                'ContentEncoding': '',
                'ContentDisposition': '',
                // oss 支持的 header, 目前仅支持 x-oss-server-side-encryption
                'ServerSideEncryption': ''
              },
              // 文件上传中调用, 可选参数
              onprogress: function (evt) {
                  if(t.props.process) {
                      t.props.process(evt);
                  }
                // console.log('onprogress',evt);
              },
              // 文件上传失败后调用, 可选参数
              onerror: function (evt) {
                  notification.error({
                      message: '警告',
                      description: '上传失败，请重试',
                  });
                console.log('onerror',evt);
              },
              // 文件上传成功调用, 可选参数
              oncomplete(res) {
                t.props.success(file,key)

                // const annexUrl = 'https://cdn.xueyuan.xiaobao100.com/'+key;
                //
                // let annexObj = {
                //     uid: annexUrl,
                //     name:file.name,
                //     url:annexUrl,
                //     status: 'done'
                // }
                //
                // t.props.addVipAnnex({
                //     ...annexObj,
                //     uuid:t.props.data.uuid,
                // })

              }
        });
    }

    handlePreview = (file) =>{
        if(this.props.onPreview) this.props.onPreview(file)
    }

    render() {
        const fileList = this.props.fileList || [];
        return (
            <Upload
                // 这个设置了才会不走默认的发送
                customRequest={data =>{
                    notification.success({
                        message: '提示',
                        description: '开始上传，请耐心等待'
                    });
                //   this.setState({ossFile:data.file})
                }}
                onPreview={this.props.onPreview?this.handlePreview:''}
                fileList={fileList}
                listType = {this.props.listType || null}
                onChange={this.uploadAnnex}>
                {
                    fileList.length < (this.props.limit || -1) ? <Button>
                    <Icon type="upload" /> 点击上传
                </Button> : null}

            </Upload>
        )
    }
}
