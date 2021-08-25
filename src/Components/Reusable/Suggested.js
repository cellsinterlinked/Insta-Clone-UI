import React from 'react';
import './Suggested.css';
import { IoClose } from 'react-icons/io5';

const Suggested = ({ users, followingArr, removeItem, suggestedFollow, suggestedUnfollow }) => {

  


  return (
   
    <div className="suggested-wrapper">
      {users.map((user, index) => <div key={index} className="suggested-item">
        <div className="box">
      <IoClose className="suggested-close" onClick={() => removeItem(user.id)}/>
          <div className="suggested-portrait">
            <img alt="" src={user.image}/>
          </div>
            <p>{user.userName}</p>
            <p style={{color: "#8e8e8e"}}>{user.name}</p>
            {followingArr && !followingArr.includes(user.id) && <button className="suggested-follow-button" onClick={() => suggestedFollow(user)}>Follow</button>}
            {followingArr && followingArr.includes(user.id) && <button className="suggested-following-button" onClick={() => suggestedUnfollow(user)}>Following</button>}
        </div>
      </div>)}
      
    </div>
  );
};

export default Suggested;
