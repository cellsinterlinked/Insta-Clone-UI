import React, {useState, useEffect} from 'react';
import api from '../Static/axios';
import './Following.css';
import { useParams } from 'react-router-dom';
import ListPerson from '../Components/Reusable/ListPerson';
import { NavLink } from 'react-router-dom';
import { BsChevronLeft } from 'react-icons/bs';
import './Following.css';
import BottomNav from '../Components/Navigation/BottomNav'

const ProfileFollowing = () => {
  const myId = "60f701da7c0a002afd585c03"
  const params = useParams().username;
  const [following, setFollowing] = useState();
  const [loading, setLoading] = useState(false)
  const [people, setPeople] = useState(true);

  useEffect(() => {
    async function fetchFollowed() {
      const res = await api.get(`users/profile/following/${params}`)
      console.log(res)
      setFollowing(res.data.users)
    }
      fetchFollowed()
  }, [params, loading])

  const removeFollowing = async (friend) => {
    
    const res = await api.patch('users/following/60f701da7c0a002afd585c03', {otherUser: friend.id}, {headers: {'Content-Type': 'application/json'}})
    console.log(res)
    setLoading(loading)
  }
    
    
   
    

  
  return(
    <div>
      <div className="following-header-wrapper">
        <NavLink to={`/user/${params}`} className="back-navlink"><BsChevronLeft className="following-back-icon"/></NavLink>
        <p>Following</p>
      </div>

      <div className="following-options-wrapper">
        <div style={{borderBottom: people === true ? "1px solid black" : " 1px solid #dbdbdb" }}className="following-options-button" onClick={() => setPeople(true)}>
          <p style={{color: people === true ? "black" : "#8e8e8e" }}>PEOPLE</p>
        </div>
        <div style={{borderBottom: people === false ? "1px solid black" : " 1px solid #dbdbdb" }}className="following-options-button" onClick={() => setPeople(false)}>
          <p style={{color: people === false ? "black" : "#8e8e8e" }}>HASHTAGS</p>
        </div>
      </div>
    
      {following && following.length !== 0 && 
      <div className="following-list-wrapper">
        {following.map((user, index) => <ListPerson user={user} myId={myId} key={index} followed={true} removeFollowing={removeFollowing}/>)}

      </div>}

    <BottomNav />
    </div>
  )
}

export default ProfileFollowing;