import DBF from 'dbfac'

export default DBF

DBF.defaultdeal = (resp)=>{
    const {success,data,...err} = resp
    return new Promise((resolve,reject)=>{
        if (success) {
            resolve(data)
        } else {
            if(err.error === "e202"){
                location.reload();
            }
            reject({
              success,
              data,
              ...err,
            })
        }
    })
}

let prefix = ''

DBF.create('ImgTxt', {
    list:{
        url       : prefix+'/api/imgtxt/list',
        method    :'POST',
    },
    operate:{
        url       :prefix+ '/api/imgtxt/operate',
        method    :'POST',
    },
    delete:{
        url       : prefix+'/api/imgtxt/delete',
        method    :'POST',
    },
})

// 模板消息的请求
DBF.create('Message',{
    // 获取消息列表
    getMessageList:{
      url        : prefix+'/api/push/list',
      method     : 'GET',
    },
    // 获取模板列表
    getTemplateList:{
      url        : prefix+'/api/push/tmpl/list',
      method     : 'GET',
    },
    // 获取消息详情
    getDetail:{
      url        : prefix+'/api/push/get',
      method     : 'get',
    },
    // 发送消息
    sendMessage:{
      url        : prefix+'/api/push/set/message',
      method     : 'POST',
    },
    // 更新消息
    updateMessage:{
      url        : prefix+'/api/push/update',
      method     : 'POST',
    },
    // 加入或取消队列
    undo:{
      url        : prefix+'/api/push/undo',
      method     : 'POST',
    },
    // 立即推送
    immediately:{
      url        : prefix+'/api/push/immediately',
      method     : 'POST',
    },
    // 测试推送
    test:{
      url        : prefix+'/api/push/test',
      method     : 'POST',
    },
    // 删除消息
    delete:{
      url        : prefix+'/api/push/delete',
      method     : 'POST',
    },
})

DBF.create('Analyse',{
    getTotal:{
        url         :prefix+'/api/analysis/total',
        method      :'POST',
    },
    getCourseSingle:{
        url         :prefix+'/api/analysis/course_single',
        method      :'POST',
    },
    getCourseTime:{
        url         :prefix+'/api/analysis/course_time',
        method      :'POST',
    },
    getCourseTotal:{
        url         :prefix+'/api/analysis/course',
        method      :'POST',
    },
    getPageTime:{
      url         :prefix+'/api/analysis/page_time',
      method      :'POST',
    },
    getPageSingle:{
      url         :prefix+'/api/analysis/page_single',
      method      :'POST',
    },
    getInvPageTotal:{
      url       : prefix+'/api/analysis/invite_page_leiji',
      method    :'POST',
    },
    getInvTotal:{
      url       : prefix+'/api/analysis/invite_total',
      method     :'POST',
    },
    getIvnCourseSingle:{
     url       : prefix+'/api/analysis/invite_course_single',
     method    :'POST',
   },
   getInvitePageSingle:{
     url         :prefix+'/api/analysis/invite_page_xinzeng',
     method      :'POST',
   }
})


DBF.create('YongHu', {
// ==============================================标签
    getUserList:{
        url       :prefix+'/api/yonghu/chakan/list',
        method    :'POST',
    },
    getUserList2:{
        url       :prefix+'/api/yonghu/chakan/list2',
        method    :'POST',
    },
    userOperate:{
        url       :prefix+'/api/yonghu/chakan/operate',
        method    :'POST',
    },
    userDelete:{
        url       :prefix+'/api/yonghu/chakan/delete',
        method    :'POST',
    },
// ==============================================学习进度
    getProgressList:{
        url       :prefix+'/api/yonghu/progress/list',
        method    :'POST',
    },
    progressupdate:{
        url       :prefix+'/api/yonghu/progress/update',
        method    :'POST',
    },
    progressdelete:{
        url       :prefix+'/api/yonghu/progress/delete',
        method    :'POST',
    },
// ==============================================回访记录
    returnOperate:{
        url       :prefix+'/api/yonghu/return/operate',
        method    :'POST',
    },
    returnMainList:{
        url       :prefix+'/api/yonghu/return/mainlist',
        method    :'POST',
    },
    returnList:{
        url       :prefix+'/api/yonghu/return/list',
        method    :'POST',
    }
});


