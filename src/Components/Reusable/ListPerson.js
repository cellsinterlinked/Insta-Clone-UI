import React from 'react'
import './ListPerson.css';
import {NavLink} from 'react-router-dom'
import { IoPersonCircle } from 'react-icons/io5'

const ListPerson = ({user, followedArr, removeFollowing, addFollowing, myId}) => {

  

  return (
    <>
    {user && followedArr && <div className="listPerson-wrapper">
      <div className="list-person-wrapper1">
        <div className='list-person-image-wrapper'>
          {user.image ? <img alt="" src={user.image}/> : <IoPersonCircle style={{height:"100%", width:"100%", color:"#dbdbdb"}} />}
        </div>
        <NavLink to={`user/${user.userName}`} className="list-person-names-wrapper">
          <p >{user.userName}</p>
          {user.name && <p style={{color: "#8e8e8e", fontWeight: "400" }}>{user.name}</p>}
        </NavLink>
      </div>
     <div className="list-person-wrapper2">

        {followedArr.includes(user.id) && user.id !== myId && <button onClick={() => removeFollowing(user)}className="list-following-button">
          Following
        </button>}
        
        {!followedArr.includes(user.id) && user.id !== myId &&<button onClick={() => addFollowing(user)} className="list-follow-button">
          Follow
        </button> }

       

      </div>
        

    </div>}
    </>
  )
}

export default ListPerson;