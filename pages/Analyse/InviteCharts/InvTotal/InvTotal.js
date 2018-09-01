/*
Author:Joyful
Date:2017/8/28
*/

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import DataIndex from '@modules/DataIndex';
import Tabs from '@modules/Tabs'
import TotalAndUserEchart from '@modules/TotalAndUserEchart';
import JSON2EXCEL from '@modules/Export'
import {
  DatePicker,
  Select,
  Pagination,
  Table,
  Popover,
  Icon
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import DB from '@DB';

const {MonthPicker, RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;

const TITLEMAP = [
  {
    value: '累计邀请用户数',
    key: 'lei_ji_yao_qing'
  }, {
    value: '新增邀请用户数',
    key: 'xin_zeng_yao_qing'
  }, {
    value: '累计课程兑换次数',
    key: 'lei_ji_dui_huan'
  }, {
    value: '新增课程兑换次数',
    key: 'xin_zeng_dui_huan'
  }, {
    value: '累计课程兑换用户数',
    key: 'lei_ji_dui_ke_yh'
  }, {
    value: '新增课程兑换用户数',
    key: 'xin_zeng_dui_ke_yh'
  }
]

const text = <span>名词解释</span>;
const content = (
  <div>
    <p>累计邀请用户数：通过各个邀请卡活动累计的总用户数。</p>
    <p>新增邀请用户数：通过邀请卡新增的累计的用户数。</p>
    <p>累计课程兑换用户数：邀请卡活动中累计兑换课程的用户数。</p>
    <p>新增课程兑换用户数：邀请卡活动中新增兑换课程的用户数。</p>
    <p>累计课程兑换次数：截止到当前时间，通过邀请卡活动所有课程被兑换的累计总次数。</p>
    <p>新增课程兑换次数：一段时间内，通过邀请卡活动所有课程被兑换的每日新增次数。</p>
  </div>
);
class InvTotal extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      indexName: '总体数据',
      host: '',
      chart_start_time: moment().subtract(7, 'days').valueOf(),
      chart_end_time: moment().valueOf(),
      table_start_time: moment().subtract(7, 'days').valueOf(),
      table_end_time: moment().valueOf(),
      tab: {
        key: 'lei_ji_yao_qing',
        title: '累计邀请用户数'
      },
      zhibiaoData: [], //指标数据
      tableallData: [], //表格总数据
      allData: [], //图表所有数据
      handlData: [], //图表数据
      page_num: 1,   //当前分页
      page_size: 15, //表格每页数据条数
      total: 0, //表格总数据
    }
  }

  componentDidMount() {
    this.fetchIndexData()
    this.fetchEchartsData()
    this.fetchTableData()
  }
  //获取指标数据
  fetchIndexData() {
    const t = this;
    DB.Analyse.getInvTotal().then(result => {
      let {
        list = []
      } = result
      let obj
      if (list && list.length) {
        obj = list[0] || {}
      }
      t.setState({zhibiaoData: obj})
    })
  }
  //获取图表数据并进行处理
  fetchEchartsData() {
    const t = this;
    DB.Analyse.getInvTotal({start_time: t.state.chart_start_time, end_time: t.state.chart_end_time, page_num: 1, page_size: 1000}).then(result => {
      let dt = result
      let handlData = []
      let {
        list = []
      } = result
      if (list && list.length) {
        let obj = list[0]
        for (let k in TITLEMAP) {
          handlData.push({
            title: TITLEMAP[k].value,
            key: TITLEMAP[k].key,
            val: obj[TITLEMAP[k].key]
          })
        }
      }
      t.setState({allData: dt.list, handlData: handlData})
    })
  }
  //获取表格数据并处理
  fetchTableData() {
    const t = this
    DB.Analyse.getInvTotal({
      start_time: t.state.table_start_time,
      end_time: t.state.table_end_time,
      page_num: t.state.page_num}).then(result => {
      let dt = result;
      t.setState({tableallData: dt.list, page_size: dt.page_size, total: dt.total})
    })
  }
  //tab标签选择后重新发起数据请求
  choosed = (key, title) => {
    this.setState({
      tab: {
        key: key,
        title: title
      }
    }, () => {
      this.fetchEchartsData()
    })
  }
  //下拉选择最近天数
  onSelect(value) {
    this.setState({
      chart_start_time: moment().subtract(value, 'days').valueOf(),
      chart_end_time: moment().valueOf()
    }, () => {
      this.fetchEchartsData()
    })
  }
  //禁止选择未来时间
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }
  //图表中日历选择器选择时间后，重新获取数据
  onChange(date, dateString) {
    this.setState({
      chart_start_time: moment(date[0]).valueOf(),
      chart_end_time: moment(date[1]).valueOf()
    }, () => {
      this.fetchEchartsData()
    })
  }
  //表格中日历选择器选择时间后，重新获取数据
  onChangeRan(date, dateString) {
    this.setState({
      table_start_time: moment(date[0]).valueOf(),
      table_end_time: moment(date[1]).valueOf(),
      page_num: 1
    }, () => {
      this.fetchTableData()
    })
  }

  //下载表格数据
  download = () => {
    let temData = this.state.tableallData.map((item, index) => {
      return {
        date: item.date,
        lei_ji_yao_qing: item.lei_ji_yao_qing || '0',
        xin_zeng_yao_qing: item.xin_zeng_yao_qing || '0',
        lei_ji_dui_huan: item.lei_ji_dui_huan || '0',
        xin_zeng_dui_huan: item.xin_zeng_dui_huan || '0',
        lei_ji_dui_ke_yh: item.lei_ji_dui_ke_yh || '0',
        xin_zeng_dui_ke_yh: item.xin_zeng_dui_ke_yh || '0'
      }
    })
    JSON2EXCEL(temData, '总体数据导出列表', [
      '日期',
      '累计邀请用户数',
      '新增邀请用户数',
      '累计课程兑换次数',
      '新增课程兑换次数',
      '累计课程兑换用户数',
      '新增课程兑换用户数'
    ])
  }
  //表格中所有数据排序
  sorterFetch(pagination, filters, sorter) {
    const t = this
    if (typeof(sorter.order) === "undefined") {
      t.fetchTableData()
    }
    t.setState({
      page_num: pagination.current
    }, function() {
      if (sorter.field) {
        t.setState({
          sort_key: sorter.field,
          sort_type: sorter.order === "ascend"
            ? 'asc'
            : 'desc'
        }, function() {
          t.sorter_send()
        })
      }
    })

  }
  //排序数据获取
  sorter_send() {
    const t = this;
    let sortkeyif = {
      start_time: t.state.table_start_time,
      end_time: t.state.table_end_time,
      page_size:t.state.page_size,
      page_num:1,
      sort_key: t.state.sort_key,
      sort_type: t.state.sort_type
    }
    DB.Analyse.getInvTotal(sortkeyif).then(result => {
      let dt = result;
      t.setState({tableallData: dt.list,total: dt.total,})
    })
  }
  render() {
    //表格头，并设置时间以及新增列能排序，排序方式为所有数据上的排序
    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        sorter: true,
        fixed: 'left'
      }
    ]
    for (let k in TITLEMAP) {
      let tem = {
        title: TITLEMAP[k].value,
        dataIndex: TITLEMAP[k].key,
        key: TITLEMAP[k].key
      }
      if (TITLEMAP[k].key === 'xin_zeng_yao_qing' || TITLEMAP[k].key === 'xin_zeng_dui_huan' || TITLEMAP[k].key === 'xin_zeng_dui_ke_yh') {
        tem.sorter = true
      }
      columns.push(tem)
    }
    let temData = this.state.tableallData.map((item, index) => {
      item.key = index
      return item
    })

    return (
      <div className="invtotal-wrap">
        <div className="invtotal-title">总体数据分析</div>
        <div className="invtotal-content">
          <DataIndex title={TITLEMAP} list={this.state.zhibiaoData} indexName={this.state.indexName}/>
          <Popover title={text} content={content} trigger="click" style={{
            float: 'left'
          }}>
            <Icon className="icon-jieshi" type="question-circle"/>
          </Popover>
          <div className="invtotal-echarts">
            <Tabs onChoose={this.choosed} choosed={this.state.tab} list={this.state.handlData}/>
            <div className="invtotal bd_ccc">
              <div className="invtotal-t">
                <div className='dateselector'>
                  <Select defaultValue="最近七天" style={{
                    width: '120px'
                  }} size='large' onSelect={this.onSelect.bind(this)}>
                    <Option value="7">最近七天</Option>
                    <Option value="15">最近十五天</Option>
                    <Option value="30">最近三十天</Option>
                  </Select>
                </div>
                <div className="datepicker">
                  <RangePicker size='large' value={[
                    moment(this.state.chart_start_time),
                    moment(this.state.chart_end_time)
                  ]} format={dateFormat} onChange={this.onChange.bind(this)} disabledDate={this.disabledDate.bind(this)}/>
                </div>
              </div>
              <div className="invtotal-b">
                <TotalAndUserEchart data={this.state}/>
              </div>
            </div>
          </div>
          <div className="invtotal-table">
            <div className="invtotal bd_ccc">
              <div className="invtotal-t">
                <div onClick={this.download} className="invtotal-download">
                  下载表格
                </div>
                <div className="datepicker-t">
                  <RangePicker size='large' value={[
                    moment(this.state.table_start_time),
                    moment(this.state.table_end_time)
                  ]} format={dateFormat} onChange={this.onChangeRan.bind(this)} disabledDate={this.disabledDate.bind(this)}/>
                </div>
              </div>
              <div className="invtotal-b">
                <Table columns={columns} dataSource={temData} onChange={this.sorterFetch.bind(this)} pagination={{
                  showTotal: (total, range) => `共 ${total} 条`,
                  pageSize: this.state.page_size,
                  current: this.state.page_num,
                  total: this.state.total
                }} scroll={{
                  x: '120%'
                }}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(InvTotal);
