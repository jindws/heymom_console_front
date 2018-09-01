/**
 * 2017-08-12
 * @author yeqinglong
 * 课程汇总分析
 */

import React, {Component} from 'react'
import moment from 'moment'
import DataIndex from '@modules/DataIndex'
import CourseTotalEcharts from '@modules/CourseTotalEcharts'
import CourseTotalTable from '@modules/CourseTotalTable'
import DB from '@DB'
var {EventEmitter} = require('fbemitter')
window.emitter = new EventEmitter()
import './CourseTotal.scss'

//昨日关键指标各项名称
const TITLEMAP = [{
  value:'发起报名次数',
  key:'yu_bao_ming_ci_shu'
},{
  value:'成功订单数',
  key:'bao_ming_ci_shu'
},{
  value:'听课用户数',
  key:'ting_ke_ren_shu'
},{
  value: '听课次数',
  key:'ting_ke_ci_shu'
}]

class CourseTotal extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
          host: '',
          //昨日关键指标的数据 请求起始时间设为昨日
          start_time: moment().startOf('day').subtract(1, 'days').valueOf(),
          zhibiaoData: [],
          indexName:'昨日关键指标'
        }
    }
    componentDidMount() {
        this.send()
    }
    send() {
        const t = this;
        DB.Analyse.getCourseTotal({
          //请求的起始与截止时间均为昨日
            start_time:t.state.start_time,
            end_time:t.state.start_time,
        }).then(result=>{
              //解构赋值，拿出list
              let { list = [] } = result
              let obj
              if (list && list.length) {
                  obj = list[0] || {}
              }
              t.setState({zhibiaoData: obj})
        })
    }

    render() {
        let t = this
        return (
            <div className="coursetotal-wrap">
              <div className="coursetotalfx">课程汇总分析</div>
              <div className="coursetotal-content">
                <div>
                  <DataIndex title={TITLEMAP} list={this.state.zhibiaoData} indexName={this.state.indexName}/>
                </div>
                <div>
                  <CourseTotalEcharts/>
                </div>
                <div>
                  <CourseTotalTable/>
                </div>
              </div>
            </div>
        )
    }
}

export default CourseTotal
