/*
Author:lvzu
Date:2017/8/10
*/

import './CourseTime.css';
import React, {Component} from 'react';
import moment from 'moment';
import DB from '@DB'
import JSON2EXCEL from '@modules/Export'

import { Pagination, DatePicker,Table,notification} from 'antd';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';
moment.locale('zh-cn');

const openNotification = () => {
  notification.open({
    message: '数据获取失败',
    description: '请询问相关管理员',
  });
};

//在表格合并处理时有使用，计算各个日期的合并格数
function handleMerge(array, index) {
  let count = 0;
  for (let i = 0; i < index; i++) {
    count += array[i]
  }
  return count;
}

var columns = [
  {
    title: '时间',
    dataIndex: 'date',
    width: 80,
    fixed: 'left',
    key: 'date',
    loading: false,
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {}
      };
      if (index === 0) {
        obj.props.rowSpan = 15;
      } else {
        obj.props.rowSpan = 0;
      }
      return obj;
    }
  }, {
    title: '课程名称',
    dataIndex: 'title',
    width: 280,
    key: 'title',
    fixed:'left'
  }, {
    title: '上架时间',
    dataIndex: 'uptime',
    width: 110,
    key: 'uptime'
  }, {
    title: '课程类型',
    dataIndex: 'type',
    width: 80,
    key: 'type'
  }, {
    title: '课程详情页浏览次数',
    dataIndex: 'xiang_qing_pv',
    width: 150,
    key: 'xiang_qing_pv',
    sorter: (a, b) => a.xiang_qing_pv - b.xiang_qing_pv
  }, {
    title: '发起报名次数',
    dataIndex: 'yu_bao_ming_ci_shu',
    width: 110,
    key: 'yu_bao_ming_ci_shu',
    sorter: (a, b) => a.yu_bao_ming_ci_shu - b.yu_bao_ming_ci_shu
  }, {
    title: '成功订单数',
    dataIndex: 'bao_ming_ci_shu',
    width: 110,
    key: 'bao_ming_ci_shu',
    sorter: (a, b) => a.bao_ming_ci_shu - b.bao_ming_ci_shu
  }, {
    title: '听课次数',
    dataIndex: 'ting_ke_ci_shu',
    width: 110,
    key: 'ting_ke_ci_shu',
    sorter: (a, b) => a.ting_ke_ci_shu - b.ting_ke_ci_shu
  }, {
    title: '课程详情页浏览人数',
    dataIndex: 'xiang_qing_uv',
    width: 150,
    key: 'xiang_qing_uv',
    sorter: (a, b) => a.xiang_qing_uv - b.xiang_qing_uv
  }, {
    title: '听课用户数',
    dataIndex: 'ting_ke_ren_shu',
    width: 110,
    key: 'ting_ke_ren_shu',
    sorter: (a, b) => a.ting_ke_ren_shu - b.ting_ke_ren_shu
  }, {
    title: '收入',
    dataIndex: 'shou_ru',
    width: 150,
    key: 'shou_ru',
    // a.replace(/,/g, "");
    sorter: (a, b) => a.shou_ru - b.shou_ru
  }
]

class CourseTime extends Component {

  constructor() {
    super();
    this.state = {
      end: moment(),
      start: moment().subtract(7, 'days'),
      total: null,//分页总数据条数
      page: 1,//当前页数
      columns: columns, //表格表头定义
      tableData: [], //表格数据
      loading: true,//是否正在加载数据flag
      allData: [],//下载表格导出的数据
    }

  }

