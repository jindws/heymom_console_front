import React, {Component} from 'react'

import {Route, withRouter, Redirect, Switch} from 'react-router-dom'
import { hot } from 'react-hot-loader'

import Loadable from 'react-loadable'

import {Spin} from 'antd'

const loading = () => <Spin />

const XianSuo = Loadable({
  loader: () => import ('./XianSuo'),
  loading
});

const QuDao = Loadable({
  loader: () => import ('./Channel'),
  loading
});


class ZhaoSheng extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {url} = this.props.match;
        return <section className='zhaosheng'>
            <Switch>
                <Route exact path={`${url}`} render={() => <Redirect to={`${url}/xiansuo`}/>}/>
                <Route exact path={`${url}/xiansuo`} component={XianSuo}/>
                <Route exact path={`${url}/qudao`} component={QuDao}/>
            </Switch>
        </section>
    }
}

export default hot(module)(ZhaoSheng)
