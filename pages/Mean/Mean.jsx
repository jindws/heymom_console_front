import React, {Component} from 'react'
import {Route, withRouter, Redirect, Switch} from 'react-router-dom'
import { hot } from 'react-hot-loader'

import {Spin} from 'antd'
import Loadable from 'react-loadable'
const loading = () => <Spin />


const Audio = Loadable({
  loader: () => import ('./Audio'),
  loading
});

const Image = Loadable({
  loader: () => import ('./Image'),
  loading
});

const Video = Loadable({
  loader: () => import ('./Video'),
  loading
});

const ImgTxt = Loadable({
  loader: () => import ('./ImgTxt'),
  loading
});


class Mean extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {url} = this.props.match;
        return <section className='xitong' id='mean'>
            <Switch>
                <Route exact path={`${url}`} render={() => <Redirect to={`${url}/audio`}/>}/>
                <Route exact path={`${url}/audio`} component={Audio}/>
                <Route exact path={`${url}/image`} component={Image}/>
                <Route exact path={`${url}/video`} component={Video}/>
                <Route exact path={`${url}/imgtxt`} component={ImgTxt}/>
            </Switch>
        </section>
    }
}

export default hot(module)(Mean)
