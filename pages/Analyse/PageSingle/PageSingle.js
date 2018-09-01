import React, {Component} from 'react'
import moment from 'moment'
import './PageSingle.css';
import DB from '@DB'
import JSON2EXCEL from '@modules/Export'
import { Pagination, DatePicker, Input,Icon,Table} from 'antd';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';

moment.locale('zh-cn');

class PageSingle extends Component {
  constructor() {
    super()
    this.state = {
      //表头数据
      columns: [
        {
          title: '页面名称',
          dataIndex: 'name',
          width: 300,
          fixed: 'left'
        }, {
          title: '页面访问次数',
          dataIndex: 'pv',
          sorter: (a, b) => a.pv - b.pv,
        }, {
          title: '页面访问人数',
          dataIndex: 'uv',
          sorter: (a, b) => a.uv - b.uv,
        }
      ],
      allData: [],//下载表格输出的数据
      total: null,//总共的数据条数
      loading: false,//是否正在加载数据
      tableData: [], //表格数据
      page: 1,//当前页数
      search_key: ''//模糊匹配输入值
    }

  }

  componentWillMount() {
    const t = this
    t.setState({loading: true})

    DB.Analyse.getPageSingle({page_size: 15, page_num: 1}).then(re => {
      t.handleData(re)
      t.setState({loading: false,total: re.total})
    })

  }


  //分页更改
  pageOnChange(page) {
    const t = this
    t.setState({loading: true})
    this.setState({
      page: page
    }, function() {

      DB.Analyse.getPageSingle({page_size: 15, page_num: page}).then(re => {
        t.handleData(re)
        t.setState({loading: false})
      })
    })
  }

  //表格数据处理
  handleData(data) {
    if (data) {
      let t = data;
      let tempData = [];
      for (let i of t) {
        tempData.push({
          key: i.name,
          name: i.name,
          pv:i.pv || '-',
          uv:(i.uv / 100).toFixed(2) || '-',
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
    DB.Analyse.getPageSingle({page_size: 1000}).then(re => {
      t.setState({
        allData: re
      }, function() {
        let temData = this.state.allData.map((item, index) => {
          return {
            name: item.name || '0',
            pv: item.pv || '0',
            uv: (item.uv / 100).toFixed(2) || '0'
          }
        })
        JSON2EXCEL(temData, '页面单例分析导出表', [
          '页面名称',
          '页面浏览次数',
          '页面访问人数',
        ])
      })
    })
  }

  render() {
    const suffix = <Icon type="question-circle-o" />
     return (
    <div className="page-single">
      <div className="title">页面单例分析</div>
      <div className="table-top">
        <div className="dates-download">
          <div className="download-question">
            <div className="download" onClick={this.download}>下载表格</div>
          </div>
        </div>
        <div className="mytable">
            <Table columns={this.state.columns}
                  dataSource={this.state.tableData}
                  loading={this.state.loading}
                  pagination={false}
                //   pagination={{
                //     showTotal:(total, range) => `共 ${total} 条`,
                //     pageSize:15,
                //     current:this.state.page,
                //     total:this.state.total,
                //     onChange:this.pageOnChange.bind(this),
                //     showQuickJumper:true
                //   }}
                  scroll={{ x: 900 }}/>
        </div>
      </div>
    </div>
    )
  }
}

export default PageSingle;
