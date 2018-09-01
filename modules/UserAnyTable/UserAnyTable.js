import React,{Component} from 'react'
import moment from 'moment'
import DB from '@DB'
import { DatePicker,Pagination,Table} from 'antd';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import JSON2EXCEL from '@modules/Export'
import './UserAnyTable.css'
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const COLUMNS = {
    date:'日期',
    lei_ji_yong_hu:'累计用户数',
    xin_zeng_yon_ghu:'新增用户数',
    ri_huo_ren_shu:'日活用户数',
    zhou_huo_ren_shu: '周活用户数',
    bao_ming_ci_shu:'成功订单数',
    ting_ke_ren_shu:'听课用户数'
}
class UserAnyTable extends Component {
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
        }
    }

    download = () => {
        const t = this;
        DB.Analyse.getTotal({
          start_time:t.state.start_time,
          end_time:t.state.end_time,
          page_size:1000,
        }).then(result =>{
          const dt = result;
          t.setState({
            allData:dt.list
          }, ()=>{
            let temData = this.state.allData.map((item,index)=>{
                return {
                    date:item.date,
                    lei_ji_yong_hu:item.lei_ji_yong_hu||'0',
                    xin_zeng_yon_ghu:item.xin_zeng_yon_ghu||'0',
                    ri_huo_ren_shu:item.ri_huo_ren_shu||'0',
                    zhou_huo_ren_shu: item.zhou_huo_ren_shu||'0',
                    bao_ming_ci_shu:item.bao_ming_ci_shu||'0',
                    ting_ke_ren_shu:item.ting_ke_ren_shu||'0',
                }
            })
            JSON2EXCEL(temData,'用户分析导出列表',['日期','累计用户数','新增用户数','日活用户数','周活用户数','成功订单数','听课用户数'])
          })
        })
    }

    componentDidMount(){
        this.send()
    }

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

    sorter_send(){
        const t = this;
        let sortkeyif = {
        start_time: t.state.start_time,
        end_time: t.state.end_time,
        page_size: 1000,
        page_num: 1,
        sort_key:t.state.sort_key,
        }
        DB.Analyse.getTotal(sortkeyif)
        .then(result=>{
            let dt = result;
            if(dt.page_size>15){
              t.setState({
                  allData:dt.list,
                  page_size:15,
                  total:dt.total,
              })
            }
            else {
              t.setState({
                  allData:dt.list,
                  page_size:dt.page_size,
                  total:dt.total,
              })
            }

        })
    }

    onChangeRan(date, dateString){
        this.setState({
            start_time:moment(date[0]).valueOf(),
            end_time:moment(date[1]).valueOf(),
            page_num:1
        }, ()=>{
            this.send()
        })
    }
    disabledDate(current) {
      //禁止选择未来时间
        return current && current.valueOf() > Date.now();
    }
    send(){
        const t = this;
        DB.Analyse.getTotal({
            start_time:t.state.start_time,
            end_time:t.state.end_time,
            page_num:t.state.page_num
        }).then(result=>{
            let dt = result;
            t.setState({
                allData:dt.list,
                page_size:dt.page_size,
                total:dt.total,
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
                sorter:true
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
          <div className="yhfx">
              <div className="yhfx bd_ccc">
                  <div className="yhfx-t">
                      <div onClick={this.download} className="yhfx-download">
                          下载表格
                      </div>
                      <div className="datepicker-u">
                          <RangePicker
                              size = 'large'
                              value={[moment(this.state.start_time),
                                moment(this.state.end_time)]}
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
                          scroll={{ x:'120%'}}
                      />
                  </div>
              </div>
          </div>
        )
      }
    }
export default UserAnyTable