DBF.create('Order',{
    getCourseList:{
        url         :prefix+'/api/coulson/course/list_of_goods',
        method      :'POST',
    },
    getOrderList:{
        url         :prefix+'/api/order/list',
        method      :'POST',
    },
    getAllOrderList:{
        url         :prefix+'/api/order/alllist',
        method      :'POST',
    },
    import:{
        url         :prefix+'/api/order/add',
        method      :'POST',
    },
    success:{
        url         :prefix+'/api/order/setsuccess',
        method      :'POST',
    },
    update:{
        url         :prefix+'/api/order/update',
        method      :'POST',
    },

    multiadd:{
        url         :prefix+'/api/order/multiadd',
        method      :'POST',
    },
})

DBF.create('Mean', {
    list:{
        url       : prefix+'/api/mean/list',
        method    :'POST',
    },
    operate:{
        url       :prefix+ '/api/mean/operate',
        method    :'POST',
    },
    delete:{
        url       : prefix+'/api/mean/delete',
        method    :'POST',
    },
})

DBF.create('Channel', {
    list:{
        url       :prefix+ '/api/channel/list',
        method    :'POST',
    },
    operate:{
        url       : prefix+'/api/channel/operate',
        method    :'POST',
    },
    delete:{
        url       : prefix+'/api/channel/delete',
        method    :'POST',
    },
    status:{
        url       : prefix+'/api/channel/status',
        method    :'POST',
    }
})

DBF.create('Clue', {
    list:{
        url       : prefix+'/api/clue/list',
        method    :'POST',
    },
    operate:{
        url       :prefix+ '/api/clue/operate',
        method    :'POST',
    },
    delete:{
        url       :prefix+ '/api/clue/delete',
        method    :'POST',
    },
    multiadd:{
        url       :prefix+ '/api/clue/multiadd',
        method    :'POST',
    },
})

DBF.create('About', {
    save:{
        url       : prefix+'/api/about/save',
        method    :'POST',
    },
    get:{
        url       : prefix+'/api/about/get',
    },
})


DBF.create('course', {

    operate:{
        url       : prefix+'/api/course/operate',
        method    :'POST',
    },
    list2:{
        url       :prefix+ '/api/course/list2',
        method    :'POST',
    },
    detail2:{
        url       : prefix+'/api/course/detail2',
        method    :'POST',
    },
    delete:{
        url       :prefix+ '/api/course/delete',
        method    :'POST',
    },

    list:{
        url       : prefix+'/api/coulson/course/list',
        method    :'POST',
    },

    VipCourseDtl : {
        url       : prefix+'/api/coulson/course/tag/list',
        method    :'POST',
    },

    // 课程类目接口
    tagList : {
        url       : prefix+'/api/coulson/course/tag/list',
        method    :'POST',
    },
    addTag : {
        url       : prefix+'/api/coulson/course/tag/add',
        method    :'POST',
    },
    removeTag : {
        url       : prefix+'/api/coulson/course/tag/delete',
        method    :'POST',
    },

    // 课程列表，详情接口
    courseList : {
        url       : prefix+'/api/coulson/goods/list',
        method    :'POST',
    },

    // 新建课程
    addCourse : {
        url       : prefix+'/api/coulson/goods/add',
        method    :'POST',
    },

    createCourse:{
        url       : prefix+'/api/coulson/goods/create',
    },
    // 更新课程信息
    updateCourse : {
        url       : prefix+'/api/coulson/goods/update',
        method    :'POST',
    },
    // 删除课程
    removeCourse : {
        url       : prefix+'/api/coulson/goods/delete',
        method    :'POST',
    },

    // 新增内容信息
    addContent : {
        url       : prefix+'/api/coulson/goods/course/add',
        method    :'POST',
    },

    // 更新内容信息
    updateContent : {
        url       : prefix+'/api/coulson/goods/course/update',
        method    :'POST',
    },
    // 删除内容信息
    removeContent : {
        url       : prefix+'/api/coulson/goods/course/delete',
        method    :'POST',
    },
    // 获取课程详情（goods）
    courseDetail : {
        url       : prefix+'/api/coulson/goods/detail',
        method    :'POST',
    },
    // 上架课程
    puton : {
        url       : prefix+'/api/coulson/goods/puton',
        method    :'POST',
    },
    // 下架课程
    putdown : {
        url       : prefix+'/api/coulson/goods/pulloff',
        method    :'POST',
    },


    // 课程页获取教师列表
    teacherList : {
        url       : prefix+'/api/coulson/teacher/list_short',
        method    :'GET',
    },
    shiting:{
      url       : prefix+'/api/coulson/goods/shiting',
      method    :'post',
    },
    vipList:{
      url       : prefix+'/api/coulson/goods/upVipList',
      method    :'get',
    },
});

