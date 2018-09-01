// import React, {Component} from 'react'
// import DB from '@DB'
//
// import {withRouter,Route,NavLink,Switch} from 'react-router-dom'
// import Bundle from '@modules/Bundle'
//
// import ImportC from 'bundle-loader?lazy&name=app-import!./Import';
// const Import = Bundle(ImportC)
//
// // import {Button,Icon,Tag,Input,message,Alert,Spin,Popconfirm} from 'antd'
//
// // import {CSSTransitionGroup} from 'react-transition-group'
//
// class Order extends Component {
// 	constructor(props) {
//         super(props);
// 		this.state = {
//
// 		}
//     }
//
// 	render() {
//         const { match } = this.props;
// 		return (
// 		<section className=''>
// 			<Route path={`${match.url}/`} exact component={Import} />
// 		</section>)
// 	}
// }
// 
// export default withRouter(Order)
export {default} from './Import'
