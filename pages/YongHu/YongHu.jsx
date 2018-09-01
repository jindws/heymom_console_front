import React, {Component} from 'react'

import {Route, withRouter, Redirect, Switch} from 'react-router-dom'
import { hot } from 'react-hot-loader'

import {Spin} from 'antd'
import Loadable from 'react-loadable'
const loading = () => <Spin />


const ChaKan = Loadable({
  loader: () => import ('./ChaKan'),
  loading
});

const Progress = Loadable({
  loader: () => import ('./Progress'),
  loading
});

const Return = Loadable({
  loader: () => import ('./Return'),
  loading
});

class YongHu extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {url} = this.props.match;
        return <section className='shangcheng'>
            <Switch>
                <Route exact path={`${url}`} render={() => <Redirect to={`${url}/chakan`}/>}/>
                <Route exact path={`${url}/chakan`} component={ChaKan}/>
                <Route exact path={`${url}/progress`} component={Progress}/>
                <Route path={`${url}/return`} component={Return}/>
            </Switch>
        </section>
    }
}

export default hot(module)(YongHu)
