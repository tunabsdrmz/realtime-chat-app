import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const Chat = ({socket, username, room}) => {
    const [message, setMessage] = useState('')
    const [messageList, setMessageList] = useState([])
    useEffect(() =>{
        socket.on('messageReturn', (data) =>{
            setMessageList((prev) => [...prev, data])
        })
    },[socket])
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const sendMessage = async() => {
        const messageContent = {
            username: username,
            message: message,
            room: room,
            hours: hours,
            minutes: minutes
        }
       await socket.emit('message', messageContent)
       setMessageList((prev) => [...prev, messageContent])
       setMessage('')
    }
  return (
    <div className='flex items-center justify-center h-full '>
        <div className='w-1/2 h-[600px] bg-white relative '>
        <div className='w-full h-16 bg-gray-700 flex items-center p-3'>
            <div className='w-12 h-12 bg-white rounded-full'></div>
            <h1 className='pl-3 tracking-widest text-lg font-bold'>{username}</h1>
        </div>
        <div className='w-full h-[400px] overflow-y-auto'>
            {
                messageList && messageList.map((msg, i) => (
                    <div className={`${username === msg.username ? 'flex justify-end' : ''}`}>
                    <div className={ `${username === msg.username ? ' bg-blue-600 rounded-br-none w-2/3 p-2 text-white text-sm m-2 rounded-xl ' : ' bg-green-600 rounded-bl-none w-2/3  p-2 text-white text-sm m-2 rounded-xl '}`}>
                         <div>{msg.message}</div>
                         <div className='w-full flex justify-end text-xs'>{msg.username +' - '+ msg.hours + '-' + msg.minutes}</div>
                    </div>
                </div>
                ))
            }
        </div>
            <div className='absolute bottom-0 left-0 w-full'>
                <input value={message} onChange={e => setMessage(e.target.value)} className='w-3/4 h-12 border p-3 outline-none' type='text' placeholder='write something'/>
                {
                    message !== '' ?
                    <button onClick={sendMessage} className='w-1/4 bg-indigo-600 text-white h-12 hover:opacity-70'>SEND</button>
                    :
                    <button className='w-1/4 bg-indigo-600 text-white h-12 opacity-50'>SEND</button>
                }

            </div>
        </div>
    </div>
  )
}

export default Chat