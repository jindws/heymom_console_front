import React, {Component} from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
import {Button,message} from 'antd'
import {hot} from 'react-hot-loader'
import ReactQuill from 'react-quill'
import UUID from 'uuid/v1'
import DB from '@DB'

class About extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modules: {
                toolbar: {
					container:[
				     [{ 'header': [1, 2,3,4,5, false] }],
				     ['bold', 'italic', 'underline','strike', 'blockquote'],
				     [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                     [{ 'size': ['small', false, 'large', 'huge'] }],
				     ['link', 'image'],
                     [{ 'color': [] }, { 'background': [] }],
				     ['clean']
				 	],
                    handlers: {
                        // handlers object will be merged with default handlers object
						'image': (e)=> {
					    	let input = document.createElement('input')
					    	input.type = 'file'
					    	// console.log(input)

					    	input.onchange = this.uploadCallback
					    	input.click()
                        }
                    }
                }
            },
        }
    }

    componentWillMount(){
        DB.About.get().then(data=>{
            this.setState({
                desc:data.message
            })
        },({errorMsg})=>{
            message.error(errorMsg)
        })
    }

    uploadCallback = (e) =>{
        const t = this;
        const {editkc={}} = this.state

        const file = e.target.files[0]
        // return new Promise(
            // (resolve, reject) => {
        const fileName = file.name
        let formData = new FormData()
        formData.append('files',file)
        fetch('/api/uploadfile',{
            method: "POST",
            body: formData
        }).then(data=>data.json()).then(({data})=>{
            const link = data.src
            let editor = t.refs.editor2.getEditor()
            let sel = editor.getSelection()
            editor.clipboard.dangerouslyPasteHTML(sel.index, `<img src="${link}"/>` || '');
        })
    }

    render() {
        const {desc=''} = this.state
        return <section className='about'>
            <p id='topBanner'>关于我们</p>
            <div>
                <span>介绍文字:</span>
                <ReactQuill
                    ref='editor2'
                    modules={this.state.modules}
                    value={desc}
                    onChange={(desc='')=>{
                        this.setState({
                            desc
                        })
                    }}
                />
            </div>
            <Button type='primary' onClick={()=>{
                DB.About.save({
                    message:desc,
                }).then(()=>{
                    message.success('保存成功')
                },({errorMsg})=>{
                    message.error(errorMsg)
                })
            }}>确认</Button>
        </section>
    }
}

export default hot(module)(About)
