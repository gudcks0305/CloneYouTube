import React,{useState } from 'react'
import {Comment , Avatar ,Button ,Input} from 'antd'
import axios from 'axios'
import {useSelector} from 'react-redux';
import LikeDislikes from './LikeDislikes';

function SingleComment(props) {

    const user = useSelector(state =>state.user)
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
    const onClickReplyOpen = () =>{
        setOpenReply(!OpenReply)
    }

    const actions = [
        <LikeDislikes userId = {localStorage.getItem('userId')} commentId= {props.comment._id}></LikeDislikes>,
        <span onClick={onClickReplyOpen} key = "comment-basic-reply-to">Reply to</span>
    ]
    const onHandleChange = (event) =>{
        //console.log(event.currentTarget);
        setCommentValue(event.currentTarget.value)
    }
    
   /*  const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    } */
    //console.log(CommentValue)
    const onSumit = (event) =>{
        event.preventDefault();
        const variable = {
            content : CommentValue,
            writer : user.userData._id,
            postId : props.postId,
            responseTo : props.comment._id
        }
        axios.post('/api/comment/saveComment', variable)
        .then(response => {
            if(response.data.success){
                setCommentValue("");
                setOpenReply(!OpenReply)
                props.refreshFuntion(response.data.result)
                 
            }else{
                alert('코멘트 저장 못했어요')
            }
        })
    }
    return (
        <div>
            <Comment
                actions = {actions}
                author = {props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt/>}
                content = {
                <p>
                      {props.comment.content}
                </p>}>

            </Comment>
            {OpenReply &&
            
                <form style= {{display : 'flex'}} onSubmit ={onSumit}>
                    <textarea
                        style={{width :'100%' , borderRadius :'5px'}}
                        onChange = {onHandleChange}
                        value ={CommentValue}
                        placeholder = "코멘트를 작성해 주세요"
                    >
                    </textarea>
                    <br></br>
                    <button style={{width:'20%',height: '52px'}} onClick ={onSumit}>submit</button>
                </form>
            }
           
        </div>
    )
}

export default SingleComment
