import React, {Component} from 'react'
import DB from '@DB'

import {withRouter,Route,NavLink,Switch} from 'react-router-dom'
import {Spin} from 'antd'

import Loadable from 'react-loadable'
const loading = () => <Spin />

// import Bundle from '@modules/Bundle'

// import UserC from 'bundle-loader?lazy&name=app-user!./User';
// import TotalC from 'bundle-loader?lazy&name=app-total!./Total';
const Total = Loadable({
  loader: () => import ('./Total'),
  loading
});
// import CourseSingleC from 'bundle-loader?lazy&name=app-coursesingle!./CourseSingle';
// import CourseTimeC from 'bundle-loader?lazy&name=app-coursetime!./CourseTime';
// import CourseTotalC from 'bundle-loader?lazy&name=app-coursetotal!./CourseTotal';
// import PageTimeC from 'bundle-loader?lazy&name=app-pagetime!./PageTime';
// import PageSingleC from 'bundle-loader?lazy&name=app-pagesingle!./PageSingle';
// import _InviteCharts from 'bundle-loader?lazy&name=app-pagesingle!./InviteCharts';

// const User = Bundle(UserC)
// const Total = Bundle(TotalC)
// const CourseSingle = Bundle(CourseSingleC)
// const CourseTime = Bundle(CourseTimeC)
// const CourseTotal = Bundle(CourseTotalC)
// const PageTime = Bundle(PageTimeC)
// const PageSingle = Bundle(PageSingleC)
// const InviteCharts = Bundle(_InviteCharts)

const CourseTotal = Loadable({
  loader: () => import ('./CourseTotal'),
  loading
});

class Analyse extends Component {
	constructor(props) {
        super(props);
    }

	render() {
        const { match } = this.props;
		return (
		<section className=''>
			<Route path={`${match.url}/zongti`} component={Total} />
			<Route path={`${match.url}/kecheng`} component={CourseTotal} />
			{/* <Route path={`${match.url}/user`} component={User} />
			<Route path={`${match.url}/course/single`} component={CourseSingle} />
			<Route path={`${match.url}/course/time`} component={CourseTime} />

			<Route path={`${match.url}/page/time`} component={PageTime} />
			<Route path={`${match.url}/page/single`} component={PageSingle} />
			<Route path={`${match.url}/page/invite/:type`} component={InviteCharts} /> */}
			{/* <Route path={`/invite/charts/:type`} component={InviteCharts} /> */}
		</section>)
	}
}

export default withRouter(Analyse)
