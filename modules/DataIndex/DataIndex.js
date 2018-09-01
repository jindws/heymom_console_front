import React,{Component} from 'react'
import './DataIndex.css'
const {scinotation} = require('../../util/helper')

class DataIndex extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            handlData:[],
        }
    }
    render() {
        let t = this
        return (
          <div className="quo bd_ccc">
              <div className="yst-zb-cap">
                  {this.props.indexName}
              </div>
              <div className="yst-zb-body flex-h ai-center">
                  <div className="flex-h">
                    {
                        this.props.title.map((item, index) => {
                           return <div key={index} className="flex1">
                                      <div className="quo-t">{item.value}</div>
                                      <div className="quo-v">{t.props.list?(t.props.list[item.key]&&(t.props.list[item.key]).toLocaleString()):'-'}</div>
                                  </div>
                        })
                    }
                  </div>
              </div>
          </div>
        )
    }
}

export default DataIndex