// 新建课程相关
DBF.create('CreateCourse',{
    // 新增或修改课次
    editClass:{
        url:prefix+'/pinpai/api/class/operate',
        method:'POST',
    },
    // 获取课次详情
    getClassDetail:{
        url:prefix+'/pinpai/api/class/detail',
        method:'POST',
    },
    // 获取课次列表
    getClassList:{
        url:prefix+'/pinpai/api/class/list',
        method:'POST',
    },
    // 创建或修改课程
    createCourse:{
        url:'/pinpai/api/course/operate',
        method:'POST',
    },
    // 获取课程详情
    getCourseDetail2:{
        url:prefix+'/pinpai/api/course/edit',
        method:'POST',
    },
    // 获取token
    getToken:{
        url:prefix+'/api/aliyun/oss_sts_token',
        method:'GET',
    },
});


DBF.create('JiaoXue', {
// ==============================================标签
    getBiaoqianList:{
        url       :prefix+'/api/jiaoxue/biaoqian/list',
    },
    addBiaoQian:{
        url       :prefix+'/api/jiaoxue/biaoqian/add',
        method    :'POST',
    },
    deleteBiaoQian:{
        url       :prefix+'/api/jiaoxue/biaoqian/delete',
        method    :'POST',
    },

// ==============================================课程
    getKeChengList:{
        url       :prefix+'/api/jiaoxue/kecheng/list',
        method    :'POST',
    },
    getKeChengListTitle:{
        url       :prefix+'/api/jiaoxue/kecheng/listtitle',
        method    :'POST',
    },
    operateKeCheng:{
        url       :prefix+'/api/jiaoxue/kecheng/operate',
        method    :'POST',
    },
    deleteKeCheng:{
        url       :prefix+'/api/jiaoxue/kecheng/delete',
        method    :'POST',
    },

    status:{
        url       :prefix+'/api/jiaoxue/kecheng/status',
        method    :'POST',
    },

});

DBF.create('XiTong', {
// ==============================================faq
    faqOperate:{
        url       :prefix+'/api/xitong/faq/operate',
        method    :'POST',
    },
    faqList:{
        url       :prefix+'/api/xitong/faq/list',
    },
    faqdelete:{
        url       :prefix+'/api/xitong/faq/delete',
        method    :'POST',
    },
// ==============================================账号
    zhanghaoOperate:{
        url       :prefix+'/api/xitong/zhanghao/operate',
        method    :'POST',
    },
    zhanghaoList:{
        url       :prefix+'/api/xitong/zhanghao/list',
    },
    zhanghaodelete:{
        url       :prefix+'/api/xitong/zhanghao/delete',
        method    :'POST',
    },
    zhanghaoresetpsd:{
        url       :prefix+'/api/xitong/zhanghao/resetpsd',
        method    :'POST',
    },
});




