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


class ContentTotalTable extends Component {
    constructor(props){
        super(props)

        // 格式化表格所需的格式
        const columns = []
        let {
            type,
        } = this.props

        if(type === 'content_total') {
            // 内容单篇分析日期不fixed日期
            columns.push({
                title: '日期',
                dataIndex: 'day',
                key: 'day',
                fixed: 'left',
                sorter: true,
                width:100,
            })
        }else if(type === 'content_single') {
            // 内容单篇分析日期不fixed日期
            columns.push({
                title: '标题',
                dataIndex: 'material_title',
                key: 'material_title',
                fixed: 'left',
                sorter: true,
                width:300,
            })
        }

        for (let item of this.props.dataFormat) {
            let tem = {}
            if(item.title === '文章涨粉量') {
                tem = {
                    title: item.title,
                    dataIndex: item.en[0],
                    key: item.en[0],
                    width: 200,
                    sorter:true,
                }
            }else{
                tem = {
                    title: item.title,
                    children:[{
                        title: item.ch[0],
                        dataIndex: item.en[0],
                        key: item.en[0],
                        width: 100,
                        sorter:true,
                    },{
                        title: item.ch[1],
                        dataIndex: item.en[1],
                        key: item.en[1],
                        width: 100,
                        sorter:true,
                    }]
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
        const type = this.props.type
        let dom = []
        dom.push(<Button onClick={this.download} className='table-download' key='download' type="primary">下载表格</Button>)
        if(type === 'content_total') {
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
        }else if(type === 'content_single') {
            dom.push(
                <Search
                    key='1'
                    onSearch={(value)=>{
                        this.setState({
                            query:{
                                ...this.state.query,
                                search_key:value,
                                page_num:1,
                            }
                        }, ()=>{
                            this.props.getTableData(this.state.query)
                        })
                    }}
                    style={{float:'right',width:'200px',marginRight:'20px'}}
                    placeholder="请输入文章标题" />,
                <InputGroup key='3' style={{float:'right',width:'200px'}} compact>
                    <Select
                        mode="combobox"
                        defaultValue="分类"
                        disabled
                        style={{ width: 40,color:'#4c4c4c' }}>
                    </Select>
                    <Select
                        key='1'
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
                    </Select>
                </InputGroup>,
                <DatePicker
                    allowClear={false}
                    key='4'
                    value={moment(this.state.query.day)}
                    onChange={(date, dateString)=>{
                        this.setState({
                            query:{
                                ...this.state.query,
                                day:dateString,
                                page_num:1,
                            }
                        },()=>{
                            let query = Object.assign({},this.state.query)
                            this.props.getTableData(query)
                        })

                    }}
                    disabledDate={this.disabledDate.bind(this)}
                    />
            )
        }
        return dom
    }

    // 下载表格
    download = (data) =>{
        let column = []
        let temData = []
        for(let i of this.state.columns) {
            if(i.children) {
                column.push(i.title+i.children[0].title)
                column.push(i.title+i.children[1].title)
            }else{
                column.push(i.title)
            }
        }
        let excelName = '分析表'
        let resDB = ''
        switch (this.props.type) {
            case 'content_total':
                resDB = DB.Analyse.downloadContentTotal(this.state.query)
                excelName = '文章分析表-总体'
                break;
            case 'content_single':
                resDB = DB.Analyse.getContentSingle(this.state.query)
                excelName = '文章分析表-单篇'
                break;
        }
        resDB.then(data=>{
            for(let item of data.list) {
                let resData = {}
                for(let item2 of this.state.columns) {
                    if(item2.children) {
                        resData[item2.title+item2.children[0].title] = item[item2.children[0].dataIndex] || '0'
                        resData[item2.title+item2.children[1].title] = item[item2.children[1].dataIndex] || '0'
                    }else{
                        resData[item2.title] = item[item2.dataIndex] || '0'
                    }

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
        let query = {...this.state.query}
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
            type
        } = this.props
        return <div className="ud-table">
            <Card title={this.SearchBar()}>
                <Table
                    bordered
                    size='middle'
                    columns={this.state.columns || []}
                    dataSource={data || []}
                    onChange={this.search}
                    pagination={type === 'content_single'? false: {
                        showTotal: (total, range) => `共 ${+total} 条`,
                        pageSize: +page_size,
                        current: +page_num,
                        total,
                    }}
                    scroll={{
                        x: type==='content_total'?'190%':'214%'
                    }}/>
            </Card>
        </div>
    }
}

export default ContentTotalTable
