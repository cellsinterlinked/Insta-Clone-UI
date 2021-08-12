import React from 'react';
import './Notification.css';
import { NavLink } from 'react-router-dom';

const Notification  = ({user, activity, viewer }) => {
  return (
    <div className="notification-wrapper">
      <div className="notification-portrait">
        <img alt="" src={user.image}/>
      </div>
      {activity.type === "follow" && 
      <div className="activity-follow-text">
      <p><NavLink to={`/user/${activity.userName}`}className="activity-user">{activity.userName}</NavLink> started following you.</p>  
      </div>}

      {viewer.following.includes(user.id) ? <button className="activity-following-button">
        Following
      </button> :
      <button className="activity-follow-button">
        Follow
      </button>
      
    }
      
    </div>
  )
}

export default Notification;