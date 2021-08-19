import React, {useState, useEffect, useContext} from 'react'
import api from '../Static/axios';
import './Following.css';
import { BsChevronLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom'
import ListPerson from '../Components/Reusable/ListPerson';
import { IoPersonAddOutline } from 'react-icons/io5' ;
import BottomNav from '../Components/Navigation/BottomNav';
import { AuthContext } from '../Context/auth-context';

const Followers = () => {
  const auth = useContext(AuthContext)
  const myId = auth.userId
  const [popular, setPopular] = useState()
  const [followers, setFollowers] = useState()
  const [people, setPeople] = useState(true)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFollowing() {
      const res = await api.get(`users/followers/${myId}`)
      console.log(res)
      if (res.data.users.length > 0) {
      setFollowers(res.data.users) }
        
    }
      fetchFollowing()
  },[loading, popular])

  useEffect(() => {
    async function fetchPopular() {
      const res = await api.get('users')
      console.log(res);
      const newArr = res.data.users.filter(user => user.id !== myId && user.followers.includes(myId) === false)
      setPopular(newArr)
    }
      fetchPopular()
  },[loading, followers])


  const removeFollowing = async (friend) => {
    const res = await api.patch(`users/following/${myId}`, {otherUser: friend.id}, {headers: {'Content-Type': 'application/json'}})
    console.log(res)
    setLoading(!loading)
  }
    
    
   
    

  const addFollowing = async (friend) => {
    const res = await api.patch(`users/following/${myId}`, {otherUser: friend.id}, {headers: {'Content-Type': 'application/json'}})
    console.log(res);
    setLoading(!loading)
  }



  return (
    <div>
      <div className="following-header-wrapper">
        <NavLink to="/account" className="back-navlink"><BsChevronLeft className="following-back-icon"/></NavLink>
        <p>Followers</p>
      </div>
    
      {followers && followers.length !== 0 && 
      <div className="following-list-wrapper">
        {followers.map((user, index) => <ListPerson user={user} key={index} followed={true} removeFollowing={removeFollowing}/>)}

      </div>}

      {!followers && 
      <div className="no-followers-wrapper">
        <div className="no-followers-circle">
          <IoPersonAddOutline className="no-followers-icon" />
        </div>

        <h1>Followers</h1>
        <p>You'll see all the people who follow you here</p>


      </div>
      }

      <div className="follow-suggestions-text">
      <p>Suggestions For You</p>
      </div>

      {popular && popular.length !== 0 &&
      <div className="following-list-wrapper2">
        {popular.map((user, index) => <ListPerson user={user} key={index} followed={false} addFollowing={addFollowing} />)}
      </div>
      }

      
      

      <BottomNav />
    </div>
  )
}

export default Followers