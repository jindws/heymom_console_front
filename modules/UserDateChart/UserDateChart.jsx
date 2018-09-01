import React, {Component} from 'react'
// import Reflux from 'reflux'
import echarts from 'echarts/lib/echarts'
// 引入柱状图
import 'echarts/lib/chart/line'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import moment from 'moment'
import { Radio,Card,Select,DatePicker,Input } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
import DB from '@DB'


class ChartBlock extends Component {
    constructor(props){
        super(props)
        this.state = {
            // 用户选中的维度
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
            // 分类列表
            categoryList:[],
            // 频道列表
            channelList:[],
        }
        // 获取分类列表
        DB.Category.list()
        .then(data=>{
            this.setState({
                categoryList:[...data.list,{id:'none',name:'无分类'}]
            })
        })

        // 获取频道列表
        if(this.props.searchType === 'home_channel') {
            DB.Channel.list().then(data=>{
                this.setState({
                  channelList:data
                })
            })
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

        let timeArr = []
        let dataArr = []
        let chooseType = this.state.chooseType
        data.map((item,index)=>{
            if(this.props.xName === 'hour') {
                timeArr.push(item[(this.props.xName || 'day')])
                dataArr.push(item[chooseType.en])
            }else{
                timeArr.unshift(item[(this.props.xName || 'day')])
                dataArr.unshift(item[chooseType.en])
            }

        })
        this.setState({
            timeArr,
            dataArr
        },()=>{
            this.drawCharts()
        })
    }

    drawCharts = () =>{
        const t = this;
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('chart-ud'));
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'axis'
            },
            legend:{
                show:true,
                data:[t.state.chooseType.title || '暂无'],
                bottom:10,
                borderColor:'#56c754'
            },
            textStyle:{
                color:'#bbbbbb'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                nameGap:10,
                data: this.state.timeArr,
                axisLine:{
                    show:true,
                    lineStyle:{
                      color:'#c6c6c6',
                      width:4,
                    }
                },
            },
            yAxis: {
                type: 'value',
                boundaryGap: ['0', '10%'],
                axisLabel: {
                    formatter: '{value} '
                },
                axisLine:{
                    show:false,
                },
            },
            series: [
                {
                  symbol:'circle',
                  name:[t.state.chooseType.title || '暂无'],
                  type:'line',
                  data:this.state.dataArr,
                  areaStyle:{
                      normal:{
                          color:'#f9f9f9',
                          opacity:0.7
                      },
                  },
                    lineStyle:{
                        normal:{
                            color:'#56c754',
                            width:3
                        }
                    },
                    itemStyle:{
                        normal:{
                            borderWidth:4,
                            borderColor:'#56c754',
                            color:'#56c754'
                        }
                    },
                }
            ]
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

    // 更改搜索条件，例如更改分类和推荐方式
    changeType = (type, value) => {

        this.setState({
            query:{
                ...this.state.query,
                [type]:value,
            }
        }, ()=>{
            this.props.getTotalData(this.state.query)
        })

    }

