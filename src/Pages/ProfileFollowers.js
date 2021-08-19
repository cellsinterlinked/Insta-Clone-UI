import React, {useState, useEffect, useContext} from 'react';
import api from '../Static/axios';
import './Following.css';
import { useParams } from 'react-router-dom';
import ListPerson from '../Components/Reusable/ListPerson';
import { NavLink } from 'react-router-dom';
import { BsChevronLeft } from 'react-icons/bs';
import BottomNav from '../Components/Navigation/BottomNav';
import { AuthContext } from '../Context/auth-context';

const ProfileFollowers = () => {
  const auth = useContext(AuthContext);
  const myId = auth.userId
  const params = useParams().username;
  const [followers, setFollowers] = useState();
  const [loading, setLoading] = useState(false)
  

  useEffect(() => {
    async function fetchFollowed() {
      const res = await api.get(`users/profile/followers/${params}`)
      console.log(res)
      setFollowers(res.data.users)
    }
      fetchFollowed()
  }, [params, loading])

  const removeFollowing = async (friend) => {
    
    const res = await api.patch(`users/following/${myId}`, {otherUser: friend.id}, {headers: {'Content-Type': 'application/json'}})
    console.log(res)
    setLoading(loading)
  }
    
    
   
    

  
  return(
    <div>
      <div className="following-header-wrapper">
        <NavLink to={`/user/${params}`} className="back-navlink"><BsChevronLeft className="following-back-icon"/></NavLink>
        <p>Followers</p>
      </div>

      {followers && followers.length !== 0 && 
      <div className="following-list-wrapper" style={{marginTop: "3rem"}}>
        {followers.map((user, index) => <ListPerson user={user} key={index} removeFollowing={removeFollowing}/>)}

      </div>}
    <BottomNav />
    </div>
  )
}

export default ProfileFollowers;