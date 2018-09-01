import React, {Component} from 'react'
import {Route, withRouter, Redirect, Switch} from 'react-router-dom'
import { hot } from 'react-hot-loader'

import {Spin} from 'antd'
import Loadable from 'react-loadable'
const loading = () => <Spin />


const Faq = Loadable({
  loader: () => import ('./Faq'),
  loading
});

const ZhangHao = Loadable({
  loader: () => import ('./ZhangHao'),
  loading
});



class XiTong extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {url} = this.props.match;
        return <section className='xitong'>
            <Switch>
                <Route exact path={`${url}`} render={() => <Redirect to={`${url}/faq`}/>}/>
                <Route exact path={`${url}/faq`} component={Faq}/>
                <Route exact path={`${url}/zhanghao`} component={ZhangHao}/>
            </Switch>
        </section>
    }
}

export default hot(module)(XiTong)
