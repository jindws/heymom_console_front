/*
Author:lvzu
Date:2017/8/10

在模糊匹配框输入后会重新请求数据，
并且从所有课程中获取匹配的课程，与时间选择器无关
在模糊匹配框中有数据的情况下，选择日期会清空模糊匹配框
*/

import React, {Component} from 'react'
import moment from 'moment'
import './CourseSingle.css';
import DB from '@DB'
import JSON2EXCEL from '@modules/Export'
import { Pagination, DatePicker, Input,Icon,Table,notification} from 'antd';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';
moment.locale('zh-cn');
const openNotification = () => {
  notification.open({
    message: '数据获取失败',
    description: '请询问相关管理员',
  });
};

class CourseSingle extends Component {
  constructor() {
    super()
    this.state = {
      //表头数据
      columns: [
        {
          title: '课程名称',
          dataIndex: 'title',
          width: 300,
          fixed: 'left'
        }, {
          title: '上架时间',
          dataIndex: 'uptime',
          width: 150
        }, {
          title: '课程类型',
          dataIndex: 'type',
          width: 150
        }, {
          title: '课程详情页浏览次数',
          dataIndex: 'xiang_qing_pv',
          width: 150,
          sorter:true,
        }, {
          title: '发起报名次数',
          dataIndex: 'yu_bao_ming_ci_shu',
          width: 150,
          sorter:true,
        }, {
          title: '成功订单数',
          dataIndex: 'bao_ming_ci_shu',
          width: 150,
          sorter:true,
        }, {
          title: '听课次数',
          dataIndex: 'ting_ke_ci_shu',
          width: 150,
          sorter:true,
        }, {
          title: '课程详情页浏览人数',
          dataIndex: 'xiang_qing_uv',
          width: 150,
          sorter:true,
        }, {
          title: '听课用户数',
          dataIndex: 'ting_ke_ren_shu',
          width: 150,
          sorter:true,
        }, {
          title: '收入',
          dataIndex: 'shou_ru',
          width: 150,
          sorter:true,
        }
      ],
      allData: [],//下载表格输出的数据
      end: moment(),//结束时间
      start: moment().subtract(7, 'days'),//起始时间
      total: null,//总共的数据条数
      loading: false,//是否正在加载数据
      tableData: [], //表格数据
      page: 1,//当前页数
      search_key: '',//模糊匹配输入值
      sort_key:'',
      sort_type:'desc',
    }

  }

  componentWillMount() {
    const t = this
    t.setState({loading: true})
    DB.Analyse.getCourseSingle({start_time: t.state.start.valueOf(), end_time: t.state.end.valueOf(), page_size: 15, page_num: 1,}).then(re => {
      t.handleData(re)
      t.setState({loading: false,total: re.total})
    })
  }

  //时间选择器更改
  dateOnChange(date) {
    const t = this
    t.setState({loading: true})
    let start = date[0]
    let end = date[1]
    this.setState({
      end: end,
      start: start,
      search_key: ''
    }, function() {
      DB.Analyse.getCourseSingle({start_time: t.state.start.valueOf(), end_time: t.state.end.valueOf(), page_size: 15, page_num: 1}).then(re => {
        t.handleData(re)
        t.setState({ loading: false, total: re.total, page: 1, search_key: '',})
      },(err)=>{
        openNotification()
      })
    })
  }



  //模糊匹配改变
  matchOnChange(e) {
    let matchString = e.target.value;
    let nullString = ''
    const t = this
    this.setState({
      search_key: e.target.value,
      page: 1,
      sort_key:''
    }, function() {
      t.setState({loading: true})
      DB.Analyse.getCourseSingle({
        start_time: matchString === nullString? t.state.start.valueOf() : nullString,
        end_time: matchString === nullString? t.state.end.valueOf()  : nullString,
        page_size: 15,
        page_num: 1,
        search_key: matchString
      }).then(re => {
        t.handleData(re)
        t.setState({loading: false,total:re.total})
      },(err)=>{
        openNotification()
      })
    })
  }

