import axios from 'axios'
import React,{useEffect , useState} from 'react'

function Subscribe(props) {


    const [subscribeNumber, setsubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)


    useEffect(() => {
        let variable = {
            userTo : props.userTo
        }
       axios.post('/api/subscribe/subscribeNumber',variable)
       .then(response => {
           if(response.data.success){
                setsubscribeNumber(response.data.subscribeNumber);
           }else{
               alert('구독자 수 정보를 가져오지 못 했습니다.')
           }
       })

       let subscribedVariable = {
        userTo : props.userTo,
        userFrom : props.userFrom
    }
    
       axios.post('/api/subscribe/subscribed',subscribedVariable)
       .then(response =>{
           if(response.data.success){
                setSubscribed(response.data.subscribed)
           }else{
               alert('구독정보를 가져오지 못했습니다.')
           }
       })
    }, [])


    const onSubscirbe = () =>{
        let subscribedVariable = {
            userTo : props.userTo,
            userFrom :  props.userFrom
        }
        if(Subscribed){
            axios.post('/api/subscribe/unSubscribe',subscribedVariable)
            .then(response =>{
                if(response.data.success){
                    setsubscribeNumber(subscribeNumber -1);
                    setSubscribed(!Subscribed)
                }
                else{
                    alert('구독 취소 하는데에 실패했습니다.')
                }
            })
        }
        else{
            axios.post('/api/subscribe/subscribe',subscribedVariable)
            .then(response =>{
                if(response.data.success){
                    setsubscribeNumber(subscribeNumber +1);
                    setSubscribed(!Subscribed)
                }
                else{
                    alert('구독  하는데에 실패했습니다.')
                }
            })
        }
    }

    return (
        <div>
            <button
            style={{backgroundColor:`${Subscribed ? 'gray' : 'red'}`,borderRadius:'4px', color:'white', padding:'10px 16px', fontWeight:'500'
                    ,fontSize:'1rem' , textTransform:'uppercase'
            }}
                onClick= {onSubscirbe}
            >
                {subscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
            
        </div>
    )
}

export default Subscribe
