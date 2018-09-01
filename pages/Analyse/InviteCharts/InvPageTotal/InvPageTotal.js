/**
 * 2017-08-28
 * @author yeqinglong
 * 邀请卡页面汇总数据分析
 */
import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import Tabs from '@modules/Tabs'
import { DatePicker,Select,Pagination,Table, Icon } from 'antd';
import DataIndex from '@modules/DataIndex'
import JSON2EXCEL from '@modules/Export'
import TotalAndUserEchart from '@modules/TotalAndUserEchart'
import DB from '@DB'
import './InvPageTotal.css'

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
//邀请卡页面汇总数据分析各项名称
const TITLEMAP = [{
  value:'累计邀请卡活动页面的浏览次数',
  key:'lei_ji_card_pv'
},{
  value:'累计邀请卡活动页面的浏览人数',
  key:'lei_ji_card_uv'
},{
  value:'累计新人验证手机号页面的浏览次数',
  key:'lei_ji_apply_pv'
},{
  value: '累计新人验证手机号页面的浏览人数',
  key:'lei_ji_apply_uv'
},{
  value:'累计新人领取成功页面的浏览次数',
  key:'lei_ji_success_pv'
},{
  value:'累计新人领取成功页面的浏览人数',
  key:'lei_ji_success_uv'
}]
class InvPageTotal extends Component {
  constructor(props,context) {
    super(props, context)
    this.state = {
      host: '',
      //昨日关键指标的数据 请求起始时间设为昨日
      start_time_dataindex: moment().startOf('day').subtract(1, 'days').valueOf(),
      //默认为最近7天
      start_time: moment().startOf('day').subtract(7, 'days').valueOf(),
      end_time:moment().valueOf(),
      start_time_table: moment().startOf('day').subtract(7, 'days').valueOf(),
      end_time_table:moment().valueOf(),
      zhibiaoData: [],
      indexName:'邀请卡页面汇总数据分析',
      //默认选中项为预报名次数
      tab:{
        key:'lei_ji_card_pv',
        title:'累计邀请卡活动页面的浏览次数'
      },
      allData:[],
      allData_table:[],
      handlData:[],
      page_num:1,
      page_size:15,
      total:0,
      download_arr:[],
      columns:[],
      dataSource:[]
    }
  }
  componentDidMount(){
    //页面初始化时发送三个请求
      this.dataIndex_send()
      this.echarts_send()
      this.table_send()
  }
  //邀请卡页面汇总数据分析请求数据
  dataIndex_send(){
    const t = this;
    DB.Analyse.getInvPageTotal({
      //请求的起始与截止时间均为昨日
        start_time:t.state.start_time_dataindex,
        end_time:t.state.start_time_dataindex,
    }).then( result =>{
      let { list = [] } = result
      let obj
      if (list && list.length) {
          obj = list[0] || {}
      }
      t.setState({
        zhibiaoData: obj
      })
    })
  }
  //echarts请求及数据处理函数
  echarts_send(){
    const t = this;
    DB.Analyse.getInvPageTotal({
        start_time:t.state.start_time,
        end_time:t.state.end_time,
        //page_size尽量大以保证图表显示数据完全
        page_size:1000,
        page_num:1
    }).then(result =>{
      let dt = result;
      let handlData = []
      let { list=[] } = result
      if(list && list.length){
          let obj = list[0]
          for(let k in TITLEMAP){
              handlData.push({
                  title: TITLEMAP[k].value,
                  key:TITLEMAP[k].key,
                  val: obj[TITLEMAP[k].value]
              })
          }
      }
      t.setState({
            allData:dt.list,
            handlData:handlData
      })
    })
  }
  //表格初始请求与数据处理函数
  table_send(){
      const t = this;
      DB.Analyse.getInvPageTotal({
          start_time:t.state.start_time_table,
          end_time:t.state.end_time_table,
          page_num:t.state.page_num,
      }).then(result =>{
          let dt = result;
          let dtlistarr = [];
          for(let i=0 ; i<dt.list.length ; i++){
              dtlistarr.push(dt.list[i])
          }
          t.setState({
              allData_table:dtlistarr,
              page_size:dt.page_size,
              total:dt.total,
          })
        })
  }
  //点击选项菜单，通过更改tab中的值，重新发送请求，切换Echarts所展示的数据
  choosed=(key, title)=>{
    this.setState({
        tab:{
          key:key,
          title:title
        }
    }, ()=>{
      this.echarts_send()
    })
  }
  //禁止选择未来时间
  disabledDate(current) {
      return current && current.valueOf() > Date.now();
  }
  //Echarts下自主选择时间段时，重发请求
  onChange(date, dateString) {
      this.setState({
          start_time:moment(date[0]).valueOf(),
          end_time:moment(date[1]).valueOf(),
      }, ()=>{
          this.echarts_send()
      })
  }
  //Echarts下切换最近几天时，重新发送请求
  onSelect(value) {
      this.setState({
          start_time:moment().subtract(value, 'days').valueOf(),
          end_time:moment().valueOf(),
      }, ()=>{
          this.echarts_send()
      })
  }
  //Table下自主选择时间段时，重发请求
  onChangeRan(date, dateString){
      this.setState({
          start_time_table:moment(date[0]).valueOf(),
          end_time_table:moment(date[1]).valueOf(),
          //默认表格数据显示第一页
          page_num:1,
      }, ()=>{
          this.table_send()
      })
  }
  //表格点击排序时重新发送请求，并且排序数据为所选时间段内所有数据
  sorterFetch(pagination, filters, sorter){
    const t = this
    //点击分页时，更改page_num的值，并且重新发送请求
    t.setState({
      page_num:+pagination.current,
    }, ()=>{
      t.table_send()
    })
    if(sorter.field){
      //排序为日期时，添加排序sort_key,以时间字段排序
      //在添加sort_key的条件下重新发送请求
          if(sorter.order === 'descend'){
            //降序时增加sort_type为desc，重新发送请求
            t.setState({
              sort_key:(sorter.field===undefined?'':sorter.field),
              sort_type:'desc'
            }, ()=>{
               t.sorter_send()
            })
          }
          if(sorter.order === 'ascend'){
            //升序时增加sort_type为asc，重新发送请求
              t.setState({
                sort_key:(sorter.field===undefined?'':sorter.field),
                sort_type:'asc'
              }, ()=>{
                 t.sorter_send()
              })
          }
    }
  }
  sorter_send(){
      const t = this;
      //sortkeyif为请求的条件
      let sortkeyif = {
        start_time: t.state.start_time_table,
        end_time: t.state.end_time_table,
        page_size: 1000,
        page_num: 1,
        //添加请求条件 sort_key与sort_type
        sort_key:t.state.sort_key,
        sort_type:t.state.sort_type
      }
      DB.Analyse.getInvPageTotal(sortkeyif)
      .then(result=>{
          let dt = result;
          let dtlistarr = [];
          for(let i=0 ; i<dt.list.length ; i++){
              dtlistarr.push(dt.list[i])
          }
          //如果数据条数超过15条，则第一页最多仅显示15条，出现分页
          if(dt.page_size>15){
            t.setState({
                allData_table:dtlistarr,
                page_size:15,
                total:dt.total,
            })
          }
          else {
            t.setState({
                allData_table:dtlistarr,
                page_size:dt.page_size,
                total:dt.total,
            })
          }
      })
  }
  //点击下载表格时重新发送请求，下载所选时间段内的数据
  download = () => {
      this.download_send()
  }
  download_send(){
      const t = this;
      DB.Analyse.getInvPageTotal({
          start_time:t.state.start_time_table,
          end_time:t.state.end_time_table,
          page_size:1000
      }).then(result=>{
          let dt_download = result;
          let download_arr=[];
          for(let i=0 ; i<dt_download.list.length ; i++){
              download_arr.push(dt_download.list[i])
          }
          t.setState({
              download_arr:download_arr,
          },function download_data(){
            let temData = t.state.download_arr.map((item,index)=>{
                return {
                    date:item.date,
                    lei_ji_card_pv:item.lei_ji_card_pv||'0',
                    lei_ji_card_uv:item.lei_ji_card_uv||'0',
                    lei_ji_apply_pv:item.lei_ji_apply_pv||'0',
                    lei_ji_apply_uv:item.lei_ji_apply_uv||'0',
                    lei_ji_success_pv: item.lei_ji_success_pv||'0',
                    lei_ji_success_uv:item.lei_ji_success_uv||'0',
                }
            })
            JSON2EXCEL(temData,'邀请卡页面汇总数据分析导出列表',['日期','累计邀请卡活动页面的浏览次数','累计邀请卡活动页面的浏览人数','累计新人验证手机号页面的浏览次数','累计新人验证手机号页面的浏览人数','累计新人领取成功页面的浏览次数','累计新人领取成功页面的浏览人数'])
          })
      })
  }
    render(){
      const columns = []
      for(let k in TITLEMAP){
        //事先插入一条表头选项为日期的数据
        if(k==0){
          let tem = {
              title: "日期",
              dataIndex:"date",
              key:"date",
          }
          //固定日期列
          tem.fixed = 'left'
          //日期列有排序功能
          tem.sorter= (a, b) => {
              return a.data_time-b.data_time
          }
            columns.push(tem)
        }
          let tem = {
              title: TITLEMAP[k].value,
              dataIndex:TITLEMAP[k].key,
              key:TITLEMAP[k].key,
          }
          columns.push(tem)
      }
      //表格数据遍历处理
      let temData = this.state.allData_table.map((item,index)=>{
          item.key = index
          return item
      })
      return(
        <div className="InvPageTotal">
          <div className="InvPageTotal-title">邀请卡页面汇总数据分析</div>
          <div className="InvPageTotal-container">
            <div className="DataIndex">
                <DataIndex title={TITLEMAP} list={this.state.zhibiaoData} indexName={this.state.indexName}/>
            </div>
            <div className="InvPageTotal-Echarts">
              <Tabs onChoose={this.choosed}
                    choosed={this.state.tab}
                    list={this.state.handlData}/>
                    <div className="yqkymhz bd_ccc">
                      <div className="time-echarts-div">
                        <div className='dateselector'>
                          <Select defaultValue="最近七天"
                            style={{ width: '120px'}}
                            size = 'large'
                            onSelect = {this.onSelect.bind(this)}>
                              <Option value="7">最近七天</Option>
                              <Option value="15">最近十五天</Option>
                              <Option value="30">最近三十天</Option>
                          </Select>
                        </div>
                        <div className="datepicker">
                          <RangePicker
                            size = 'large'
                            value={[moment(this.state.start_time),moment(this.state.end_time)]}
                            format={dateFormat}
                            onChange={this.onChange.bind(this)}
                            disabledDate={this.disabledDate.bind(this)}
                          />
                        </div>
                      </div>
                      <div className="yqkymhz-b">
                        <TotalAndUserEchart data={this.state}/>
                      </div>
                    </div>
            </div>
            <div className="InvPageTotal-Table">
                <div className="yqkymhz bd_ccc">
                  <div className="time-table-div">
                    <div onClick={this.download} className="ztfx-download">下载表格</div>
                    <div className="datepicker-t">
                      <RangePicker
                        size = 'large'
                        value={[moment(this.state.start_time_table),moment(this.state.end_time_table)]}
                        format={dateFormat}
                        onChange={this.onChangeRan.bind(this)}
                        disabledDate={this.disabledDate.bind(this)}/>
                    </div>
                  </div>
                  <div className="yqkymhz-b">
                    <Table
                      on
                      columns={columns}
                      dataSource={temData}
                      onChange={this.sorterFetch.bind(this)}
                      // bordered //表格边框线
                      pagination={{
                        showTotal:(total, range) => `共 ${total} 条`,
                        pageSize:this.state.page_size,
                        current:this.state.page_num,
                        total:this.state.total,
                        showQuickJumper:true
                      }}
                      scroll={{ x:'140%'}}
                    />
                  </div>
                </div>
            </div>
          </div>
        </div>
      )
    }
}

export default withRouter(InvPageTotal);