DBF.create('ShangCheng', {
// ==============================================轮播图管理
    getLunboList:{
        url       :prefix+'/api/shangcheng/lunbo/list',
        method    :'POST',
    },
    operateLunbo:{
        url       :prefix+'/api/shangcheng/lunbo/operate',
        method    :'POST',
    },
    deleteLunbo:{
        url       :prefix+'/api/shangcheng/lunbo/delete',
        method    :'POST',
    },
    paixuLunbo:{
        url       :prefix+'/api/shangcheng/lunbo/paixu',
        method    :'POST',
    },
// ==============================================菜单管理
    getCaidanList:{
        url       :prefix+'/api/shangcheng/caidan/list',
    },
    operateCaidan:{
        url       :prefix+'/api/shangcheng/caidan/operate',
        method    :'POST',
    },
    deleteCaidan:{
        url       :prefix+'/api/shangcheng/caidan/delete',
        method    :'POST',
    },
    paixuCaidan:{
        url       :prefix+'/api/shangcheng/caidan/paixu',
        method    :'POST',
    },
// ==============================================模块管理
    getMoKuaiList:{
        url       :prefix+'/api/shangcheng/mokuai/list',
    },
    // operateMoKuai:{
    //     url       :'/api/shangcheng/mokuai/operate',
    //     method    :'POST',
    // },
    hideMoKuai:{
        url       :prefix+'/api/shangcheng/mokuai/hide',
        method    :'POST',
    },
    paixuMoKuai:{
        url       :prefix+'/api/shangcheng/mokuai/paixu',
        method    :'POST',
    },

    getModuleName:{
        url       :prefix+'/api/shangcheng/mokuai/name',
        method    :'POST',
    },
    moduleGoods:{
        url       :prefix+'/api/shangcheng/mokuai/goods',
        method    :'POST',
    },
    moduleAddGoodsList:{
        url       :prefix+'/api/shangcheng/mokuai/addgoodslist',
        method    :'POST',
    },
    moduleGoodsOperate:{
        url       :prefix+'/api/shangcheng/mokuai/goodsoperate',
        method    :'POST',
    },
    modulegoodsPX:{
        url       :prefix+'/api/shangcheng/mokuai/goodspaixu',
        method    :'POST',
    }
});



DBF.create('Source', {
    list: {
        url       :prefix+ '/api/source/sourceList',
        method    :'POST',
    },
    add: {
      url       : prefix+'/api/source/add',
      method    : 'POST',
    },
    detail:{
      url       :prefix+ '/api/source/detail',
      method    : 'POST',
    },
    edit:{
      url       :prefix+ '/api/source/edit',
      method    : 'POST',
    },
    delete:{
      url       : prefix+'/api/source/delete',
      method    : 'POST',
    },
    changeStatus:{
      url       : prefix+'/api/source/cstatus',
      method    : 'POST',
    },
    sourceEditGuolvRule:{
      url        :prefix+ '/api/source/sourceEditGuolvRule',
      method     : 'POST',
    },
    allGuolv:{
      url        : prefix+'/api/source/allGuolv',
      method     : 'POST',
    },
});

DBF.create('Category',{
    list:{
      url        : prefix+'/api/category/categoryList',
    },
    getCategoryList:{
      url        : prefix+'/api/category/categoryList',
    },
    create:{
      url        :prefix+ '/api/category/create',
      method     : 'POST',
    },
    delete:{
      url        : prefix+'/api/category/delete',
      method     : 'POST',
    },
    update:{
      url        :prefix+ '/api/category/update',
      method     : 'POST',
    }
})

