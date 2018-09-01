import React,{Component} from 'react'
import {Icon,Modal,Button,Popconfirm} from 'antd'
import { hot } from 'react-hot-loader'

class Header extends Component {

  constructor(props){
    super(props)
  }

  render(){
    const {name,_logOut} = this.props;

    return <header className='header'>
      <div>
        <Icon type="book" />
        HeyMom后台管理系统
      </div>
      <div className='right' style={{visibility:(name?'':'hidden')}}>
        <Icon type="user" />
        {name}
        <Popconfirm title="确定退出?" onConfirm={()=>_logOut()} okText="退出" cancelText="取消">
            <Button type="dashed" shape="circle" icon="logout" />
        </Popconfirm>
      </div>
    </header>
  }
}

export default hot(module)(Header)
