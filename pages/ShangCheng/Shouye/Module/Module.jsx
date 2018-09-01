import React, {Component} from 'react'
import {Route, withRouter, Redirect, Switch} from 'react-router-dom'
import { Breadcrumb } from 'antd'
import 'react-dragula/dist/dragula.css'
import {Spin} from 'antd'
import {hot} from 'react-hot-loader'

import Loadable from 'react-loadable'

const loading = () => <Spin/>

const List = Loadable({
  loader: () => import ('./List'),
  loading
});

const Operate = Loadable({
  loader: () => import ('./Operate'),
  loading
});


class Module extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const _url = this.props.match.path
        console.log(222,this.props)
        return <section className='shouye'>
        <Switch>
            {/* <Route exact path={`${_url}`} render={() => <Redirect to={`${_url}/lunbo`}/>}/> */}
            <Route exact path={`${_url}`} component={List}/>
            <Route exact path={`${_url}/:_id`} component={Operate}/>
            {/* <Route exact path={`${_url}/module`} component={Module}/> */}
        </Switch>
        </section>
    }
}

export default hot(module)(Module)
