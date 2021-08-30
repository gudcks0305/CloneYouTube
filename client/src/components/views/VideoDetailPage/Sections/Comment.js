import axios from 'axios';
import React , {useState} from 'react';
import {useSelector} from 'react-redux';
import SingleComment from './SingleComment';

function Comment(props) {
    //console.log(props)
    const user = useSelector(state =>state.user)
    const [CommentValue, setCommentValue] = useState("")
    const handleClick = (event) =>{
        setCommentValue(event.currentTarget.value)
    }
    const onSumit =(event) =>{
        event.preventDefault();

        const variable = {
            content : CommentValue,
            writer : user.userData._id,
            postId : props.postId
        }
        
        axios.post('/api/comment/saveComment', variable)
        .then(response => {
            if(response.data.success){
                 console.log(response.data.result)
            }else{
                alert('코멘트 저장 못했어요')
            }
        })
    }
    console.log(props)
    return (
        <div>
            <br></br>

            <p>Replies</p>
            <hr></hr>
            
            {props.commentLists && props.commentLists.map((comment ,index)=>(
                <SingleComment  comment = {comment} postId = {props.postId}/>
            ))}
            
            <form style= {{display : 'flex'}} onSubmit={onSumit}>
                <textarea
                    style={{width :'100%' , borderRadius :'5px'}}
                    onChange ={handleClick}
                    value = {CommentValue}
                    placeholder = "코멘트를 작성해 주세요"
                >
                </textarea>
                <br></br>
                <button style={{width:'20%',height: '52px'}} onClick={onSumit}>submit</button>
            </form>
        </div>
    )
}

export default Comment