  //表格数据处理
  handleData(data) {
    if (data) {
      let t = data.list;
      let tempData = [];
      for (let i of t) {
        tempData.push({
          key: moment().valueOf()+Math.random(),
          title: i.title,
          uptime: moment(i.uptime).format(dateFormat),
          type: i.type,
          yu_bao_ming_ci_shu: 0,
          bao_ming_ci_shu: i.bao_ming_ci_shu,
          ting_ke_ren_shu: i.ting_ke_ren_shu,
          ting_ke_ci_shu: i.ting_ke_ci_shu,
          xiang_qing_pv: i.xiang_qing_pv,
          xiang_qing_uv: i.xiang_qing_uv,
          shou_ru: (i.shou_ru / 100).toFixed(2),
          // shou_ru:i.shou_ru
        })
      }
      this.setState({tableData: tempData})
    }
  }

  //设置不可显示的时间
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  //下载表格
  download = () => {
    const t = this
    DB.Analyse.getCourseSingle({start_time: t.state.start.valueOf(), end_time: t.state.end.valueOf(), page_size: 1000}).then(re => {
      t.setState({
        allData: re.list
      }, function() {
        let temData = this.state.allData.map((item, index) => {
          return {
            title: item.title || '0',
            uptime: moment(item.uptime).format(dateFormat) || '0',
            type: item.type || '0',
            bao_ming_ci_shu: item.bao_ming_ci_shu || '0',
            ting_ke_ren_shu: item.ting_ke_ren_shu || '0',
            ting_ke_ci_shu: item.ting_ke_ci_shu || '0',
            xiang_qing_pv: item.xiang_qing_pv || '0',
            xiang_qing_uv: item.xiang_qing_uv || '0',
            shou_ru: (item.shou_ru / 100).toFixed(2) || '0'
          }
        },(err)=>{
          openNotification()
        })
        JSON2EXCEL(temData, '课程单例分析导出表', [
          '课程名称',
          '上架时间',
          '课程种类',
          '成功订单数',
          '听课用户数',
          '听课用户数',
          '详情页pv',
          '详情页uv',
          '收入'
        ])
      })
    })
  }

  handleTableChange(pagination, filters, sorter){
    const t = this

      t.setState({
        sort_key:sorter.field,
        loading:true,
        page:pagination.current
      },function () {
        let temp
        if(t.state.search_key){
          temp = {
            page_size: 15,
            page_num: t.state.page,
            search_key: t.state.search_key
          }
        }
        else {
          temp = {
            start_time: t.state.start.valueOf(),
            end_time: t.state.end.valueOf(),
            page_size: 15,
            page_num: t.state.page,
          }
        }
        if(sorter.field){
          temp.sort_key=sorter.field
          if(sorter.order === 'descend'){
            temp.sort_type= 'desc'
          }
          if(sorter.order === 'ascend'){
              temp.sort_type= 'asc'
          }
        }
        DB.Analyse.getCourseSingle(temp).then(re => {
          t.handleData(re)
          t.setState({loading: false,total: re.total})
        })
      })


  }

  render() {
    const suffix = <Icon type="question-circle-o" />
     return (
    <div className="course-single">
      <div className="title">课程单例分析</div>
      <div className="table-top">
        <div className="dates-download">
          <div className="top-text">上架时间:</div>
          <div className="table-datepicker">
            <div className='mydatepicker'>
              <div>
                <RangePicker size='large' value={[ moment(this.state.start, dateFormat), moment(this.state.end, dateFormat) ]} format={dateFormat} onChange={this.dateOnChange.bind(this)} allowClear={false} disabledDate={this.disabledDate.bind(this)}/>
              </div>
            </div>
          </div>
          <div className="search">
            <Input placeholder="模糊匹配查询" style={{ width: '359px' }} suffix={suffix} value={this.state.search_key} onChange={ ((e)=> this.matchOnChange(e))}/>
          </div>
          <div className="download-question">
            <div className="table-question"></div>
            <div className="download" onClick={this.download}>下载表格</div>
          </div>
        </div>
        <div className="mytable">
            <Table
                  columns={this.state.columns}
                  loading={this.state.loading}
                  dataSource={this.state.tableData}
                  pagination={{
                    showTotal:(total, range) => `共 ${total} 条`,
                    pageSize:15,
                    current:this.state.page,
                    total:this.state.total,
                    showQuickJumper:true,
                  }}
                  onChange={this.handleTableChange.bind(this)}
                  scroll={{ x: 1650 }}/>
        </div>
      </div>
    </div>
    )
  }
}

export default CourseSingle;
