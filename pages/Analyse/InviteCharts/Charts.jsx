import React, {Component} from 'react'

import {Route, withRouter, Redirect, Switch, NavLink} from 'react-router-dom'

import Bundle from '@modules/Bundle'

import ChartsInvPageTotal from 'bundle-loader?lazy&name=invite-charts-InvPageTotal!./InvPageTotal'
import ChartsInvTotal from 'bundle-loader?lazy&name=invite-charts-InvTotal!./InvTotal'
import InvCourseSingle from 'bundle-loader?lazy&name=invite-charts-InvCourseSingle!./InvCourseSingle'
import ChartsInvPageSingle from 'bundle-loader?lazy&name=invite-charts-InvPageSingle!./InvPageSingle'

const InvTotal = Bundle(ChartsInvTotal)
const InvPageTotal = Bundle(ChartsInvPageTotal)
const InvCourseSingleB = Bundle(InvCourseSingle)
const InvPageSingle = Bundle(ChartsInvPageSingle)

class Invite extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {match} = this.props;
        // const url = '/invite/charts';
        const url = '/analyse/page/invite'

        return <section className='invite'>
            <div
                style={{height:'40px',width:'80%',border:'1px solid #ccc',margin:'30px 0 0 30px',fontSize:'14px'}}
                className="flex-h ai-stretch">
                <NavLink
                    className='flex1 flex-h jc-center ai-center'
                    style={{color:'#333',borderRight:'1px solid #ccc'}}
                     activeStyle={{
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor:'#576477',
                }} to={`${url}/InvTotal`}>邀请卡总体数据</NavLink>
                <NavLink
                    className='flex1 flex-h jc-center ai-center'
                    style={{color:'#333',borderRight:'1px solid #ccc'}}
                     activeStyle={{
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor:'#576477',
                }} to={`${url}/InvCourseSingle`}>邀请卡课程单例数据</NavLink>
                <NavLink
                    className='flex1 flex-h jc-center ai-center'
                    style={{color:'#333',borderRight:'1px solid #ccc'}}
                     activeStyle={{
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor:'#576477',
                }} to={`${url}/InvPageTotal`}>邀请卡页面数据汇总</NavLink>
                <NavLink
                    className='flex1 flex-h jc-center ai-center'
                    style={{color:'#333'}}
                     activeStyle={{
                    fontWeight: 'bold',
                    color: '#fff',
                    backgroundColor:'#576477',
                }} to={`${url}/InvPageSingle`}>邀请卡每日页面数据</NavLink>
            </div>

            <Switch>
                <Route exact path={`${url}/InvPageSingle`} component={InvPageSingle}/>
                <Route exact path={`${url}/InvCourseSingle`} component={InvCourseSingleB}/>
                <Route exact path={`${url}/InvPageTotal`} component={InvPageTotal}/>
                <Route exact path={`${url}/InvTotal`} component={InvTotal}/>
            </Switch>
        </section>
    }
}

export default withRouter(Invite)
