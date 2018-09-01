import React, {Component} from 'react'
import DB from '@DB'

import {withRouter,Route,NavLink,Switch} from 'react-router-dom'
import {Spin} from 'antd'

import Loadable from 'react-loadable'
const loading = () => <Spin />


const List = Loadable({
  loader: () => import ('./List'),
  loading
});

const Operate = Loadable({
  loader: () => import ('./Operate'),
  loading
});

class TemplateMessage extends Component {
	constructor(props) {
        super(props);
		this.state = {

		}
    }

	render() {
        const { match } = this.props;
		return (
		<section className=''>
			<Route path={`${match.url}/`} exact component={List} />
			<Route path={`${match.url}/operate/:messageid`} component={Operate} />
		</section>)
	}
}

export default withRouter(TemplateMessage)