DBF.create('Material',{
    list:{
      url        : prefix+'/api/material/materialList',
      method     : 'POST',
    },
    count:{
      url        :prefix+ '/api/material/getPageCount',
      method     : 'POST',
    },
    delete:{
      url        :prefix+ '/api/material/delete',
      method     : 'POST',
    },
    addRule:{
      url        : prefix+'/api/material/addRule',
      method     : 'POST',
    },
    addCategory:{
      url        : prefix+'/api/material/addCategory',
      method     : 'POST',
    },
    refresh:{
      url        : prefix+'/api/material/refresh',
      method     : 'POST',
    },
    content:{
      url        : prefix+'/api/material/content',
      method     : 'POST',
    },
    updateContent:{
      url        : prefix+'/api/material/updateContent',
      method     : 'POST',
    },
    sourceAddGuolvRule:{
      url        : prefix+'/api/material/sourceAddGuolvRule',
      method     : 'POST',
    },
    pass:{
      url        : prefix+'/api/material/pass',
      method     : 'POST',
    },
    getNewArticle:{
        url     :prefix+'/api/material/getNewArticle'
    },
    titleImg:{
        url     :prefix+'/api/material/titleImg',
        method     : 'POST',
    },
    title_digest:{
        url     :prefix+'/api/material/title_digest',
        method     : 'POST',
    }
})

DBF.create('Rule',{
    list:{
      url        :prefix+ '/api/rule/ruleList',
    },
    materialList:{
        url        : prefix+'/api/rule/materialList',
        method     : 'POST',
    },
    deleteMaterial:{
      url        : prefix+'/api/rule/deleteMaterial',
      method     : 'POST',
    },
    changeRuleTime:{
      url        :prefix+ '/api/rule/changeRuleTime',
      method     : 'POST',
    }
})

DBF.create('Admin',{
    login:{
      url        :prefix+ '/api/admin/login',
      method     : 'POST',
    },
    checkLogin:{
      url        :prefix+ '/api/admin/checkLogin',
    },
    logout:{
      url        :prefix+'/api/admin/logout',
      method     : 'POST',
    }
})
// 模板消息的请求
DBF.create('Message',{
    // 获取消息列表
    getMessageList:{
      url        : prefix+'/api/push/list',
      method     : 'GET',
    },
    // 获取模板列表
    getTemplateList:{
      url        : prefix+'/api/push/tmpl/list',
      method     : 'GET',
    },
    // 获取消息详情
    getDetail:{
      url        :prefix+ '/api/push/get',
      method     : 'get',
    },
    // 发送消息
    sendMessage:{
      url        :prefix+ '/api/push/set/message',
      method     : 'POST',
    },
    // 更新消息
    updateMessage:{
      url        :prefix+ '/api/push/update',
      method     : 'POST',
    },
    // 加入或取消队列
    undo:{
      url        : prefix+'/api/push/undo',
      method     : 'POST',
    },
    // 立即推送
    immediately:{
      url        :prefix+ '/api/push/immediately',
      method     : 'POST',
    },
    // 测试推送
    test:{
      url        : prefix+'/api/push/test',
      method     : 'POST',
    },
    // 删除消息
    delete:{
      url        :prefix+ '/api/push/delete',
      method     : 'POST',
    },
})

