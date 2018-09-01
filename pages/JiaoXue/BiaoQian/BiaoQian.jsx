import React, {Component} from 'react'
import DB from '@DB'
import {Link} from 'react-router-dom'
import {Button,Icon,Tag,Input,message,Alert,Spin,Popconfirm} from 'antd'
import { hot } from 'react-hot-loader'

class BiaoQian extends Component {
	constructor(props) {
        super(props);
		this.state = {
			tags:[],
			// 是否是输入状态
			inputTag: false,
			inputValue:'',
			loading:true,
		}
		this._getList()
    }

	_getList(){
		DB.JiaoXue.getBiaoqianList().then(({list:tags})=>{
			this.setState({
				loading:false,
				tags,
			})
		},(res)=>{
			message.error(res.errorMsg);
		})
	}

	showInput = () => {
	  	this.setState({ inputTag: true }, () => this.refs.addinput.focus());
	}

	removeTag(_id){
		DB.JiaoXue.deleteBiaoQian({
			_id,
		}).then((data)=>{
			message.success('操作成功')
			this._getList()
		},({errorMsg})=>{
			message.error(errorMsg);
		})
	}

	addTag = () =>{
		const tag = this.state.inputValue;
		if(tag === '') {
			this.setState({
				inputTag: false,
      			inputValue: '',
			})
			return
		}
		DB.JiaoXue.addBiaoQian({
			name:tag
		})
		.then((data)=>{
			message.success('操作成功')
			this._getList()
			// const tags = this.state.tags;
			// tags.push(tag)
			this.setState({
				inputTag: false,
      			inputValue: '',
			})
		},({errorMsg})=>{
			message.error(errorMsg);
		})
	}

	render() {
		const {match} = this.props;
		const {tags} = this.state;
		return (
		<section className='course-wrap'>
			{/* <p id='topBanner'>标签管理</p>*/}
			<p id='title'>编辑课程</p>
			<div className="column-container" style={{padding:'0 20px'}}>
				{
					tags.map(itm=>(
						<Popconfirm
							key={itm._id}
							title="确认删除本类目吗？"
							onConfirm={this.removeTag.bind(this,itm._id)}
							okText="删除"
							cancelText="取消">
								<Tag
									style={{marginBottom:'20px'}}
									closable
									color="#44b549"
									onClose={(e)=>{
										e.preventDefault()
									}}
									>
									{itm.name}
								</Tag>
						</Popconfirm>
					))
				}

				{
					this.state.inputTag && <Input
						ref='addinput'
			            type="text"
			            size="default"
			            style={{ width: 78 }}
			            onChange={(e)=>this.setState({ inputValue:e.target.value})}
			            onBlur={this.addTag}
			            onPressEnter={this.addTag}
			        />
			  	}
				{
					!this.state.inputTag && <Button
					size="default"
					type="dashed"
					onClick={this.showInput}>+</Button>
				}

				<div style={{marginTop:20,textAlign:'center'}}>
				    <Spin spinning={this.state.loading} />
				</div>
				{
					// (tags.length === 0 && !this.state.loading) ? <Alert
					// 		style={{marginTop:20}}
					// 	    message="Warning"
					// 	    description="您还没有类目，点击添加"
					// 	    type="warning"
					// 	    showIcon
					// 	/>:null
				}
			</div>
		</section>)
	}
}

export default hot(module)(BiaoQian)
