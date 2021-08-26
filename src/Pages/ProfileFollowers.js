import React, {useState, useEffect, useContext} from 'react';
import api from '../Static/axios';
import './Following.css';
import { useParams } from 'react-router-dom';
import ListPerson from '../Components/Reusable/ListPerson';
import { NavLink } from 'react-router-dom';
import { BsChevronLeft } from 'react-icons/bs';
import BottomNav from '../Components/Navigation/BottomNav';
import { AuthContext } from '../Context/auth-context';
import ErrorModal from '../Components/Reusable/ErrorModal';
import Spinner from '../Components/Reusable/Spinner';

const ProfileFollowers = () => {
  const auth = useContext(AuthContext);
  const myId = auth.userId
  const params = useParams().username;
  const [followers, setFollowers] = useState();
  const [loading, setLoading] = useState(false)
  const [followedArr, setFollowedArr] = useState()
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false)

  async function getMe() {
    const res = await api.get(`users/${myId}`)
    setFollowedArr(res.data.user.following)

  }
  

  useEffect(() => {
    async function fetchFollowed() {
      const res = await api.get(`users/profile/followers/${params}`)
      console.log(res)
      setFollowers(res.data.users)
    }
      fetchFollowed()
      getMe()
  }, [params])

  const unfollow = async (friend) => {
    
    const res = await api.patch(
      `users/following/${myId}`, 
      {otherUser: friend.id}, 
      {headers: {'Content-Type': 'application/json'}})
    setFollowedArr(followedArr.filter(u => u !== friend.id))
    setError(`You unfollowed ${friend.userName}`)
    setShowError(true)
    setTimeout(function() {setShowError(false)}, 2000)
    
  }

  const follow = async (friend) => {
    const res = await api.patch(
      `users/following/${myId}`,
      { otherUser: friend.id },
    );
   setFollowedArr([...followedArr, friend.id])
   setError(`You followed ${friend.userName}`)
   setShowError(true)
   setTimeout(function() {setShowError(false)}, 2000)
  }
    
    
   
    

  
  return(
    <>
    {(!myId) && <Spinner />}
    {myId && <div>
      <ErrorModal 
      show={showError}
      children={<p className="errorText">{error}</p>}
      />
      <div className="following-header-wrapper">
        <NavLink to={`/user/${params}`} className="back-navlink"><BsChevronLeft className="following-back-icon"/></NavLink>
        <p>Followers</p>
      </div>

      {followers && followers.length !== 0 &&
      <div className="following-list-wrapper" style={{marginTop: "3rem"}}>
        {followers.map((user, index) => <ListPerson user={user} myId={myId}key={index} removeFollowing={unfollow} addFollowing={follow}  followedArr={followedArr}/>)}

      </div>}
    <BottomNav />
    </div>}
    </>
  )
}

export default ProfileFollowers;