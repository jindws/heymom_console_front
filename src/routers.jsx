import React, {Component,Fragment} from 'react'
import {HashRouter, Route, Switch, Link,Redirect,withRouter} from 'react-router-dom'
import {BackTop,Modal,Input,message,Button,Spin} from 'antd'
import Loadable from 'react-loadable'
import DB from '@DB'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import store from '../store/index.js'

const loading = () => <Spin />

const Header = Loadable({
  loader: () => import ('@comp/Header'),
  loading
});

const Menu = Loadable({
  loader: () => import ('@comp/Menu'),
  loading
});

const ShangCheng = Loadable({
  loader: () => import ('@page/ShangCheng'),
  loading
});

const JiaoXue = Loadable({
  loader: () => import ('@page/JiaoXue'),
  loading
});

const YongHu = Loadable({
  loader: () => import ('@page/YongHu'),
  loading
});

const XiTong = Loadable({
  loader: () => import ('@page/XiTong'),
  loading
});

const ZhaoSheng = Loadable({
  loader: () => import ('@page/ZhaoSheng'),
  loading
});

const Mean = Loadable({//ZiLiao
  loader: () => import ('@page/Mean'),
  loading
});

const Order = Loadable({//ZiLiao
  loader: () => import ('@page/Order'),
  loading
});

const Analyse = Loadable({//ZiLiao
  loader: () => import ('@page/Analyse'),
  loading
});

// const TemplateMessage = Loadable({//ZiLiao
//   loader: () => import ('@page/TemplateMessage'),
//   loading
// });

class Routers extends Component{

  constructor(props){
    super(props);
    this.state={
      loginModal:false,
      phone:'',
      pwd:'',
      iflogin:false,
      loading:true,
      name:'',
    }
  }

  componentDidMount(){
    this.checkLogin()
  }

  async checkLogin(){
    await DB.Admin.checkLogin().then(({name})=>{
        this.setState({
          iflogin:true,
          name
        })
    },()=>{
        this.setState({
          iflogin:false,
          loginModal:true,
        })
    })

    this.setState({
      loading:false,
    })
  }

  _loginNow(){
      const {phone,pwd} = this.state;
      DB.Admin.login({
        phone,
        pwd
      }).then(()=>{
          message.success('登录成功');
          this.setState({
            loginModal:false,
            phone:'',
            pwd:'',
          })
          this.checkLogin();
      },data=>{
          message.error(data.errorMsg);
      })
  }

  _Login(){
    const {phone,pwd}=this.state;
    return <Modal
          title="登录"
          visible={this.state.loginModal}
          wrapClassName='login'
          onCancel={()=>this.setState({loginModal:false})}
          maskClosable={false}
          closable={false}
          footer={<Button onClick={this._loginNow.bind(this)}>登录</Button>}
        >
          <Input addonBefore="手机" placeholder='请输入手机号码' onChange={e=>this.setState({phone:e.target.value})} />
          <Input type='password' addonBefore="密码" placeholder='请输入密码' onChange={e=>this.setState({pwd:e.target.value})} />
        </Modal>
  }

  _main(){
      const {iflogin,loading} = this.state;
      if(iflogin&&!loading){
        return <Provider store={store} >
            <HashRouter key='hash'>
                  <section className='container'>
                      <Route path="*" component={Menu}/>
                      <section className='contain'>
                          <Route exact path="/" render={() => <Redirect to="/shangcheng/shouye"/>}/>
                          <Route path="/shangcheng" component={ShangCheng}/>
                          <Route path="/jiaoxue" component={JiaoXue}/>
                          <Route path="/yonghu" component={YongHu}/>
                          <Route path="/xitong" component={XiTong}/>
                          <Route path="/zhaosheng" component={ZhaoSheng}/>
                          <Route path="/mean" component={Mean}/>
                          <Route path="/order" component={Order}/>
                          <Route path="/analyse" component={Analyse}/>
                          {/* <Route path="/weixin" component={TemplateMessage}/> */}
                      </section>
                  </section>
            </HashRouter>
        </Provider>
      }else if(!iflogin&&!loading){
        return <section key='login'>{this._Login()}</section>
      }
  }

  _logOut(){
      DB.Admin.logout().then(()=>this.setState({
        iflogin:false,
        loginModal:true,
        name:'',
      }))
  }

  render(){
    const {name} = this.state

    return (
        <Fragment>
            <Header _logOut={this._logOut.bind(this)} name={name}></Header>
            <Fragment>{this._main()}</Fragment>
            <BackTop/>
        </Fragment>
    )

    // return [
    //   <Header key='header' _logOut={this._logOut.bind(this)} name={name}></Header>,
    //   <div key='main'>{this._main()}</div>,
    //   <BackTop key='backup' />,
    // ]
  }
}

export default hot(module)(Routers)