  componentWillMount() {

    const t = this;
    var sort_key = "date"
    var sort_type = "desc"
    //获取第一组数据
    t.setState({loading: true})

    DB.Analyse.getCourseTime({
      start_time: t.state.start.valueOf(),
      end_time: t.state.end.valueOf(),
      page_size: 15,
      page_num: 1,
      sort_key:sort_key,
      sort_type:sort_type
    }).then(re => {
      console.log(re);
      t.handleData(re)
      t.setState({total: re.total, loading: false})
    },(err)=>{
      openNotification()
    })

  }

  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }

  //时间选择器更改
  dateOnChange(date) {
    const t = this
    let start = date[0]
    let end = date[1]
    var sort_key = 'date'
    var sort_type = 'desc'
    this.setState({
      end: end,
      start: start,
      loading: true,
      sort_key:sort_key,
      sort_type:sort_type
    }, function() {
      DB.Analyse.getCourseTime({start_time: t.state.start.valueOf(), end_time: t.state.end.valueOf(), page_size: 15, page_num: 1}).then(re => {
        t.handleData(re)
        console.log(re);
        t.setState({total: re.total, page: 1, loading: false})
      },(err)=>{
        openNotification()
      })

    })
  }

  //分页更改
  pageOnChange(page) {
    const t = this
    var sort_key = 'date'
    var sort_type = 'desc'
    this.setState({
      page: page,
      loading: true
    }, function() {

      DB.Analyse.getCourseTime({start_time: t.state.start.valueOf(), end_time: t.state.end.valueOf(), page_size: 15, page_num: page}).then(re => {
        t.handleData(re)
        t.setState({loading: false})
      },(err)=>{
        openNotification()
      })

    })
  }

  //处理接收到的数据
  handleData(data) {
    if (data) {
      //判断接收到的date
      let tempData = [];
      let lengths = [];
      for (let i of data.list) {
        lengths.push(i.items.length)
        for (let j = 0; j < i.items.length; j++) {
          let t = i.items
          tempData.push({
            key: t[j]._id + t[j].course_id,
            date: i.date,
            title: t[j].title,
            uptime: moment(t[j].uptime).format(dateFormat),
            type: t[j].type,
            yu_bao_ming_ci_shu: 0,
            bao_ming_ci_shu: t[j].bao_ming_ci_shu,
            ting_ke_ren_shu: t[j].ting_ke_ren_shu,
            ting_ke_ci_shu: t[j].ting_ke_ci_shu,
            xiang_qing_pv: t[j].xiang_qing_pv,
            xiang_qing_uv: t[j].xiang_qing_uv,
            shou_ru: (t[j].shou_ru / 100).toFixed(2)
          })
        }
      }

      columns[0].render = (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        };
        let tempArray = new Array(15).fill(0)

        /*处理合并表格部分
        *调用上方申明的handleMerge函数处理数组
        *数组处理后如[5,0,0,0,0,3,0,0,4,0,0,0,3,0,0]
        *表示第一个日期有五条课程数据,合并五个格子,第二个日期有三条数据，以此类推
        *然后在index=1,2,3,4处的rowSpan设置为0*/
        for (let i = 0; i < lengths.length; i++) {
          tempArray[handleMerge(lengths, i)] = lengths[i]
        }
        for (let i = 0; i < 15; i++) {
          if (index === i) {
            obj.props.rowSpan = tempArray[i]
          }
        }
        return obj;
      }

      this.setState({tableData: tempData, columns: columns})
    }
  }

  //下载表格
  download = () => {
    const t = this
    DB.Analyse.getCourseTime({start_time: t.state.start.valueOf(), end_time: t.state.end.valueOf(), page_size: 1000}).then(re => {
      t.setState({
        allData: re.list
      }, function() {

        let temData = []
        this.state.allData.map(function(item, index) {
          item.items.map(function(itemT) {
            temData.push({
              date: itemT.date,
              title: itemT.title,
              uptime: moment(itemT.uptime).format(dateFormat),
              type: itemT.type,
              bao_ming_ci_shu: itemT.bao_ming_ci_shu || '0',
              ting_ke_ren_shu: itemT.ting_ke_ren_shu || '0',
              ting_ke_ci_shu: itemT.ting_ke_ci_shu || '0',
              xiang_qing_pv: itemT.xiang_qing_pv || '0',
              xiang_qing_uv: itemT.xiang_qing_uv || '0',
              shou_ru: (itemT.shou_ru / 100).toFixed(2)
            })
          })

        })
        JSON2EXCEL(temData, '课程时间分析导出表', [
          '日期',
          '课程名称',
          '上架时间',
          '课程种类',
          '成功订单数',
          '听课用户数',
          '听课次数',
          '详情页pv',
          '详情页uv',
          '收入'
        ])
      })
    })
  }

    // handleTableChange(pagination, filters, sorter){
    //
    //   const t = this
    //   sorter.order
    //     t.setState({
    //       sort_key:sorter.field,
    //       loading:true,
    //       page:pagination.current
    //     },function () {
    //       let temp = {
    //         start_time: t.state.start.valueOf(),
    //         end_time: t.state.end.valueOf(),
    //         page_size: 15,
    //         page_num: t.state.page,
    //       }
    //       if(sorter.field){
    //         temp.sort_key=sorter.field
    //         if(sorter.order === 'decend'){
    //           temp.sort_type= 'desc'
    //         }
    //         if(sorter.order === 'ascend'){
    //             temp.sort_type= 'asc'
    //         }
    //       }
    //       DB.Analyse.getCourseTime(temp).then(re => {
    //         t.handleData(re)
    //         t.setState({loading: false,total: re.total})
    //       })
    //     })
    //
    // }


  render() {

    return (
    <div className="course-time-main">
      <div className="title">课程时间分析</div>
        <div className="table-top">
          <div className="dates-download">
            <div className="table-datepicker">
              <div className='mydatepicker'>
                <div>
                  <RangePicker size='large' value={[ moment(this.state.start, dateFormat), moment(this.state.end, dateFormat) ]} format={dateFormat} onChange={this.dateOnChange.bind(this)} allowClear={false} disabledDate={this.disabledDate.bind(this)}/>
                </div>
              </div>
            </div>
          <div className="download-question">
            <div className="table-question"></div>
            <div className="download" onClick={this.download}>下载表格</div>
          </div>
        </div>
        <div className="mytable">
          <div className="datetable">
              <Table columns={this.state.columns}
                loading={this.state.loading}
                dataSource={this.state.tableData}
                pagination={{
                  showTotal:(total, range) => `共 ${total} 条`,
                  pageSize:15,
                  current:this.state.page,
                  total:this.state.total,
                  onChange:this.pageOnChange.bind(this),
                  showQuickJumper:true
                }}
                // onChange={this.handleTableChange.bind(this)}
                scroll={{ x: 1440 }}/>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default CourseTime;
