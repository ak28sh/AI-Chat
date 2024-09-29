import React from 'react'
import Dashboard from '../dashboard/Dashboard'
import { Link } from 'react-router-dom'
import './homepage.css'

const Homepage = () => {
  return (
    <div className="homepage">
      <img src='/orbital.png' alt="" className="orbital" />

      <div className="left">

        <h1>AI CHAT</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat sint
          dolorem doloribus, architecto dolor.
        </h3>
        <Link to="/sign-in">Get Started</Link>
      </div>

      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            {/* <div className="bg"></div> */}
            <img src="/bg.png" alt="" className="bg" />
          </div>

          <img src="/bot.png" alt="" className="bot" />
        </div>
      </div>

      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default Homepage