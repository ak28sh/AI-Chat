import React from 'react'
import './dashboard.css'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const VITE_API_URL = "http://localhost:2000"


const Dashboard = () => {

  const queryClient = useQueryClient()
  const navigate = useNavigate()


  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${VITE_API_URL}/api/chats`, {
        method: 'POST',
        credentials: "include",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ text })
      }).then((res) => res.json())
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
      navigate(`/dashboard/chats/${id}`)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = e.target.text.value
    console.log(text)
    if (!text) 
      return

    mutation.mutate(text)
    
  }

  return (
    <div className='dashboardPage'>
      <div className="texts">
        <div className="logo">
          <img src='/logo.png' alt="" />
          <h1>AI CHAT</h1>
        </div>
        <div className="options">
          <div className="option">
            <img src='/chat.png' alt=""/>
            <span>Create a new Chat</span>
          </div>
          <div className="option">
            <img src='/code.png' alt=""/>
            <span>Help with code</span>
          </div>
          <div className="option">
            <img src='/image.png' alt=""/>
            <span>Analyse image</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder='Ask me anything...'/>
          <button>
            <img src="/arrow.png" alt=""/>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard