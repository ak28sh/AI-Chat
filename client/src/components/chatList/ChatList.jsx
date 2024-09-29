import React from 'react'
import './chatList.css'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const VITE_API_URL = 'http://localhost:2000'


const ChatList = () => {

    // Fetch chat list for an user
    const { isPending, error, data } = useQuery({
        queryKey: ['userChats'],
        queryFn: () =>
          fetch(`${VITE_API_URL}/api/userChats`, {
            credentials: "include"
          }).then((res) =>
            res.json(),
          ),
    })

    console.log(data)
    

    return (
        <div className='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/">Explore AI Chat</Link>
            <Link to="/">Contact</Link>
            <hr />
            <div className='list'>
                {
                    isPending ? "Loading..." :
                    error ? "Something went wrong" :
                    data?.map((chat) => (
                        <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                            {chat.title}
                        </Link>
                    ))  
                }
            </div>
            <hr />
            <div className='upgrade'>
                <img src="/logo.png" />
                <div className="texts">
                    <span>Upgrade to Lama AI Pro</span>
                    <span>Get unlimited access to all features</span>
                </div>
            </div>
        </div>
    )
}

export default ChatList