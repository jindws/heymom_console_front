import React, {Component} from 'react'

import {Route, Redirect, Switch} from 'react-router-dom'
import {Spin} from 'antd'
import {hot} from 'react-hot-loader'

import Loadable from 'react-loadable'
const loading = () => <Spin/>

const Shouye = Loadable({
  loader: () => import ('./Shouye'),
  loading
});

const About = Loadable({
  loader: () => import ('./About'),
  loading
});


class ShangCheng extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {url} = this.props.match;
        return <section className='shangcheng'>
            <Switch>
                {/* <Route exact path={`${url}/shouye`} render={() => <Redirect to={`${url}/shouye/lunbo`}/>}/> */}
                {/* <Route exact path={`${url}/shouye/:type`} component={Shouye}/> */}
                <Route path={`${url}/shouye`} component={Shouye}/>
                <Route exact path={`${url}/about`} component={About}/>
            </Switch>
        </section>
    }
}

export default hot(module)(ShangCheng)
