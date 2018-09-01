import React, {Component} from 'react'
import {Route, withRouter, Redirect, Switch} from 'react-router-dom'
import { Breadcrumb } from 'antd'
import 'react-dragula/dist/dragula.css'
import {Spin} from 'antd'

import Loadable from 'react-loadable'

const loading = () => <Spin/>

const Lunbo = Loadable({
  loader: () => import ('./Lunbo'),
  loading
});

const Caidan = Loadable({
  loader: () => import ('./Caidan'),
  loading
});

const Module = Loadable({
  loader: () => import ('./Module'),
  loading
});

class Shouye extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {params} = this.props.match;

        let _url = '/shangcheng/shouye'

        const {type} = params

        const items = [{
            name:'轮播图管理',
            type:'lunbo',
        },{
            name:'菜单管理',
            type:'caidan',
        },{
            name:'模块管理',
            type:'module',
        }]

        return <section className='shouye'>
            <Breadcrumb>
                {items.map((itm,index)=>(
                    <Breadcrumb.Item key={index}>
                        <a href="javascript:;" className={type === itm.type?'on':''} onClick={()=>{
                            if(type !== itm.type){
                                location.hash = `shangcheng/shouye/${itm.type}`
                            }
                        }}>{itm.name}</a>
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <Switch>
                <Route exact path={`${_url}`} render={() => <Redirect to={`${_url}/lunbo`}/>}/>
                <Route exact path={`${_url}/lunbo`} component={Lunbo}/>
                <Route exact path={`${_url}/caidan`} component={Caidan}/>
                <Route path={`${_url}/module`} component={Module}/>
            </Switch>
        </section>
    }
}

export default withRouter(Shouye)
