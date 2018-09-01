import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Icon} from 'antd'

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: [
                {
                    title: '商城管理',
                    iconType: 'setting',
                    baseLink: 'shangcheng',
                    list: [
                        {
                            tit: '首页管理',
                            link: 'shouye'
                        }, {
                            tit: '关于我们',
                            link: 'about'
                        }
                    ]
                },
                {
                    title: '招生管理',
                    iconType: 'book',
                    baseLink: 'zhaosheng',
                    list: [
                        {
                            tit: '线索管理',
                            link: 'xiansuo'
                        },
                        {
                           tit: '渠道管理',
                           link: 'qudao'
                       }
                    ]
                },
                {
                    title: '教学管理',
                    iconType: 'line-chart',
                    baseLink: 'jiaoxue',
                    list: [
                        {
                            tit: '课程管理',
                            link: 'kecheng'
                        }, {
                            tit: '标签管理',
                            link: 'biaoqian'
                        },
                    ]
                },
                {
                    title: '资料管理',
                    iconType: 'setting',
                    baseLink: 'mean',
                    list: [
                        {
                            tit: '音频管理',
                            link: 'audio'
                        }, {
                            tit: '视频管理',
                            link: 'video'
                        }, {
                            tit: '图片管理',
                            link: 'image'
                        },{
                            tit: '图文管理',
                            link: 'imgtxt'
                        },
                    ]
                },
                {
                    title: '用户管理',
                    iconType: 'switcher',
                    baseLink: 'yonghu',
                    list: [
                        {
                            tit: '查看用户',
                            link: 'chakan'
                        },
                        {
                            tit: '学习进度',
                            link: 'progress'
                        },
                        {
                            tit: '回访记录',
                            link: 'return'
                        }
                    ]
                },
                {
                    title: '订单管理',
                    iconType: 'calendar',
                    link: 'order',
                },
                // {
                //     title: '财务管理',
                //     iconType: 'calendar',
                //     link: 'caiwu',
                // },
                {
                    title: '数据管理',
                    iconType: 'area-chart',
                    baseLink: 'analyse',
                    list: [
                        {
                            tit: '总体分析',
                            link: 'zongti'
                        },
                        {
                            tit: '课程分析',
                            link: 'kecheng'
                        },
                    ]
                },
                // {
                //     title: '微信工具',
                //     iconType: 'message',
                //     link: 'weixin'
                // },
                {
                    title: '系统设置',
                    iconType: 'message',
                    baseLink: 'xitong',
                    list: [
                        {
                            tit: '账号管理',
                            link: 'zhanghao'
                        },
                        {
                            tit: 'FAQ设置',
                            link: 'faq'
                        }
                    ]
                },
            ]
        }
    }

    render() {
        const lis = [];
        this.state.menu.forEach((itm, index) => {
            let path = (this.props.match.url || '').substring(1);
            if (itm.link !== undefined) {
                if(path.startsWith(itm.link)){
                    lis.push(
                        <dt className='on' key={`menu_dt_${index}`}>
                            <Icon type={itm.iconType}/>
                            <Link to={`/${itm.link}`}>
                                {itm.title}
                            </Link>
                        </dt>
                    );
                } else {
                    lis.push(
                        <dt key={`menu_dt_${index}`}>
                            <Icon type={itm.iconType}/>
                            <Link to={`/${itm.link}`}>
                                {itm.title}
                            </Link>
                        </dt>
                    );
                }
            } else {
                lis.push(
                    <dt key={`menu_dt_${index}`}>
                        <Icon type={itm.iconType}/> {itm.title}
                    </dt>
                );
            }
            (itm.list || []).forEach((it, ind) => {
                const {
                    baseLink = ''
                } = itm;
                const link = baseLink
                    ? `${baseLink}/${it.link}`
                    : it.link;
                if(path.startsWith(link)){
                    lis.push(
                        <dd className='on' key={`menu_dd_${index}_${ind}`}>
                            <Link to={`/${link}`}>{it.tit}</Link>
                        </dd>
                    );
                } else {
                    lis.push(
                        <dd key={`menu_dd_${index}_${ind}`}>
                            <Link to={`/${link}`}>{it.tit}</Link>
                        </dd>
                    );
                }
            })
        })

        return <dl className='menu'>
            {lis}
        </dl>
    }
}

export default withRouter(Menu)
