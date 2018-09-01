import React,{Component} from 'react'
import Tabs from '../../modules/Tabs'
import TotalAndUserEchart from '../../modules/TotalAndUserEchart'
import { DatePicker,Select } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import DB from '@DB'
import './TotalAnyEcharts.css'

const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;
const TITLEMAP = {
    lei_ji_yong_hu: '累计用户数',
    xin_zeng_yon_ghu: '新增用户数',
    zhou_huo_ren_shu: '周活用户数',
    bao_ming_ci_shu: '成功订单数',
    shou_ru: '收入'
}
class TotalAnyEcharts extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            host: '',
            start_time:moment().subtract(7, 'days').valueOf(),
            end_time:moment().valueOf(),
            tab:{
              key:'lei_ji_yong_hu',
              title:'累计用户数',
            },
            allData:[],
            handlData:[]
        }
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
    disabledDate(current) {
      //禁止选择未来时间
        return current && current.valueOf() > Date.now();
    }
    send() {
        const t = this;
        DB.Analyse.getTotal({
            start_time:t.state.start_time,
            end_time:t.state.end_time,
            page_num:1,
            page_size:1000
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
            <div>
                <div>
                    <Tabs onChoose={this.choosed} choosed={this.state.tab} list={this.state.handlData}/>
                </div>
                <div className="ztfx bd_ccc">
                    <div className="ztfx-t">
                        <div className='dateselector'>
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
                        <div className="datepicker">
                            <RangePicker
                                size = 'large'
                                value={[moment(this.state.start_time),
                                  moment(this.state.end_time)]}
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
export default TotalAnyEcharts
