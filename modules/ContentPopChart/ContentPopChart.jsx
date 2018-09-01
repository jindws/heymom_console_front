import React, {Component} from 'react'
// import Reflux from 'reflux'
import echarts from 'echarts/lib/echarts'
// 引入柱状图
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
// 引入提示框和标题组件
import 'echarts/lib/component/legend'
import moment from 'moment'
import { Radio,Card,Select,DatePicker } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { RangePicker } = DatePicker;
import _map from 'lodash/map'


class ContentPopChart extends Component {
    constructor(props){
        super(props)
        this.state = {
            chooseType:this.props.dataFormat[0],
            query:{
                // 开始时间
                start_time:moment().subtract(7, 'days').valueOf(),
                // 结束时间
                end_time:moment().subtract(1, 'days').valueOf(),
                // 日期
                day:moment().subtract(1,'d').format('YYYY-MM-DD'),
            },
            timeArr:[],
            dataArr:[],
        }
    }

    componentDidMount(){
        this.handlData(this.props.totalData)
    }

    componentWillReceiveProps(nextProps){
        this.handlData(nextProps.totalData)
    }

    handlData =(data)=> {
        if(!data) return []

        let timeArr = _map(data,'day').reverse()
        let dataArr = []

        // 区分不同图表
        let type = this.props.type || ''
        switch (type) {
            case 'content_total':
                this.state.chooseType.en.map((item,index)=>{
                    if(data && data.length === 0) return

                    dataArr.push({
                        name:this.state.chooseType.ch[index],
                        type:'line',
                        // stack: '总量',
                        areaStyle:{
                            normal:{
                                opacity:0.6
                            },
                        },
                        lineStyle:{
                            normal:{
                                width:1
                            }
                        },
                        itemStyle:{
                            normal:{
                                borderWidth:1,
                            }
                        },
                        smooth: true,
                        symbol: 'circle',
                        sampling: 'average',
                        symbolSize: 5,
                        data:_map(data,item).reverse()
                    })
                })
                break;
            case 'user_pop':
            this.props.dataFormat.map(item=>{
                if(data && data.length === 0) return

                dataArr.push({
                    name:item.title,
                    type:'line',
                    stack: '总量',
                    areaStyle:{
                        normal:{
                            opacity:0.6
                        },
                    },
                    lineStyle:{
                        normal:{
                            width:1
                        }
                    },
                    itemStyle:{
                        normal:{
                            borderWidth:1,
                        }
                    },
                    smooth: true,
                    symbol: 'circle',
                    sampling: 'average',
                    symbolSize: 5,
                    data:_map(data,item.en).reverse()
                })
            })
                break;
            default:

        }

        this.setState({
            timeArr,
            dataArr
        },()=>{
            this.drawCharts()
        })
    }

    drawCharts = () =>{
        const t = this;
        const {
            type
        } = this.props
        let formatter
        if(type === 'user_pop') {
            formatter = '{b0}<br />{a10}: {c10}<br />{a9}: {c9}<br />{a8}: {c8}<br />{a7}: {c7}<br />{a6}: {c6}<br />{a5}: {c5}<br />{a4}: {c4}<br />{a3}: {c3}<br />{a2}: {c2}<br />{a1}: {c1}<br />{a0}: {c0}'
        }else if(type === 'content_total') {
            // formatter = '{a1}: {c1}<br />{a0}: {c0}'
        }

        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('chart-ud'));
        // 绘制图表
        myChart.setOption({
            legend: {
                data:this.state.chooseType.ch
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter,
            },
            // color:['#03a9f4','#18b7ff', '#2fbaf9', '#46c2fb', '#57c2f3','#6bcefb',  '#83d7fd', '#83d7fd','#abdff7', '#c5ebfd', '#d8f2ff'],
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : t.state.timeArr
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : t.state.dataArr
        });
    }

    disabledDate(current) {
      //禁止选择未来时间
        return current && current.valueOf() > Date.now();
    }

    // 最近几天的改变时触发
    changeDate = (date) => {
        // 如果是数组,说明不是用户分析表-小时调用本组件
        if(Object.prototype.toString.call(date) === '[object Array]') {
            this.setState({
                query:{
                    ...this.state.query,
                    start_time:moment(date[0]).valueOf(),
                    end_time:moment(date[1]).valueOf(),
                }
            }, ()=>{
                this.props.getTotalData(this.state.query)
            })
        }else{
            this.setState({
                query:{
                    ...this.state.query,
                    start_time:moment().subtract(date, 'days').valueOf(),
                    end_time:moment().subtract(1,'d').valueOf(),
                }
            }, ()=>{
                this.props.getTotalData(this.state.query)
            })
        }
    }

    // 时间搜索框,如果是用户分析表-日期使用，搜索框按时间段搜索，如果是用户分析表-小时使用，搜索框按天搜索
    SearchBar() {
        return [
            <Select
                key='1'
                defaultValue="7"
                size='large'
                onChange={this.changeDate}
                style={{ width: 120 }}>
                <Option value="7">最近七天</Option>
                <Option value="15">最近十五天</Option>
                <Option value="30">最近三十天</Option>
            </Select>,
            <RangePicker
                allowClear={false}
                value={[moment(this.state.query.start_time),
                  moment(this.state.query.end_time)]}
                onChange={this.changeDate}
                style={{marginLeft:'20px'}}
                size='large'
                disabledDate={this.disabledDate.bind(this)}
                key='2' />
        ]
    }

    render() {
        return <div className="chart-block">

            {/* 选择器 */}
            {
                !this.props.hideTab && <RadioGroup
                    onChange={e=>{
                        const {
                            chooseType,
                            value
                        } = e.target
                        this.setState({
                            chooseType,
                        },()=>{
                            this.props.getTotalData(this.state.query)
                        })
                    }}
                    defaultValue={this.state.chooseType.title}
                    size="large"
                    style={{margin:'0 0 30px'}} >
                    {this.props.dataFormat && this.props.dataFormat.map((item,index)=>{
                        return !item.hide && <RadioButton
                            key={index}
                            chooseType={item}
                            value={item.title}>
                            {item.title}
                        </RadioButton>
                    })}
                </RadioGroup>
            }

            {/* 图表 */}
            <Card title={this.SearchBar()}>
                <div style={{height:450}} id='chart-ud'></div>
            </Card>
        </div>
    }
}

export default ContentPopChart
