/**
 * 2017-08-12
 * @author yeqinglong
 * 课程汇总分析Echarts模块
 */
import React,{Component} from 'react'
import Tabs from '../../modules/Tabs'
import TotalAndUserEchart from '../../modules/TotalAndUserEchart'
import { DatePicker,Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import DB from '@DB'
import './CourseTotalEcharts.css'

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
//Echarts选项菜单
const TITLEMAP = {
  yu_bao_ming_ci_shu:'发起报名次数',
  bao_ming_ci_shu:'成功订单数',
  ting_ke_ren_shu:'听课用户数',
  ting_ke_ci_shu: '听课次数',
  xiang_qing_pv: '浏览次数',
  xiang_qing_uv: '浏览人数',
  shou_ru:'收入'
}
class CourseTotalEcharts extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            host: '',
            //默认为最近7天
            start_time:moment().subtract(7, 'days').valueOf(),
            end_time:moment().valueOf(),
            //默认选中项为预报名次数
            tab:{
              key:'yu_bao_ming_ci_shu',
              title:'发起报名次数'
            },
            allData:[],
            handlData:[]
        }
    }
    componentDidMount(){
      this.send()
    }
    choosed=(key, title)=>{
      this.setState({
          tab:{
            key:key,
            title:title
          }
      }, ()=>{
        this.send()
      })
    }
    //禁止选择未来时间
    disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }
    onChange(date, dateString) {
        this.setState({
            start_time:moment(date[0]).valueOf(),
            end_time:moment(date[1]).valueOf(),
        }, ()=>{
            this.send()
        })
    }
    onSelect(value) {
        this.setState({
            start_time:moment().subtract(value, 'days').valueOf(),
            end_time:moment().valueOf(),
        }, ()=>{
            this.send()
        })
    }
    send() {
      const t = this;
      DB.Analyse.getCourseTotal({
          start_time:t.state.start_time,
          end_time:t.state.end_time,
          //page_size尽量大以保证图表显示数据完全
          page_size:1000,
          page_num:1
      }).then(result=>{
          let dt = result;
          let handlData = []
          let {list=[]} = result
          if(list && list.length){
              let obj = list[0]
              for(let k in TITLEMAP){
                  handlData.push({
                      title: TITLEMAP[k],
                      key:k,
                      val: obj[k]
                  })
              }
          }
          t.setState({
                allData:dt.list,
                handlData:handlData
          })
      })
    }
    render() {
        return(
            <div className="CourseTotalEcharts">
              <div>
                <Tabs onChoose={this.choosed}
                      choosed={this.state.tab}
                      list={this.state.handlData}/>
              </div>
              <div className="ztfx bd_ccc">
                <div className="ztfx-t">
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
                <div className="ztfx-b">
                  <TotalAndUserEchart data={this.state}/>
                </div>
              </div>
            </div>
        )
    }
}
export default CourseTotalEcharts
