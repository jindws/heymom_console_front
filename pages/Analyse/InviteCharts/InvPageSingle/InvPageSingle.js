import React, {Component} from 'react'
import DataIndex from '@modules/DataIndex'
import Tabs from '@modules/Tabs'
import TotalAndUserEchart from '@modules/TotalAndUserEchart'
import { DatePicker,Select,Table,Pagination } from 'antd';
import JSON2EXCEL from '@modules/Export'
import moment from 'moment'
import 'moment/locale/zh-cn';
import DB from '@DB'
moment.locale('zh-cn');

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;

const TITLEMAP = [{
  value:'新增邀请卡活动页面的浏览次数',
  key:'xin_zeng_card_pv'
},{
  value:'新增邀请卡活动页面的浏览人数',
  key:'xin_zeng_card_uv'
},{
  value: '新增新人验证手机号页面的浏览次数',
  key:'xin_zeng_apply_pv'
},{
  value: '新增新人验证手机号页面的浏览人数',
  key:'xin_zeng_apply_uv'
},{
  value:'新增新人领取成功页面的浏览次数',
  key:'xin_zeng_success_pv'
},{
  value:'新增新人领取成功页面的浏览人数',
  key:'xin_zeng_success_uv'
}]

class InvPageSingle extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            host: '',
            echarts_start_time:moment().startOf('day').subtract(7, 'days').valueOf(),//echarts开始时间
            echarts_end_time:moment().valueOf(),//echarts结束时间
            table_start_time:moment().startOf('day').subtract(7, 'days').valueOf(),//table开始时间
            table_end_time:moment().valueOf(),//table结束时间
            zhibiaoData: [],//昨日指标模块要使用的数据
            indexName:'邀请卡页面单日数据分析指标',//昨日指标表头的文字
            page_num:1,
            allData:[],   //echarts当中要使用的全部数据
            tableData:[], //table当中要使用的全部数据
            handlData:[], // handlData:Tabs模块要用的数据,是一个数组,每一项是一个对象,
                          // 对象有3个键值对,比如
                          // {title:'新增新人领取成功页面的浏览次数',key:'xing_zeng_ling_qu_pv',val:'新增邀请卡活动页面的浏览次数'}
            tab:{
              key:'xin_zeng_card_pv',
              title:'新增邀请卡活动页面的浏览次数',
            },//初始值是显示第一项,即'新增邀请卡活动页面的浏览次数'
            sort_key:'',
            sort_type:''
        }
    }
    componentDidMount() {
        this.send_index();//获取昨天累计的数据
        this.send_echarts();//获取到echarts折线图要用的数据
        this.send_table()//获取到tabel表格要用的数据
    }

    // 时间范围选择
    // date:必须得传,一个数组,date[0]是开始时间,data[1]是结束时间
    // dateString:必须得传
    // 当执行onChange函数的时候,改变开始时间和结束时间,然后再发起请求,请求这段时间范围内的数据,
    // 因为这个函数是图表当中的onChange,所以发请求的函数是send_echarts(),为了避免和表格联动,
    // 开始时间和结束时间分别是echarts_start_time和echarts_end_time
    onChange(date, dateString) {
        this.setState({
            echarts_start_time:moment(date[0]).valueOf(),
            echarts_end_time:moment(date[1]).valueOf(),
        }, ()=>{
            this.send_echarts()
        })
    }

    // 选择最近的天数
    // value:最近天数,值分别为7,15,或者30
    // 当执行onSelect函数的时候,根据value来改变开始时间和结束时间,然后再发起请求,请求这段时间范围内的数据,
    // 因为这个函数是图表当中的onChange,所以发请求的函数是send_echarts()
    onSelect(value) {
        this.setState({
            echarts_start_time:moment().subtract(value, 'days').valueOf(),
            echarts_end_time:moment().valueOf(),
        }, ()=>{
            this.send_echarts()
        })
    }

    //当点击tabs的时候进行的操作,即改变某个tab的key和title,因为Tabs模块要根据这个被选中的tab来改变这个被选中的tab的背景颜色
    // 因为这个函数是图表当中的choosed,所以发请求的函数是send_echarts()
    choosed=(key, title)=>{
      this.setState({
          tab:{
            key:key,
            title:title
          }
      }, ()=>{
        this.send_echarts()
      })
    }


    //下载表格
    download = () => {
        const t = this;
        DB.Analyse.getInvitePageSingle({
          start_time:t.state.table_start_time,
          end_time:t.state.table_end_time,
          page_size:1000,
        }).then(result =>{
          const dt = result;
          t.setState({
            allData:dt.list
          }, ()=>{
            let temData = this.state.tableData.map((item,index)=>{
                return {
                    date:item.date,
                    xin_zeng_card_pv:item.xin_zeng_card_pv||'0',
                    xin_zeng_card_uv:item.xin_zeng_card_uv||'0',
                    xin_zeng_apply_pv:item.xin_zeng_apply_pv||'0',
                    xin_zeng_apply_uv: item.xin_zeng_apply_uv||'0',
                    xin_zeng_success_pv:item.xin_zeng_success_pv||'0',
                    xin_zeng_success_uv:item.xin_zeng_success_uv||'0',
                }
            })
            JSON2EXCEL(temData,'邀请卡页面单日数据分析导出列表',['日期','新增邀请卡活动页面的浏览次数','新增邀请卡活动页面的浏览人数','新增新人验证手机号页面的浏览次数','新增新人验证手机号页面的浏览人数','新增新人领取成功页面的浏览次数','新增新人领取成功页面的浏览人数'])
          })
        })
    }

    //根据table当中表头的某个键排序
    // pagination:一个对象,pagination.current表示当前的页数
    // filters:
    // sorter{sorter.field === 'desc' || 'asc'}
    sorterFetch(pagination, filters, sorter){
      const t = this
      t.setState({
        page_num:+pagination.current,
      }, ()=>{
        t.send_table()
      })
      if(sorter.field){
        let sort_key = sorter.field
        let sort_type = 'desc';
        if(sorter.order === 'descend') {
          sort_type = 'desc';
        }
        if(sorter.order === 'ascend') {
          sort_type = 'asc'
        }
        t.setState({
          sort_key:sort_key,
          sort_type:sort_type,
          loading:true
          },function () {
           t.sorter_send()
        })
      }
    }
    sorter_send(){
        const t = this;
        let sortkeyif = {
          start_time: t.state.table_start_time,
          end_time: t.state.table_end_time,
          page_size: 1000,
          page_num: 1,
          sort_key:t.state.sort_key,
          sort_type:t.state.sort_type
        }
        DB.Analyse.getInvitePageSingle(sortkeyif)
        .then(result=>{
            let dt = result;
            if(dt.page_size>15){
              t.setState({
                  tableData:dt.list,
                  page_size:15,
                  total:dt.total,
              })
            }
            else {
              t.setState({
                  tableData:dt.list,
                  page_size:dt.page_size,
                  total:dt.total,
              })
            }
        })
    }
    //这个函数是表格中要用的时间范围选择函数,避免和图表当中的onChange冲突,就取了一个不一样的名字
    // date:第一个参数,必须得传,是个数组,第一项是开始时间,第二项是结束时间
    // dateString:在这个函数中没有特别用处,但必须得传进来,组件要求
    onChangeRan(date, dateString){
        this.setState({
            table_start_time:moment(date[0]).valueOf(),
            table_end_time:moment(date[1]).valueOf(),
            page_num:1
        }, ()=>{
            this.send_table()
        })
    }

    //禁止选择未来时间
    // 返回一个日期并且这个日期不能大于今天的日期
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    //发起数据请求
    //获取昨天累计的数据
    // 发起请求的时候带上start_time和end_time,且start_time和end_time都是昨的日期,
    // 当请求成功的时候返回结果result,该result是一个对象,我们要拿到的是result中的list,
    // 所以声明一个list = result.list,list是一个数组,可能有很多数据,但是这里我们只是请求了昨天
    // 的数据,所以只有一条或者为空,再声明一个对象obj,并把list的第一条数据 赋值给obj
    // 最后用this.setState({zhibiaoData:obj})改变zhibiaoData
    send_index() {
        const t = this;
        DB.Analyse.getInvitePageSingle({
            start_time:moment().startOf('day').subtract(1, 'days').valueOf(),
            end_time:moment().startOf('day').subtract(1, 'days').valueOf(),
        }).then(result=>{
              //解构赋值,将请求到的结果(result)当中的list赋值给新声明的list
              let {list = []} = result
              let obj
              if (list && list.length) {
                  obj = list[0] || {}
              }
              t.setState({zhibiaoData: obj})
        })
    }
    //获取到echarts折线图要用的数据
    // 请求参数有开始时间:start_time,结束时间:end_time
    // page_num:1,因为图表要展示全部的数据,所以不存在分页的情况,所以page_num = 1
    // pageSize:1000:因为要展示全部的数据,所以就设置为一个比较大的值,这里设置为1000就可以了
    // 当请求成功的时候,返回结果result,该result是一个对象,我们要拿到的是result中的list,
    // 所以声明一个list = result.list,list是一个数组,可能有很多数据,但是我们只要将第一条的数据赋值给obj就可以了
    // 最后用this.setState({allData:dt.list,handlData:handlData})
    send_echarts() {
      const t = this;
      DB.Analyse.getInvitePageSingle({
          start_time:t.state.echarts_start_time,
          end_time:t.state.echarts_end_time,
          page_num:1,
          page_size:1000
      }).then(result=>{
          let dt = result;
          // console.log(dt.list);
          let handlData = []
          let {list=[]} = result
          if(list && list.length){
              let obj = list[0] || {}
              TITLEMAP.map((title, index) =>{
                handlData.push({
                  title:title.value,
                  key:title.key,
                  val:obj[title.key]
                })
              })
          }
          t.setState({
              allData:dt.list,
              handlData:handlData
          })
      })
    }
    //获取到tabel表格要用的数据
    // 请求参数有开始时间:start_time,结束时间:end_time
    // page_num:t.state.,因为图表要展示全部的数据,所以不存在分页的情况,所以page_num = 1
    // pageSize:1000:因为要展示全部的数据,所以就设置为一个比较大的值,这里设置为1000就可以了
    // 当请求成功的时候,返回结果result,该result是一个对象,我们要拿到的是result中的list,
    // 所以声明一个list = result.list,list是一个数组,可能有很多数据,但是我们只要将第一条的数据赋值给obj就可以了
    // 最后用this.setState({allData:dt.list,handlData:handlData})
    send_table() {
      const t = this;
      DB.Analyse.getInvitePageSingle({
          start_time:t.state.table_start_time,
          end_time:t.state.table_end_time,
          page_num:t.state.page_num
      }).then(result=>{
          let dt = result;
          // console.log(dt.list);
          t.setState({
              tableData:dt.list,
              page_size:dt.page_size,
              total:dt.total,
          })

      })
    }
    render() {
        let t = this
        //因为只有表格有个日期字段,所以日期字段做个特殊处理,即先将日期放在columns数组里面
        const columns = [{
          title:'日期',
          dataIndex:'date',
          key:'date',
          //date本身是个字符串,所以日期要排序的话只能根据data_time的大小来排序
          sorter:(a, b) => {
              return a.data_time-b.data_time
          },
          fixed:'left',
        }]
        TITLEMAP.map((title, index) =>{
          let tem = {
            title:title.value,
            dataIndex:title.key,
            key:title.key,
            sorter:true
          }
          // console.log(tem);
          if(title.value !== 'date') {
            tem.sorter= (a, b) => {
                return a[title.k]-b[title.k]
            };
          }
          columns.push(tem)
        })
        let temData = this.state.tableData.map((item,index)=>{
            item.key = index
            return item
        })
        // console.log(temData);
        return (
            <div className='pagesingle-wrap'>
                <div className="ps">邀请卡页面单日数据分析</div>
                <div className="pagesingle-content">
          					<div>
                        <DataIndex title={TITLEMAP} list={this.state.zhibiaoData} indexName={this.state.indexName}/>
                    </div>
                    <div>
                      <div>
                          <Tabs onChoose={this.choosed} choosed={this.state.tab} list={this.state.handlData}/>
                      </div>
                      <div className="ztfx bd_ccc">
                          <div className="ztfx-t">

                              <div className='dateselector-p'>
                                  <Select defaultValue="最近七天"
                                      style={{ width: '120px'}}
                                      size = 'large'
                                      onSelect = {this.onSelect.bind(this)}
                                      >
                                       <Option value="7">最近七天</Option>
                                       <Option value="15">最近十五天</Option>
                                       <Option value="30">最近三十天</Option>
                                   </Select>
                              </div>
                              <div className="datepicker-p">
                                  <RangePicker
                                      size = 'large'
                                      value={[moment(this.state.echarts_start_time),
                                        moment(this.state.echarts_end_time)]}
                                      format={dateFormat}
                                      onChange={this.onChange.bind(this)}
                                      disabledDate={this.disabledDate.bind(this)}
                                  />
                              </div>
                          </div>
                          <div className="ztfx-b">
                              <TotalAndUserEchart data={this.state}/>
                          </div>
                      </div>
                    </div>
                    <div>
                      <div className="yhfx">
                          <div className="yhfx bd_ccc">
                              <div className="yhfx-t">
                                  <div onClick={this.download} className="yhfx-download">
                                      下载表格
                                  </div>
                                  <div className="datepicker-u">
                                      <RangePicker
                                          size = 'large'
                                          value={[moment(this.state.table_start_time),
                                            moment(this.state.table_end_time)]}
                                          format={dateFormat}
                                          onChange={this.onChangeRan.bind(this)}
                                          disabledDate={this.disabledDate.bind(this)}
                                      />
                                  </div>
                              </div>
                              <div className="yhfc-b">
                                  <Table
                                      columns={columns}
                                      dataSource={temData}
                                      onChange={this.sorterFetch.bind(this)}
                                      pagination={{
                                        showTotal:(total, range) => `共 ${total} 条`,
                                        pageSize:this.state.page_size,
                                        current:this.state.page_num,
                                        total:this.state.total,
                                        showQuickJumper:true
                                      }}
                                      scroll={{ x:'150%'}}
                                  />
                              </div>
                          </div>
                      </div>
                    </div>
          			</div>
            </div>
        )
    }
}
export default InvPageSingle
