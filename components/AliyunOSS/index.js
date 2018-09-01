import AliyunOssUpload from './aliyun-oss-upload'

const OssUpload = async  () => {
    let stsToken = await fetch('/crm/api/aliyun/oss_sts_token').then(data => data.json());
    // const bucket = process.env.NODE_ENV === 'development'?'xbinstitute-test':'xbinstitute';
    const bucket = __PRO__?'jiaopeitoutiao':'jiaopeitoutiao-test';

    return new Promise(resolve=>{
        resolve(new AliyunOssUpload({
           bucket,
           // 根据你的 oss 实例所在地区选择填入
           // 杭州：http://oss-cn-hangzhou.aliyuncs.com
           // 北京：http://oss-cn-beijing.aliyuncs.com
           // 青岛：http://oss-cn-qingdao.aliyuncs.com
           // 深圳：http://oss-cn-shenzhen.aliyuncs.com
           // 香港：http://oss-cn-hongkong.aliyuncs.com
           endpoint: 'https://oss-cn-hangzhou.aliyuncs.com',
           // 如果文件大于 chunkSize 则分块上传, chunkSize 不能小于 100KB 即 102400
           chunkSize: 5000048576,
        //    chunkSize: 5048576,
           // 分块上传的并发数
           concurrency: 2,
           // 注意: 虽然使用 accessKeyId 和 secretAccessKey 可以进行上传, 但是存在泄露风险, 因此强烈建议使用下面的 STS token
           // 只有在确认不会出现泄露风险的情况下, 才使用 aliyunCredential
           // aliyunCredential: {
           //     "accessKeyId": "在阿里云OSS申请的 accessKeyId",
           //     "secretAccessKey": "在阿里云OSS申请的 secretAccessKey"
           // },
           stsToken,
       }))
    })
}

export default OssUpload
