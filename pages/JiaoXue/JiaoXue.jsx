import React, {Component} from 'react'
import {Route, withRouter, Redirect, Switch} from 'react-router-dom'
import {Spin} from 'antd'

import Loadable from 'react-loadable'
const loading = () => <Spin/>

const BiaoQian = Loadable({
  loader: () => import ('./BiaoQian'),
  loading
});

const KeCheng = Loadable({
  loader: () => import ('./KeCheng'),
  loading
});

const KeChengOperate = Loadable({
  loader: () => import ('./vip'),
  loading
});


class JiaoXue extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {url} = this.props.match;
        return <section className='jiaoxue'>
            <Switch>
                <Route exact path={`${url}`} render={() => <Redirect to={`${url}/kecheng`}/>}/>
                <Route exact path={`${url}/biaoqian`} component={BiaoQian}/>
                <Route exact path={`${url}/kecheng`} component={KeCheng}/>
                {/* <Route exact path={`${url}/kechengOperate`} component={KeChengOperate}/> */}
                <Route exact path={`${url}/kechengOperate/:courseId`} component={KeChengOperate}/>
            </Switch>
        </section>
    }
}

export default withRouter(JiaoXue)
