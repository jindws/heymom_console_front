import React, {Component} from 'react'
// import Reflux from 'reflux'
import JSON2EXCEL from '@modules/Export'
import moment from 'moment'
import { Table,Card,DatePicker,Input,Select,Button } from 'antd';
const { RangePicker } = DatePicker;
const Option = Select.Option;
const InputGroup = Input.Group;
const Search = Input.Search;
import DB from '@DB'


class UserDateTable extends Component {
    constructor(props){
        super(props)

        // 格式化表格所需的格式
        const columns = []
        let {
            xName,
            searchType
        } = this.props

        if(xName === 'day') {
            columns.push({
                title: '日期',
                dataIndex: 'day',
                key: 'day',
                fixed: 'left',
                sorter: true,
                width:100,
            })
        }else if(xName === 'hour') {
            columns.push({
                title: '小时',
                dataIndex: 'hour',
                key: 'hour',
                fixed: 'left',
                sorter: true,
                width:100,
            })
        }
        // 如果是首页推荐分析-分类
        if(searchType === 'home_category') {
            columns.push({
                title: '分类',
                dataIndex: 'category',
                key: 'category',
                width:100,
                fixed: 'left',
            })
            columns.shift()
        }

        // 如果是首页推荐分析-频道
        if(searchType === 'home_channel') {
            columns.push({
                title: '频道',
                dataIndex: 'channel',
                key: 'channel',
                width:100,
                fixed: 'left',
            })
            columns.shift()
        }



        for (let item of this.props.dataFormat) {
            let tem = {
                title: item.title,
                dataIndex: item.en,
                key: item.en,
                sorter: true,
                width:120,
                // sortOrder:'ascend',
            }
            if(item.title.indexOf('率') !== -1) {
                tem.render = (text,record)=> {
                    return <span>{text}%</span>
                }
            }
            columns.push(tem)
        }
        this.state = {
            query:{
                // 开始时间
                start_time:moment().subtract(7, 'days').valueOf(),
                // 结束时间
                end_time:moment().subtract(1,'d').valueOf(),
                // 日期
                day:moment().subtract(1,'d').format('YYYY-MM-DD'),
            },
            // 表格的格式
            columns:columns || [],
            // 表格的数据
            data:[],
            // 分类列表
            categoryList:[],
        }

        // 获取分类列表
        DB.Category.list()
        .then(data=>{
            this.setState({
                categoryList:[...data.list,{id:'none',name:'无分类'}]
            })
        })

    }

    // componentDidMount(){
    // }
    //
    // componentWillReceiveProps(nextProps){
    // }

    disabledDate(current) {
      //禁止选择未来时间
        return current && current.valueOf() > Date.now();
    }

    // 时间改变时触发
    changeDate = (date) => {
        this.setState({
            query:{
                ...this.state.query,
                start_time:moment(date[0]).valueOf(),
                end_time:moment(date[1]).valueOf(),
            }
        }, ()=>{
            this.props.getTableData(this.state.query)
        })
    }

    // 更改搜索条件，例如更改分类和推荐方式
    changeType = (type, value) => {

        this.setState({
            query:{
                ...this.state.query,
                [type]:value,
                page_num:1,
            }
        }, ()=>{
            this.props.getTableData(this.state.query)
        })
    }

    // 时间搜索框,如果是用户分析表-日期使用，搜索框按时间段搜索，如果是用户分析表-小时使用，搜索框按天搜索
    SearchBar() {
        const type = this.props.searchType || 'days'
        let dom = []
        dom.push(<Button onClick={this.download} className='table-download' key='download' type="primary">下载表格</Button>)
        if(type === 'days' || type === 'user_pop') {
            dom.push(
                <RangePicker
                    allowClear={false}
                    value={[moment(this.state.query.start_time),
                      moment(this.state.query.end_time)]}
                    onChange={this.changeDate}
                    style={{marginLeft:'20px'}}
                    size='large'
                    disabledDate={this.disabledDate.bind(this)}
                    key='2' />
            )
        }else if(type === 'day') {
            dom.push(<DatePicker
                key='1'
                allowClear={false}
                value={moment(this.state.query.day)}
                onChange={(date, dateString)=>{
                    this.setState({
                        query:{
                            ...this.state.query,
                            day:dateString
                        }
                    },()=>{
                        this.props.getTableData({
                            day:dateString
                        })
                    })
                }}
                disabledDate={this.disabledDate.bind(this)}
                />)
        }else if(type === 'home_category' || type === 'home_channel') {
            dom.push(
                <DatePicker
                    allowClear={false}
                    key='4'
                    value={moment(this.state.query.day)}
                    onChange={(date, dateString)=>{
                        this.setState({
                            query:{
                                ...this.state.query,
                                day:dateString
                            }
                        },()=>{
                            let query = Object.assign({},this.state.query)
                            this.props.getTableData(query)
                        })

                    }}
                    disabledDate={this.disabledDate.bind(this)}
                />,
                <InputGroup key='2' style={{float:'right',width:'200px'}} compact>
                    <Select
                        mode="combobox"
                        defaultValue="推荐方式"
                        disabled
                        style={{ width: 65,color:'#4c4c4c' }}>
                    </Select>
                    <Select
                        key='1'
                        defaultValue="算法"
                        onChange={this.changeType.bind(this,'twitte_way')}
                        style={{ width: 120 }}>
                        <Option value="规则">规则</Option>
                        <Option value="算法">算法</Option>
                    </Select>
                </InputGroup>,

            )
        }
        return dom
    }

