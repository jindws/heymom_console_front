import React, {Component} from 'react'
import {Card,Input,Select} from 'antd';
const Option = Select.Option;
const InputGroup = Input.Group;

class YesterdayNum extends Component {
    constructor(props){
        super(props)
    }

    yesTitle = () =>{
        return (
            <div>
                <span>
                    昨日关键指标
                </span>
                {
                    this.props.getYesterdayData && <InputGroup style={{float:'right',width:'200px'}} compact>
                        <Select
                            mode="combobox"
                            defaultValue="分类"
                            disabled
                            style={{ width: 40,color:'#4c4c4c' }}>
                        </Select>
                        <Select
                            key='1'
                            defaultValue="理念"
                            onChange={(category)=>this.props.getYesterdayData({category})}
                            style={{ width: 120 }}>
                            <Option value="管理">管理</Option>
                            <Option value="营销">营销</Option>
                            <Option value="教学">教学</Option>
                            <Option value="理念">理念</Option>
                            <Option value="业态">业态</Option>
                            <Option value="鸡汤">鸡汤</Option>
                            <Option value="教师考级">教师考级</Option>
                            <Option value="家庭婚姻">家庭婚姻</Option>
                            <Option value="校园生活">校园生活</Option>
                            <Option value="留学">留学</Option>
                            <Option value="就业">就业</Option>
                            <Option value="高考">高考</Option>
                            <Option value="考研">考研</Option>
                            <Option value="公考">公考</Option>
                            <Option value="学科知识">学科知识</Option>
                            <Option value="无分类">无分类</Option>
                        </Select>
                    </InputGroup>
                }
            </div>
        )
    }

    render() {
        return <div className="yeaterday-wrap">
            <Card title={this.yesTitle()}>
                <div className="yc-wrap">
                    {
                        this.props.data && this.props.data.map((item,index)=>{
                            if(this.props.hideArr.indexOf(item.en) === -1){
                                return <div className='yc-item' key={index}>
                                    <div className="">
                                        {item.title}
                                    </div>
                                    <div className="yc-num">
                                        {(item.num || item.num === 0) ? item.num.toLocaleString() : '-'}
                                    </div>

                                </div>
                            }
                        })
                    }
                </div>
            </Card>
        </div>
    }
}

export default YesterdayNum
