import React, {Component} from 'react'

import {Route, withRouter, Redirect, Switch} from 'react-router-dom'
import { hot } from 'react-hot-loader'

import {Spin} from 'antd'
import Loadable from 'react-loadable'
const loading = () => <Spin />

const List = Loadable({
  loader: () => import ('./List'),
  loading
});

const Main = Loadable({
  loader: () => import ('./Main'),
  loading
});

class Return extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {url} = this.props.match;
        return <section className='return'>
            <Switch>
                <Route exact path={`${url}`} component={List}/>
                <Route exact path={`${url}/:userId`} component={Main}/>
            </Switch>
        </section>
    }
}

export default hot(module)(Return)