    // 时间搜索框,如果是用户分析表-日期使用，搜索框按时间段搜索，如果是用户分析表-小时使用，搜索框按天搜索
    SearchBar() {
        const type = this.props.searchType || 'days'
        if(type === 'days') {
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
        }else if(type === 'day'){
            return (
                <DatePicker
                    allowClear={false}
                    value={moment(this.state.query.day)}
                    onChange={(date, dateString)=>{
                        this.setState({
                            query:{
                                ...this.state.query,
                                day:dateString
                            }
                        },()=>{
                            this.props.getTotalData({
                                day:dateString
                            })
                        })
                    }}
                    disabledDate={this.disabledDate.bind(this)}
                    />
            )
        }else if(type === 'home_category' || type === 'home_channel') {
            // 首页内容推荐-分类
            return [
                <Select
                    key='1'
                    defaultValue="7"
                    onChange={this.changeDate}
                    style={{ width: 120 }}>
                    <Option value="7">最近七天</Option>
                    <Option value="15">最近十五天</Option>
                    <Option value="30">最近三十天</Option>
                </Select>,
                <InputGroup key='2' style={{float:'right',width:'200px'}} compact>
                    <Select
                        mode="combobox"
                        defaultValue="推荐方式"
                        disabled
                        style={{ width: 65,color:'#4c4c4c' }}>
                    </Select>
                    <Select
                        defaultValue="算法"
                        onChange={this.changeType.bind(this,'twitte_way')}
                        style={{ width: 120 }}>
                        <Option value="规则">规则</Option>
                        <Option value="算法">算法</Option>
                    </Select>
                </InputGroup>,
                <InputGroup key='3' style={{float:'right',width:'200px'}} compact>
                    {
                        type === 'home_category' &&
                        [<Select
                            key='1'
                            mode="combobox"
                            defaultValue="分类"
                            disabled
                            style={{ width: 40,color:'#4c4c4c' }}>
                        </Select>,
                        <Select
                            key='2'
                            defaultValue="理念"
                            onChange={this.changeType.bind(this,'category')}
                            style={{ width: 120 }}>
                            {
                                this.state.categoryList.map((item,index)=>{
                                    return <Option
                                        key={index}
                                        value={item.name}>{item.name}</Option>
                                })
                            }
                        </Select>]
                    }
                    {
                        type === 'home_channel' &&
                        [<Select
                            key='1'
                            mode="combobox"
                            defaultValue="频道"
                            disabled
                            style={{ width: 40,color:'#4c4c4c' }}>
                        </Select>,
                        <Select
                            key='2'
                            defaultValue="推荐"
                            onChange={this.changeType.bind(this,'channel')}
                            style={{ width: 120 }}>
                            {
                                this.state.channelList.map(item=>{
                                    return <Option
                                        key={item._id}
                                        value={item.name}>{item.name}</Option>
                                })
                            }
                        </Select>]
                    }
                </InputGroup>,
                <RangePicker
                    allowClear={false}
                    value={[moment(this.state.query.start_time),
                      moment(this.state.query.end_time)]}
                    onChange={this.changeDate}
                    style={{marginLeft:'20px'}}
                    disabledDate={this.disabledDate.bind(this)}
                    key='4' />
            ]
        }else if(type === 'content_single') {
            // 内容单篇分析的搜索框
            return [
                <InputGroup key='3' style={{float:'right',width:'200px'}} compact>
                    <Select
                        mode="combobox"
                        defaultValue="分类"
                        disabled
                        style={{ width: 40,color:'#4c4c4c' }}>
                    </Select>
                    <Select
                        defaultValue="理念"
                        onChange={this.changeType.bind(this,'category')}
                        style={{ width: 120 }}>
                        {
                            this.state.categoryList.map(item=>{
                                return <Option
                                    key={item._id}
                                    value={item.name}>{item.name}</Option>
                            })
                        }
                    </Select>
                </InputGroup>,
                <DatePicker
                    allowClear={false}
                    value={moment(this.state.query.day)}
                    allowClear={false}
                    key='4'
                    onChange={(date, dateString)=>{
                        this.setState({
                            query:{
                                ...this.state.query,
                                day:dateString
                            }
                        },()=>{
                            let query = Object.assign({},this.state.query)
                            this.props.getTotalData(query)
                        })

                    }}
                    disabledDate={this.disabledDate.bind(this)}
                    />
            ]
        }


    }

    render() {
        return <div className="chart-block">
            {/* 选择器 */}
            {
                !this.props.hideTab && <RadioGroup
                    onChange={e=>{
                        const {
                            title,
                            value
                        } = e.target
                        this.setState({
                            chooseType:{
                                title,
                                en:value
                            }
                        },()=>{
                            this.props.getTotalData(this.state.query)
                        })
                    }}
                    defaultValue={this.state.chooseType.en}
                    size="large"
                    style={{margin:'0 0 30px'}} >
                    {this.props.dataFormat && this.props.dataFormat.map((item,index)=>{
                        return <RadioButton
                            title={item.title}
                            key={index}
                            value={item.en}>
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

export default ChartBlock