DBF.create('Analyse',{
    // 获取用户分析表-日期的数据
    getUserDate:{
      url        : prefix+'/api/analysis/user_date',
      method     : 'GET',
    },
    // 获取用户分析表-日期的数据
    downloadUserDate:{
      url        : prefix+'/api/analysis/download_user_date',
      method     : 'GET',
    },




    // 获取用户分析表-小时的数据
    getUserHour:{
      url        : prefix+'/api/analysis/user_hour',
      method     : 'GET',
    },



    // 获取用户分析表-活跃的数据
    getContentPop:{
      url        : prefix+'/api/analysis/user_active',
      method     : 'GET',
    },
    // 获取用户分析表-单篇的数据
    downloadUserPop:{
      url        : prefix+'/api/analysis/download_user_active',
      method     : 'GET',
    },




    // 获取内容分析表-总体的数据
    getContentTotal:{
      url        : prefix+'/api/analysis/content_total',
      method     : 'GET',
    },
    // 获取内容分析表-总体的数据
    downloadContentTotal:{
      url        : prefix+'/api/analysis/download_content_total',
      method     : 'GET',
    },




    // 获取内容分析表-单篇的数据
    getContentSingle:{
      url        : prefix+'/api/analysis/content_single',
      method     : 'GET',
    },
    // 下载内容分析表-单篇的数据
    downloadContentSingle:{
      url        : prefix+'/api/analysis/download_content_single',
      method     : 'GET',
    },





    // 获取首页推荐分析-总体的数据
    getHomeTotal:{
      url        : prefix+'/api/analysis/home_total',
      method     : 'GET',
    },
    // 下载首页推荐分析-总体的数据
    downloadHomeTotal:{
      url        : prefix+'/api/analysis/download_home_total',
      method     : 'GET',
    },





    // 获取首页推荐分析-分类的数据
    getHomeCategory:{
      url        : prefix+'/api/analysis/home_category',
      method     : 'GET',
    },
    // 下载首页推荐分析-分类的数据
    downloadHomeCategory:{
      url        :prefix+ '/api/analysis/download_home_category',
      method     : 'GET',
    },





    // 获取首页推荐分析-频道的数据
    getHomeChannel:{
      url        : prefix+'/api/analysis/home_channel',
      method     : 'GET',
    },
    // 下载首页推荐分析-频道的数据
    downloadHomeChannel:{
      url        : prefix+'/api/analysis/download_home_channel',
      method     : 'GET',
    },





    // 获取相关推荐分析的数据
    getRelative:{
      url        :prefix+ '/api/analysis/relative',
      method     : 'GET',
    },
    // 下载相关推荐分析的数据
    downloadRelative:{
      url        : prefix+'/api/analysis/download_relative',
      method     : 'GET',
    },






    // 模板消息的数据
    getTemplate:{
      url        : prefix+'/api/analysis/template',
      method     : 'GET',
    },
    // 下载模板消息的数据
    downloadTemplate:{
      url        :prefix+ '/api/analysis/download_template',
      method     : 'GET',
    },






    // 日签分析的数据
    getDaySign:{
      url        :prefix+ '/api/analysis/day_sign',
      method     : 'GET',
    },
    // 下载日签分析的数据
    downloadDaySign:{
      url        : prefix+'/api/analysis/download_day_sign',
      method     : 'GET',
    },








    // 文章审核分析的数据
    getArticleVerify:{
      url        :prefix+ '/api/analysis/material_verify',
      method     : 'GET',
    },
    // 下载日签分析的数据
    downloadArticleVerify:{
      url        : prefix+'/api/analysis/download_material_verify',
      method     : 'GET',
    },

})

// DBF.create('Channel',{
//     operate:{//新增分类/update
//       url        : '/api/channel/operate',
//       method     : 'POST',
//     },
//     list:{
//         url      : '/api/channel/list',
//     },
//     delete:{
//         url        : '/api/channel/delete',
//         method     : 'POST',
//     },
//     sort:{
//         url        : '/api/channel/sort',
//         method     : 'POST',
//     }
// })

DBF.create('DateIn',{
    operate:{//新增/update
      url        : prefix+'/api/datein/operate',
      method     : 'POST',
    },
    list:{
      url        :prefix+ '/api/datein/list',
      method     : 'POST',
    },
    delete:{
      url        : prefix+'/api/datein/delete',
      method     : 'POST',
    },
    create:{
        url        : prefix+'/api/datein/create',
        method     : 'POST',
    }
})

DBF.create('Poster',{
    save:{//新增/update
      url        : prefix+'/api/haibao/tmpl/create_or_update',
      method     : 'POST',
    },
    list:{
        url      :prefix+ '/api/haibao/tmpl/list',
        method   : 'POST',
    },
    detail:{
        url      : prefix+'/api/haibao/tmpl/one',
        method   : 'POST',
    },
    change_up:{
        url      : prefix+'/api/haibao/tmpl/change_up',
        method   : 'POST',
    },
    delete:{
        url      : prefix+'/api/haibao/tmpl/delete',
        method   : 'POST',
    }
})
