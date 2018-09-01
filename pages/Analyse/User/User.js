import React, {Component} from 'react'
import DataIndex from '@modules/DataIndex'
import UserAnyEcharts from '@modules/UserAnyEcharts'
import UserAnyTable from '@modules/UserAnyTable'
import moment from 'moment'
import DB from '@DB'
// import './User.scss'
const TITLEMAP = [{
  value:'累计用户数',
  key:'lei_ji_yong_hu'
},{
  value:'新增用户数',
  key:'xin_zeng_yon_ghu'
},{
  value: '日活用户数',
  key:'ri_huo_ren_shu'
},{
  value: '周活用户数',
  key:'zhou_huo_ren_shu'
},{
  value:'成功订单数',
  key:'bao_ming_ci_shu'
},{
  value:'听课用户数',
  key:'ting_ke_ren_shu'
}]
class User extends Component {
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
              }
              t.setState({zhibiaoData: obj})
        })
    }
    Anyindex = ()=>{
      console.log()
    }
    render() {
        let t = this
        return (
            <div className='user-wrap'>
                <div className="yh">用户分析</div>
                <div className="user-content">
          					<div>
                        <DataIndex title={TITLEMAP} list={this.state.zhibiaoData} indexName={this.state.indexName}/>
                    </div>
                    <div>
                        <UserAnyEcharts/>
                    </div>
                    <div>
                        <UserAnyTable/>
                    </div>
          			</div>
            </div>
        )
    }
}
export default User
