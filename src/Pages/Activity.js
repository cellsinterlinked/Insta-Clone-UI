import React, { useState, useEffect } from 'react';
import './Activity.css';
import { BsHeart } from 'react-icons/bs';
import BottomNav from '../Components/Navigation/BottomNav';
import api from '../Static/axios';
import Notification from '../Components/Reusable/Notification'
import { isYesterday } from 'date-fns'
import { isThisWeek } from 'date-fns'
import { isThisMonth } from 'date-fns'
import { isSameYear } from 'date-fns'
import { isToday } from 'date-fns'
import { parse } from 'date-fns'
import { parseJSON } from 'date-fns'



const Activity = () => {
  const myId = '60f701da7c0a002afd585c03';
  const [user, setUser] = useState()
  const [users, setUsers] = useState()
  const [todayArr, setTodayArr] = useState([])
  const [yesterdayArr, setYesterdayArr] = useState([])
  const [weekArr, setWeekArr] = useState([])
  const [monthArr, setMonthArr] = useState([])
  const [yearArr, setYearArr] = useState([])
  const [loading, setLoading] = useState(false)
  const [followingArr, setFollowingArr] = useState([])


 

  useEffect(() => {
    async function getUser() {
      const res = await api.get(`users/${myId}`)
      setUser(res.data.user)
      setTodayArr(res.data.user.activity.filter(activity => isToday(parseJSON(activity.date.fullDate)) === true))
      setYesterdayArr(res.data.user.activity.filter(activity => isYesterday(parseJSON(activity.date.fullDate)) === true))
      setWeekArr(res.data.user.activity.filter(activity => isThisWeek(parseJSON(activity.date.fullDate)) === true && isToday(parseJSON(activity.date.fullDate)) === false && isYesterday(parseJSON(activity.date.fullDate)) === false))
      setMonthArr(res.data.user.activity.filter(activity => isThisMonth(parseJSON(activity.date.fullDate)) === true && isThisWeek(parseJSON(activity.date.fullDate)) === false))
      setYearArr(res.data.user.activity.filter(activity => isSameYear(parseJSON(activity.date.fullDate), new Date()) === true && isThisMonth(parseJSON(activity.date.fullDate)) === false))

      setFollowingArr(res.data.user.following)
      console.log(res.data.user.following)
    }
    getUser()
  },[loading])


  const holyShit = () => {
    
  }

    

  useEffect(() => {
    async function getUsers() {
      const res = await api.get(`users/`)
      setUsers(res.data.users)
      
    }
    getUsers()
  }, [])

  async function adjustFollow(user) {
   const res  = await api.patch('users/following/60f701da7c0a002afd585c03',
   { otherUser: user },)
   if (followingArr.includes(user)) {
    setFollowingArr(followingArr.filter(u => u !== user))
  } else {
    setFollowingArr([...followingArr, user])
  }
  }


  const followHandler =  async (user) => {
    await adjustFollow(user);
    console.log(followingArr)
  }

  


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
    {todayArr && todayArr.length > 0 && <div className="activity-time-wrapper">
    <p className="activity-time-header">Today</p>
       {
         todayArr.map((activity, index) => <Notification followingArr={followingArr} followHandler={followHandler} key={index} activity={activity} user={users.find(user => user.id === activity.user)} viewer={user}/>)
       }
    </div>}

    {yesterdayArr && yesterdayArr.length > 0 &&<div className="activity-time-wrapper">
    <p className="activity-time-header">Yesterday</p>  
       {
         yesterdayArr.map((activity, index) => <Notification followingArr={followingArr} followHandler={followHandler} key={index} activity={activity} user={users.find(user => user.id === activity.user)} viewer={user}/>)
       }
    </div>}

    {weekArr && weekArr.length > 0 &&<div className="activity-time-wrapper">
    <p className="activity-time-header">This Week</p>
       {
         weekArr.map((activity, index) => <Notification followingArr={followingArr} followHandler={followHandler} key={index} activity={activity} user={users.find(user => user.id === activity.user)} viewer={user}/>)
       }
    </div>}

    {monthArr && monthArr.length > 0 &&<div className="activity-time-wrapper">   
    <p className="activity-time-header">This Month</p>
       {
       monthArr.map((activity, index) => <Notification followingArr={followingArr} followHandler={followHandler} key={index} activity={activity} user={users.find(user => user.id === activity.user)} viewer={user}/>)
       }
    </div>}

    {yearArr && yearArr.length > 0 &&<div className="activity-time-wrapper">
    <p className="activity-time-header">This Year</p>
       {
        yearArr.map((activity, index) => <Notification followingArr={followingArr} followHandler={followHandler} key={index} activity={activity} user={users.find(user => user.id === activity.user)} viewer={user}/>)
       }
    </div>}
   
    </div>
    
  }
    <BottomNav />
    </div>
  )
}

export default Activity;