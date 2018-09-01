/**
 * 2017-08-12
 * @author yeqinglong
 * 课程汇总分析表格
 */
import React,{Component} from 'react'
import moment from 'moment'
import DB from '@DB'
import { DatePicker,Pagination,Table, Icon} from 'antd';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import JSON2EXCEL from '@modules/Export'
import './CourseTotalTable.css'

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

//表格表头选项
const COLUMNS = {
  date: '日期',
  yu_bao_ming_ci_shu:'发起报名次数',
  bao_ming_ci_shu:'成功订单数',
  ting_ke_ren_shu:'听课用户数',
  ting_ke_ci_shu: '听课次数',
  xiang_qing_pv: '浏览次数',
  xiang_qing_uv: '浏览人数',
  shou_ru:'收入'
}
class CourseTotalTable extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            allData:[],
            host: '',
            start_time:moment().subtract(7, 'days').valueOf(),
            end_time:moment().valueOf(),
            page_num:1,
            page_size:15,
            total:0,
            download_arr:[],
            columns:[],
            dataSource:[]
        }
    }
    //点击下载表格时重新发送请求，下载所选时间段内的数据
    download = () => {
        this.download_send()
    }
    componentDidMount(){
        this.send()
    }
    //自主选择时间段时，重发请求
    onChangeRan(date, dateString){
        this.setState({
            start_time:moment(date[0]).valueOf(),
            end_time:moment(date[1]).valueOf(),
            page_num:1,
        }, ()=>{
            this.send()
        })
    }
    //点击排序时重新发送请求，并且排序数据为所选时间段内所有数据
    sorterFetch(pagination, filters, sorter){
      const t = this
      t.setState({
        page_num:+pagination.current,
      }, ()=>{
        t.send()
      })
      if(sorter.field){
        t.setState({
          sort_key:(sorter.field===undefined?'':sorter.field),
          loading:true
          },function () {
           t.sorter_send()
        })
      }
    }
    //禁止选择未来时间
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    send(){
        const t = this;
        DB.Analyse.getCourseTotal({
            start_time:t.state.start_time,
            end_time:t.state.end_time,
            page_num:t.state.page_num,
        }).then(result=>{
            let dt = result;
            let dtlistarr = [];
            for(let i=0 ; i<dt.list.length ; i++){
              //收入除以100后四舍五入保留两位小数
                dt.list[i].shou_ru=(dt.list[i].shou_ru/100).toFixed(2)
                dtlistarr.push(dt.list[i])
            }
            t.setState({
                allData:dtlistarr,
                page_size:dt.page_size,
                total:dt.total,
            })
        })
    }

    sorter_send(){
        const t = this;
        let sortkeyif = {
          start_time: t.state.start_time,
          end_time: t.state.end_time,
          page_size: 1000,
          page_num: 1,
          //添加请求条件 sort_key
          sort_key:t.state.sort_key,
        }
        DB.Analyse.getCourseTotal(sortkeyif)
        .then(result=>{
            let dt = result;
            let dtlistarr = [];
            for(let i=0 ; i<dt.list.length ; i++){
              //收入除以100后四舍五入保留两位小数
                dt.list[i].shou_ru=(dt.list[i].shou_ru/100).toFixed(2)
                dtlistarr.push(dt.list[i])
            }
            //如果数据条数超过15条，则第一页最多仅显示15条，出现分页
            if(dt.page_size>15){
              t.setState({
                  allData:dtlistarr,
                  page_size:15,
                  total:dt.total,
              })
            }
            else {
              t.setState({
                  allData:dtlistarr,
                  page_size:dt.page_size,
                  total:dt.total,
              })
            }
        })
    }

    download_send(){
        const t = this;
        DB.Analyse.getCourseTotal({
            start_time:t.state.start_time,
            end_time:t.state.end_time,
            page_size:1000
        }).then(result=>{
            let dt_download = result;
            let download_arr=[];
            for(let i=0 ; i<dt_download.list.length ; i++){
              //收入除以100后四舍五入保留两位小数
                dt_download.list[i].shou_ru=(dt_download.list[i].shou_ru/100).toFixed(2)
                download_arr.push(dt_download.list[i])
            }
            t.setState({
                download_arr:download_arr,
            },function download_data () {
              let temData = t.state.download_arr.map((item,index)=>{
                  return {
                      date:item.date,
                      yu_bao_ming_ci_shu:item.yu_bao_ming_ci_shu||'0',
                      bao_ming_ci_shu:item.bao_ming_ci_shu||'0',
                      ting_ke_ren_shu:item.ting_ke_ren_shu||'0',
                      ting_ke_ci_shu:item.ting_ke_ci_shu||'0',
                      xiang_qing_pv: item.xiang_qing_pv||'0',
                      xiang_qing_uv:item.xiang_qing_uv||'0',
                      shou_ru:item.shou_ru||'0',
                  }
              })
              JSON2EXCEL(temData,'课程汇总分析导出列表',['日期','发起报名次数','成功订单数','听课用户数','听课次数','浏览次数','浏览人数','收入'])
            })
        })
    }
    render() {
      const columns = []
      for(let k in COLUMNS){
          let tem = {
              title: COLUMNS[k],
              dataIndex:k,
              key:k,
              sorter:true,
          }
          if(k === 'date') {
              tem.fixed = 'left'
              tem.sorter= (a, b) => {
                  return a.data_time-b.data_time
              };
          }
          if(k !== 'date') {
              tem.sorter= (a, b) => {
                  return a[k]-b[k]
              };
          }
          columns.push(tem)
      }

      let temData = this.state.allData.map((item,index)=>{
          item.key = index
          return item
      })
        return(
          <div className="CourseTotalTable">
            <div className="ztfc">
              <div className="ztfx bd_ccc">
                <div className="ztfx-t">
                  <div onClick={this.download} className="ztfx-download">下载表格</div>
                  <div className="datepicker-t">
                    <RangePicker
                      size = 'large'
                      value={[moment(this.state.start_time),moment(this.state.end_time)]}
                      format={dateFormat}
                      onChange={this.onChangeRan.bind(this)}
                      disabledDate={this.disabledDate.bind(this)}/>
                  </div>
                </div>
                <div className="ztfx-b">
                  <Table
                    on
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
                    scroll={{ x:'120%'}}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }
}
export default CourseTotalTable
