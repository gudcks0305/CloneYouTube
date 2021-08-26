import React , { useState } from 'react'
import {Typography , Button, Form , message , Input} from 'antd'
import  {PlusOutlined}from '@ant-design/icons';
import Dropzone from 'react-dropzone'
import axios from 'axios';
import {useSelector} from 'react-redux'
const {TextArea} = Input;
const { Title } = Typography;
const PrivateOptions = [
    {value :0, label : "Private"},
    {value :1, label : "Public"}
]

const CategoryOptions = [
    {value :0, label : "Film & Animation"},
    {value :1, label : "Auto & Vehicle"},
    {value :2, label : "Music"},
    {value :3, label : "Pet & Animation"}
]
    

function VideoUploadPage(props) {
    const user = useSelector(state => state.user)
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description , setDescription] = useState("");
    const [Private , setPrivate] = useState(0);
    const [Category , setCategory] = useState("Film & Animaition");
    const [FilePath,setFilePath] = useState("");
    const [Duration , setDuration] = useState("")
    const [ThumbnailPath ,setThumbnailPath] = useState("")
    const onTitleChange = (event) =>{
        console.log(event.currentTarget)
        setVideoTitle(event.currentTarget.value)

    }
    const onDesCriptionChange = (event) =>{
        setDescription(event.currentTarget.value)

    }
    const onPrivateChange = (event) =>{
        setPrivate(event.currentTarget.value)

    }
    const onCategoryChange = (event) =>{
        setCategory(event.currentTarget.value)

    }
    const onDrop = (files) =>{
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        console.log(files)
        formData.append("file", files[0])

        axios.post('/api/video/uploadfiles', formData, config)
        .then(response =>{
            if(response.data.success){
                console.log(response.data)
                let variable = {
                    url : response.data.url,
                    fileName : response.data.fileName
                }

                setFilePath(response.data.url)

                axios.post('/api/video/thumbnail' , variable).then(response => {
                    if(response.data.success){
                            console.log(response.data)
                            setDuration(response.data.fileDuration);
                            setThumbnailPath(response.data.url)
                    }else{
                        alert('썸네일 생성 실패')
                    }
                })



            }else{
                alert('비디오 업로드 실패')
            }
        })
    }

    const onSumit = (e) => {
        e.preventDefault();
        const variable = {
            writer : user.userData._id, 
            title :VideoTitle ,
            description: Description, 
            privace : Private,
            filePath : FilePath,
            category : Category,
            duration : Duration,
            thumbnail :ThumbnailPath
        }
        axios.post('/api/video/uploadVideo', variable)
        .then(response => {
            if(response.data.success){
                
                message.success('성공적으로 업로드를 했습니다.')
                setTimeout(()=>{
                    props.history.push('/')
                }, 3000)
            
            }
            else {
                alert('비디오 업로드에 실패 했습니다.')
            }
        })
    }
    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit = {onSumit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize ={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <PlusOutlined style={{ fontSize: '3rem' }}/>
                            </div>
                        )}
                    </Dropzone>
                    
                    {ThumbnailPath &&
                     <div>
                        <img src= {`http://localhost:5000/${ThumbnailPath}`} alt ="Thumbnail"></img>
                    </div>

                    }
                   
                    
                </div>

                <br /><br />
                <label>Title</label>
                <Input
                    onChange ={onTitleChange}
                    value= {VideoTitle}
                />
                <br /><br />
                <label>Description</label>
                <TextArea
                    onChange ={onDesCriptionChange}
                    value = {Description}
                />
                <br /><br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item,index)=>(
                            <option key={index} value={item.value}>{item.label}</option>
                            ))}
                </select>
                <br /><br />

                <select onChange={onCategoryChange}>
                {CategoryOptions.map((item,index)=>(
                            <option key={index} value={item.value}>{item.label}</option>
                            ))}
                </select>
                <br /><br />

                <Button type="primary" size="large" onClick = { onSumit}>
                    Submit
            </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage
