import React, {useState, useEffect, useContext} from 'react'
import api from '../Static/axios';
import './Following.css';
import { BsChevronLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom'
import ListPerson from '../Components/Reusable/ListPerson';
import { IoPersonAddOutline } from 'react-icons/io5' ;
import BottomNav from '../Components/Navigation/BottomNav';
import { AuthContext } from '../Context/auth-context';
import ErrorModal from '../Components/Reusable/ErrorModal';
import Spinner from '../Components/Reusable/Spinner';

const Followers = () => {
  const auth = useContext(AuthContext)
  const myId = auth.userId
  const [popular, setPopular] = useState()
  const [followers, setFollowers] = useState()
  const [followedArr, setFollowedArr] = useState()
  const [people, setPeople] = useState(true)
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState()
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false);


  async function fetchFollowers() {
    const res = await api.get(`users/followers/${myId}`)
    if (res.data.users.length > 0) {
    setFollowers(res.data.users) }
      
  }

  async function fetchMe() {
    const res = await api.get(`users/${myId}`);
    setMe(res.data.user)
    setFollowedArr(res.data.user.following)
  }

  async function fetchPopular() {
    const res = await api.get(`users/popular/${myId}`)
    console.log(res.data.users)
    setPopular(res.data.users)
    
  }



  

  useEffect(() => {
      fetchMe()
      fetchFollowers()
      fetchPopular()
  },[])

  
  async function unfollow(friend) {
    const res = await api.patch(
      `users/following/${myId}`,
      { otherUser: friend.id },
    );
    setFollowedArr(followedArr.filter(u => u !== friend.id))
    setError(`You unfollowed ${friend.userName}`)
    setShowError(true)
    setTimeout(function() {setShowError(false)}, 2000)
    
  }

  async function follow(friend) {
    const res = await api.patch(
      `users/following/${myId}`,
      { otherUser: friend.id },
    );
   setFollowedArr([...followedArr, friend.id])
   setError(`You followed ${friend.userName}`)
   setShowError(true)
   setTimeout(function() {setShowError(false)}, 2000)
   
  }

  


  return (
    <>
    {( !me || !myId || !popular) && <Spinner />}
    {popular && me && myId && <div>
      <ErrorModal
     show={showError}
     children={<p className="errorText">{error}</p>}
    />
      <div className="following-header-wrapper">
        <NavLink to="/account" className="back-navlink"><BsChevronLeft className="following-back-icon"/></NavLink>
        <p>Followers</p>
      </div>
    
      {followers && followers.length !== 0 && 
      <div className="following-list-wrapper">
        {followers.map((user, index) => <ListPerson user={user} key={index} followed={true} removeFollowing={unfollow} followedArr={followedArr}/>)}

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
        {popular.map((user, index) => <ListPerson user={user} key={index} followed={false} addFollowing={follow} followedArr={followedArr} />)}
      </div>
      }

      
      

      <BottomNav />
    </div>}
    </>
  )
}

export default Followers