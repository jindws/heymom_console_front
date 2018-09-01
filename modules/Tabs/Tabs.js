import React,{Component} from 'react'
import './Tabs.css'

class Tabs extends Component {
    constructor(props, context) {
        super(props, context)
    }
    onChoose(key,title) {
      this.props.onChoose(key, title)
    }
    render(){
        let t = this;
          return (
            <div className="tab ai-center">
                <div className="tab-body bd-ccc">
                    <div className="flex-h">
                      {
                          t.props.list.map((l, index) => {
                             return <div key={index} className="flex1">
                                        <div className={this.props.choosed.key === l.key?"tab-t active":'tab-t'}
                                        onClick={this.onChoose.bind(this,l.key,l.title)}>
                                            {l.title}
                                        </div>
                                    </div>
                          })
                      }
                    </div>
                </div>
            </div>
        )
    }
}
export default Tabs
