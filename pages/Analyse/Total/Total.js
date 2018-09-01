import React, {Component} from 'react'
import DataIndex from '@modules/DataIndex'
import TotalAnyEcharts from '@modules/TotalAnyEcharts'
import TotalAnyTable from '@modules/TotalAnyTable'
import moment from 'moment'
import DB from '@DB'

const TITLEMAP = [{
  value:'累计用户数',
  key:'lei_ji_yong_hu'
},{
  value:'新增用户数',
  key:'xin_zeng_yon_ghu'
},{
  value: '周活用户数',
  key:'zhou_huo_ren_shu'
},{
  value:'成功订单数',
  key:'bao_ming_ci_shu'
},{
  value:'收入',
  key:'shou_ru'
}]
class Total extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            host: '',
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
        DB.Analyse.getTotal({
          start_time:t.state.start_time,
          end_time:t.state.start_time,
        }).then(result=>{
              let {
                  list = []
              } = result
              let obj
              if (list && list.length) {
                  obj = list[0] || {}
                  obj['shou_ru']=(obj['shou_ru']/100).toFixed(2)
              }

              t.setState({zhibiaoData: obj})
        })
    }

    render() {
        let t = this
        return (
            <div className='total-wrap'>
                <div className="yh">总体分析</div>
		            <div className="total-content">
          					<div>
          	            <DataIndex title={TITLEMAP} list={this.state.zhibiaoData} indexName={this.state.indexName}/>
          	        </div>
                    <div>
                        <TotalAnyEcharts/>
                    </div>
                    <div>
                        <TotalAnyTable/>
                    </div>
        				</div>
          </div>
        )
    }
}

export default Total
