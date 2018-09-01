/*
Author:Joyfu
Date:2017/8/11
*/
import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import DB from '@DB'
import JSON2EXCEL from '@modules/Export'
import {Pagination, DatePicker, Table, Icon, Checkbox} from 'antd';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const pagename = [
  {
    "name": "移动端首页",
    "key": "shou_ye"
  }, {
    "name": "移动端全部课程页面（总）",
    "key": "ke_cheng_lie_biao"
  }, {
    "name": "移动端课程详情页面（总）",
    "key": "ke_cheng_xiang_qing"
  }, {
    "name": "移动端个人中心页面",
    "key": "wo_de"
  }, {
    "name": "移动端直播播放页面（总）",
    "key": "zhi_bo"
  }, {
    "name": "移动端视频播放页面（总）",
    "key": "lu_bo"
  }, {
    "name": "移动端支付页面（总）",
    "key": "fu_kuan"
  }, {
    "name": "移动端课件下载页面（总）",
    "key": "ke_jian_xia_zai"
  }
]

class PageTime extends Component {
  constructor() {
    super();
    this.state = {
      columns: [
        {
          title: '时间',
          dataIndex: 'date',
          width: 120,
          key: 'date',
          loading: false,
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {}
            };
            if (index === 0) {
              obj.props.rowSpan = 8;
            } else {
              obj.props.rowSpan = 0;
            }
            return obj;
          }
        }, {
          title: '',
          width: 30,
          dataIndex: 'cb',
          // key:'path'
        }, {
          title: '页面名称',
          dataIndex: 'name',
          width: 180,
          key: 'name'
        }, {
          title: '浏览次数',
          dataIndex: 'pv',
          width: 150,
          key: 'pv',
          sorter: true
        }, {
          title: '浏览人数',
          dataIndex: 'uv',
          width: 150,
          key: 'uv',
          sorter: true
        }
      ],
      tableData: [], //页面表格数据
      loading: true, //是否正在加载数据flag
      host: '',
      paixu_key: '', //选择的页面的key
      sort_key: '', //排序字段  例如'shou_ye_pv'
      sort_type: '', //排序规则  ’desc‘倒序，’asc'正序
      start_time: moment().subtract(7, 'days').valueOf(),
      end_time: moment().valueOf(),
      total: '', //数据总条数
      page_size: 24, //每页数据条数
      page_num: 1, //当前分页
    }
  }

  componentDidMount() {
    this.send();
  }
  //获取数据  没有排序
  send() {
    const t = this;
    let query = {
      start_time: t.state.start_time,
      end_time: t.state.end_time,
      page_size: 24,
    }
    DB.Analyse.getPageTime(query).then(re => {
      t.handleData(re)
    })
  }

  //处理数据，将同一时间段的数据时间合并单元格； 获取的每组数据固定8条，将第一行的rowspan设置为8，接下来都是0，
  handleData(data) {
    const t = this;
    if (data) {
      let tempData = data.map((item, index) => {
        !item.pv
          ? item.pv = 0
          : item.pv;
        !item.uv
          ? item.uv = 0
          : item.uv;
        item.key = index;
        return item
      });
      var columns = t.state.columns
      columns[0].render = (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        };
        if (index % 8 === 0) {
          obj.props.rowSpan = 8;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      }
      t.setState({tableData: tempData, columns: columns, loading: false, total: tempData.length})
    }
  }
  //禁止选择以后的时间
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }
  //时间选择器更改
  dateOnChange(date) {
    const t = this
    t.setState({
      end_time: moment(date[1]).valueOf(),
      start_time: moment(date[0]).valueOf(),
      page_num: 1,
      loading: true,
      sort_key: '',
      sort_type: '',
      paixu_key: ''
    }, function() {
      t.send();
    })
  }

  //单击表格行选择页面名称
  onRowDoubleClick = (record, index, event) => {
    const t = this
    let data = t.state.tableData
    for (let i in data) {
      data[i].cb = ''
    }
    let zhongwenname = record.name;
    let yingwenname = '';
    for (let item of pagename) {
      if (item.name === zhongwenname) {
        yingwenname = item.key
      }
    }
    // data[record.key].cb = (<Checkbox checked={true}/>)
    record.cb = (<Checkbox checked={true}/>)
    t.setState({tableData: data, paixu_key: yingwenname})
  }
  //双击表格行取消页面名称选择，同时清空paixu_key字段
  onRowClick = (record, index, event) => {
    const t = this
    let data = t.state.tableData
    for (let i in data) {
      data[i].cb = ''
    }
    t.setState({tableData: data, paixu_key: ''})
  }
  //下载表格
  download = () => {
    const t = this
    DB.Analyse.getPageTime({start_time: t.state.start_time, end_time: t.state.end_time, page_size: 1000}).then(re => {
      let temData = []
      re.map(function(item, index) {
        temData.push({date: item.date, name: item.name, pv: item.pv, uv: item.uv, path: item.path})
      })
      JSON2EXCEL(temData, '页面时间分析导出表', ['日期', '页面名称', '浏览次数', '浏览人数', '页面地址'])
    })
  }

  sorterFetch(pagination, filters, sorter) {
    const t = this
    if(typeof(sorter.order) === "undefined"){t.send()}
    t.setState({
      page_num: pagination.current
    }, function() {
      //当页面名称没有被选择时，对相同时间的八个页面进行pv  uv的排序
      if (!t.state.paixu_key) {
        const t = this;
        let paixuData = t.state.tableData
        let a = []
        let b = []
        for (let i = 0; i * 8 < paixuData.length; i++) {
          a = paixuData.slice(i * 8, (i + 1) * 8);
          //sort by pv
          if (sorter.field === 'pv') {
            sorter.order === "ascend"?
              a.sort((x, y) => {
                return x.pv - y.pv
              })
            :   a.sort((x, y) => {
                return y.pv - x.pv
              })
          }
          else {
            //sort by uv
            sorter.order === "ascend"
              ? a.sort((x, y) => {
                return x.uv - y.uv
              })
              : a.sort((x, y) => {
                return y.uv - x.uv
              })
          }
          b = b.concat(a)
        }
        t.setState({tableData: b})
      }
      //选择页面名称，进行时间维度上的pv uv排序
      if (sorter.field && t.state.paixu_key) {
        t.setState({
          sort_key: sorter.field,
          sort_type: sorter.order === "ascend"
            ? 'asc'
            : 'desc',
          loading: true
        }, function() {
          t.sorter_send()
        })
      }
    })
  }

  sorter_send() {
    const t = this;
    let sortkeyif = {
      start_time: t.state.start_time,
      end_time: t.state.end_time,
      page_size: 24,
      sort_key: t.state.paixu_key + "_" + t.state.sort_key,
      sort_type: t.state.sort_type
    }
    DB.Analyse.getPageTime(sortkeyif).then(result => {
      t.handleData(result)
      let pgname='';
      for (let item of pagename) {
        if (item.key === t.state.paixu_key) {
          pgname=item.name
        }
      }
      function findpagename(page){
        return page.name===pgname
      }
      t.state.tableData.find(findpagename).cb=(<Checkbox checked={true}/>)
      t.setState({
        sort_key: '',
        sort_type: '',
        // paixu_key: '',
      })
    })
  }

  render() {
    return (
      <div className="pagetime-wrap">
        <div className="yh">页面时间分析</div>
        <div className="pagetime-content">
          <div className="pt-dates-download">
            <div className="pt-table-datepicker">
              <div className='pt-mydatepicker'>
                <div>
                  <RangePicker size='large' value={[
                    moment(this.state.start_time),
                    moment(this.state.end_time)
                  ]} format={dateFormat} onChange={this.dateOnChange.bind(this)} allowClear={false} disabledDate={this.disabledDate.bind(this)}/>
                </div>
              </div>
            </div>
            <div className="pt-download-question">
              <div className="pt-download" onClick={this.download}>下载表格</div>
            </div>
          </div>
          <div className="pt-mytable">
            <div className="pt-datetable">
              <Table columns={this.state.columns} onChange={this.sorterFetch.bind(this)} loading={this.state.loading} dataSource={this.state.tableData} pagination={{
                showTotal: (total, range) => `共 ${total} 条`,
                pageSize: 24,
                current: this.state.page_num,
                total: this.state.total,
                showQuickJumper: true
              }} scroll={{
                y: 600
              }} onRowClick={this.onRowClick} onRowDoubleClick={this.onRowDoubleClick}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default PageTime
