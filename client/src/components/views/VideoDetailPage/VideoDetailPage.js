import React,{useEffect, useState}from 'react';
import {Row, Col, Avatar , List} from 'antd';
import axios from 'axios';
import SideVideo from "./Sections/SideVideo.js";
import  Subscribe  from './Sections/Subscribe';
import Comment from './Sections/Comment'
function VideoDetailPage(props) {

    const videoId = props.match.params.videoId;
    //console.log(videoId)
    const variable = {videoId:videoId}
    const [Comments, setComments] = useState([])

    const [VideoDetail, setVideoDetail] = useState([])
   // const [Comments, setComments] = useState();

    
    useEffect(() => {
       axios.post('/api/video/getVideoDetail',variable)
       .then(response=>{
           if(response.data.success){
                //console.log(response)
                setVideoDetail(response.data.videoDetail);
           }
           else{
               alert('비디오 정보 가져오기 실패')
           }
       })


       axios.post('/api/comment/getComments',variable)
            .then(response => {
                if(response.data.success) {
                        //console.log("코멘트 정보...",response.data.comments)
                        setComments(response.data.comments)
                } else {
                    alert('코멘트 정보 찾기 실패 ')
                }
       })

       

    }, [])

    if(VideoDetail.writer){
        //console.log(VideoDetail)
        const subscriptionButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo = {VideoDetail.writer._id} userFrom ={localStorage.getItem('userId')}/>
        

        return (
            <Row gutteer ={[16,16]}>
                <Col lg ={18} xs ={24}>
                <div style={{width: '100%', padding:'3rem 4em'}}>
                  <video  style={{width: '100%'}} src= {`http://localhost:5000/${VideoDetail.filePath}`} controls></video>
                  <List.Item
                      actions = {subscriptionButton}
                  >
                      <List.Item.Meta
                          avatar = {<Avatar src = {VideoDetail.writer.image}></Avatar>}
                          title = {VideoDetail.writer.name}
                          description = {VideoDetail.description}
                      >
      
                      </List.Item.Meta>
                  </List.Item>
                  <Comment commentLists ={Comments} postId ={videoId}></Comment>
                </div>
                </Col>
                <Col lg={6} xs={24}>
                   <SideVideo></SideVideo>
                </Col>
            </Row>
          )
    }else{
        return (
            <div>
                ...
            </div>
        )
    }
   
}

export default VideoDetailPage