    // 下载表格
    download = (data) =>{
        const type = this.props.type

        let column = []
        let temData = []
        for(let i of this.state.columns) {
            column.push(i.title)
        }
        let excelName = '分析表'
        let resDB = ''
        switch (type) {
            case 'content_total':
                resDB = DB.Analyse.getContentTotalTable(this.state.query)
                excelName = '内容分析表-总体'
                break;

            case 'user_date':
                resDB = DB.Analyse.downloadUserDate(this.state.query)
                excelName = '用户分析表-日期'
                break;
            case 'user_hour':
                resDB = DB.Analyse.getUserHour(this.state.query)
                excelName = '用户分析表-小时'
                break;
            case 'user_pop':
                resDB = DB.Analyse.downloadUserPop(this.state.query)
                excelName = '用户分析表-活跃'
                break;

            case 'home_total':
                resDB = DB.Analyse.downloadHomeTotal(this.state.query)
                excelName = '首页推荐分析表-总体'
                break;
            case 'home_category':
                resDB = DB.Analyse.getHomeCategory(this.state.query)
                excelName = '首页推荐分析表-分类'
                break;
            case 'home_channel':
                resDB = DB.Analyse.getHomeChannel(this.state.query)
                excelName = '首页推荐分析表-频道'
                break;

            case 'relative':
                resDB = DB.Analyse.downloadRelative(this.state.query)
                excelName = '相关推荐分析表'
                break;
            case 'template':
                resDB = DB.Analyse.downloadTemplate(this.state.query)
                excelName = '模板消息分析表'
                break;
            case 'daysign':
                resDB = DB.Analyse.downloadDaySign(this.state.query)
                excelName = '日签分析表'
                break;
            case 'article_verify':
                resDB = DB.Analyse.downloadArticleVerify(this.state.query)
                excelName = '文章审核分析表'
                break;
        }
        resDB.then(data=>{
            for(let item of data.list) {
                let resData = {}
                for(let item2 of this.state.columns) {
                    resData[item2.title] = item[item2.dataIndex] || '0'
                }
                temData.push(resData)
            }

            JSON2EXCEL(temData, excelName, column)
        })
    }

    // 改变搜索条件时触发，例如分页排序
    search = (pagination, filters, sorter) => {
        // let query = Object.assign({},this.state.query)
        // 如果是用户分析表-小时调用本组件，无需发送start_time和end_time
        let query = this.searchType === 'hour' ? {} : {...this.state.query}
        let {
            current = 1,
            pageSize = 15,
        } = pagination
        let {
            field,
            order,
        } = sorter
        query.page_num = current
        query.page_size = pageSize
        if(field) {
            (query.sort_key = field)
        } else{
            delete query.sort_key
        }
        if(order) {
            (query.sort_type = (order === 'descend' ? 'desc' :'asc'))
        } else{
            delete query.sort_type
        }

        this.setState({
            query,
        },()=>{
            this.props.getTableData(query)
        })
    }

    render() {
        const {
            list = [],
            page_num = 1,
            page_size = 15,
            total = 0,
        } = this.props.tableData

        let data = list.map((item, index) => {
            item.key = index
            return item
        })
        const {
            type,
            xName,
            searchType,
        } = this.props
        return <div className="ud-table">
            <Card title={this.SearchBar()}>
                <Table
                    size='middle'
                    columns={this.state.columns || []}
                    dataSource={data || []}
                    onChange={this.search}
                    pagination={(xName === 'hour' || searchType === 'home_category' || searchType === 'home_channel')? false: {
                        showTotal: (total, range) => `共 ${+total} 条`,
                        pageSize: +page_size,
                        current: +page_num,
                        total,
                    }}
                    scroll={{
                        // 如果是用户分析表-小时的话，表格不需要那么长
                        x: (searchType === 'day' || type === 'relative' || type === 'article_verify')?'110%': '180%'
                    }}/>
            </Card>
        </div>
    }
}

export default UserDateTable
