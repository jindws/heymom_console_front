import React,{Component} from 'react'
import echarts from 'echarts'
import './TotalAndUserEchart.css'
class Echarts extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            data:[],
            timeArr:[],
            type:'累计用户数',
        }
    }
    componentDidMount() {
        this.handlData(this.props.data)
    }

    componentWillReceiveProps(nextProps){
        this.handlData(nextProps.data)
    }

    drawCharts=()=>{
        const t = this
        // let myChart = echarts.init(document.getElementById('CustomizedPie'));
        let myChart = echarts.init(this.CustomizedPie);
        let option = {
            tooltip: {
                trigger: 'axis'
            },
            legend:{
                show:true,
                data:[t.state.type],
                bottom:10,
                borderColor:'#56c754'
            },
            textStyle:{
                color:'#bbbbbb'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                nameGap:10,
                data:t.state.timeArr,
                axisLine:{
                    show:true,
                    lineStyle:{
                      color:'#c6c6c6',
                      width:4,
                    }
                },
            },
            yAxis: {
                type: 'value',
                boundaryGap: ['0', '10%'],
                axisLabel: {
                    formatter: '{value} '
                },
                axisLine:{
                    show:false,
                },
            },
            series: [
                {
                  symbol:'circle',
                  name:[t.state.type],
                  type:'line',
                  data:t.state.data,
                  areaStyle:{
                      normal:{
                          color:'#f9f9f9',
                          opacity:0.7
                      },
                  },
                    lineStyle:{
                        normal:{
                            color:'#56c754',
                            width:3
                        }
                    },
                    itemStyle:{
                        normal:{
                            borderWidth:4,
                            borderColor:'#56c754',
                            color:'#56c754'
                        }
                    },
                }
            ]
        }
        myChart.setOption(option,555);
    }

    handlData =(dt)=>{
        let temTime = []
        let temData = []

        if(!dt.allData) return
        dt.allData.map((item,index)=>{
          if(dt.tab.key==='shou_ru'){
            item[dt.tab.key]=(item[dt.tab.key]/100).toFixed(2)
          }
            temTime.push(item.date)
            temData.push(item[dt.tab.key])
        })
        this.setState({
            timeArr:temTime.reverse(),
            data:temData.reverse(),
            type:dt.tab.title
        },()=>{
            this.drawCharts()
        })

    }

    render() {
        return <div id="CustomizedPie" ref={CustomizedPie=>this.CustomizedPie=CustomizedPie} className="CustomizedPie"></div>
    }
}
export default Echarts
