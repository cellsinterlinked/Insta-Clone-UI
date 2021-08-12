import React, { useState, useEffect } from 'react';
import './Activity.css';
import { BsHeart } from 'react-icons/bs';
import BottomNav from '../Components/Navigation/BottomNav';
import api from '../Static/axios';
import Notification from '../Components/Reusable/Notification'

const Activity = () => {
  const myId = '60f701da7c0a002afd585c03';
  const [user, setUser] = useState()
  const [users, setUsers] = useState()

  useEffect(() => {
    async function getUser() {
      const res = await api.get(`users/${myId}`)
      console.log(res)
      setUser(res.data.user)
      console.log(res.data.user)
    }
    getUser()
  },[])

  useEffect(() => {
    async function getUsers() {
      const res = await api.get(`users/`)
      console.log(res)
      setUsers(res.data.users)
      console.log(res.data.users)
    }
    getUsers()
  }, [])


  return (
    <div className="activity-wrapper">
      <div className="activity-header">
        <p>Activity</p>
      </div>

    {user && user.activity.length === 0 && <div className="no-activity-wrapper">
      <div className="no-activity-circle">
        <BsHeart className="no-activity-icon"/>
      </div>
      <h1>Activity On Your Posts</h1>
      <p>When someone likes or comments on one of your posts, you'll see it here.</p>
      <a href="/create">Share your first photo.</a>
    </div>}

    {user && users && user.activity.length !== 0 && 
    <div className="activity-list-wrapper">
      {user.activity.map((activity, index) => 
        <Notification key={index} activity={activity} user={users.find(user => user.id === activity.user)} viewer={user}/>
        
      )}
    </div>
    
    }
    <BottomNav />
    </div>
  )
}

export default Activity;