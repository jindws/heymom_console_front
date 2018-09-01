import React, {Component} from 'react'
import YesterdayNum from '@modules/YesterdayNum'
// 图表区块
import UserDateChart from '@modules/UserDateChart'
// 表格区块
import UserDateTable from '@modules/UserDateTable'
import { Radio,Card,notification } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import DB from '@DB'
import moment from 'moment'



class CommonTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 昨日关键指标的数据
            yesterdayData: this.props.dataFormat,
            // 图表数据
            totalData:[],
            // 表格数据
            tableData:[],
        }
        // 获取昨日关键指标
        this.props.showYesterday && this.getYesterdayData()
        // 获取图表所需数据
        this.getTotalData({
            start_time:moment().subtract(7,'d').valueOf(),
            end_time:moment().subtract(1,'d').valueOf()
        })
        // 获取表格所需数据
        this.getTableData({
            // 日期
            day:moment().subtract(1,'d').format('YYYY-MM-DD'),
        })

    }

    // 获取昨日关键指标
    getYesterdayData = (query={}) => {
        DB.Analyse[this.props.tableRequest]({
            start_time:moment().subtract(1,'d').valueOf(),
            end_time:moment().valueOf(),
            ...query
        }).then(res=>{
            if(res.err) {
                notification.error({
                    message: '警告',
                    description: '数据获取失败',
                })
            }else{
                let dt = (res.list.length !== 0) ? res.list[0] : {}
                let yesterdayData = this.state.yesterdayData
                for(let item of yesterdayData) {
                    item.num = dt[item.en]
                }
                this.setState({
                    yesterdayData,
                })
            }
        })
    }

    // 获取图表所需数据
    getTotalData = (query = {}) => {
        DB.Analyse[this.props.chartRequest](query).then(res=>{
            if(res.err) {
                notification.error({
                    message: '警告',
                    description: '数据获取失败',
                })
            }else{
                this.setState({
                    totalData:res.list || []
                })
            }
        })
    }

    // 获取表格所需数据
    getTableData = (query = {}) =>{
        DB.Analyse[this.props.tableRequest](query).then(res=>{
            if(res.err) {
                notification.error({
                    message: '警告',
                    description: '数据获取失败',
                })
            }else{
                this.setState({
                    tableData:res || {}
                })
            }
        })
    }

    render() {
        return <div className="chart">
            <div className="chart-title">
                {this.props.title || ''}
            </div>
            <div className="chart-content">
                {/* 昨日关键指标 */}
                {
                    this.props.showYesterday && <YesterdayNum
                    // 需要隐藏不显示的指标
                    hideArr={[]}
                    data={this.state.yesterdayData || []}/>}

                {/* 图表部分 */}
                <UserDateChart
                    // 图表x轴的统计维度，例如用户分析表-日期是按 天 统计，所以写day;用户分析表-小时是按 小时 统计，写hour;
                    xName='day'
                    // 搜索条件，用户分析表-日期是按 时间段 搜索，所以写days;用户分析表-小时是按 天 搜索，写day;内容分析表-总体需要时间段和搜索条件，所以home_total;
                    searchType='days'
                    getTotalData={this.getTotalData}
                    // 图表所需的总数据
                    totalData={this.state.totalData}
                    // 需要统计的数据维度，用于初始化图表选择的维度
                    dataFormat={this.props.dataFormat || []}>

                </UserDateChart>

                {/* 表格部分 */}
                <UserDateTable
                    // 表格调用的模块->相关推荐分析
                    type={this.props.type}
                    // 表格的统计维度，例如用户分析表-日期是按 天 统计，所以写day;用户分析表-小时是按 小时 统计，写hour;
                    xName='day'
                    // 搜索条件，用户分析表-日期是按 时间段 搜索，所以写days;用户分析表-小时是按 天 搜索，写day;内容分析表-总体需要时间段和搜索条件，所以home_total;
                    searchType='days'
                    getTableData={this.getTableData}
                    // 图表所需的总数据
                    tableData={this.state.tableData}
                    // 需要统计的数据维度，用于初始化图表选择的维度
                    dataFormat={this.props.dataFormat || []}>

                </UserDateTable>

            </div>
        </div>
    }
}

export default CommonTable
