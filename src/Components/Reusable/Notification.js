import React, {useState, useEffect} from 'react';
import './Notification.css';
import { NavLink } from 'react-router-dom';

const Notification  = ({user, activity, viewer, followHandler, followingArr }) => {

  const [time, setTime] = useState()
  const [timeDisplay, setTimeDisplay] = useState()
  
  useEffect(() => {

    const now = new Date();
    const time = now.getTime();
    if (time - activity.date.time <= 3600000) {setTimeDisplay("minutesAgo"); setTime(`${Math.floor((time - activity.date.time) / 60000)}m`)}
    else if (time - activity.date.time <= 86400000) {setTimeDisplay("today"); setTime(`${Math.floor((time - activity.date.time) / 3600000)}h`)}
    else if (time - activity.date.time <= 604800000) {setTimeDisplay("thisWeek"); setTime(`${Math.floor((time - activity.date.time) / 86400000)}d`)}
    else if (time - activity.date.time <= 31536000000) {setTimeDisplay("thisYear"); setTime(`${Math.floor((time - activity.date.time) / 604800000)}w`)}
    else {setTimeDisplay("longTime"); setTime(time - activity.date.time)}

  }, [activity])


  


  return (
    <div className="notification-wrapper">
      <div className="notification-portrait">
        <img alt="" src={user.image}/>
      </div>

      {activity.type === "follow" && 
      <div className="activity-follow-text">
      <p><NavLink to={`/user/${activity.userName}`}className="activity-user">{activity.userName}</NavLink> started following you. <strong style={{color: "#8e8e8e", margin:"0", fontWeight: "normal"}}>{time}</strong></p>  
      </div>}
       
     

        
      
      

      {activity.type === "comment" && 
      <div className="activity-comment-text">
      <p><NavLink to={`/user/${activity.userName}`}className="activity-user">{activity.userName}</NavLink> commented on your post: {activity.comment} <strong style={{color: "#8e8e8e", margin:"0", fontWeight: "normal"}}>{time}</strong></p>
      </div>
      }

      {activity.type === "like" &&
      <div className="activity-comment-text">
      <p><NavLink to={`/user/${activity.userName}`}className="activity-user">{activity.userName}</NavLink> liked your post. <strong style={{color: "#8e8e8e", margin:"0", fontWeight: "normal"}}>{time}</strong></p>
      </div>
      }
      




      {activity.type === "comment"  && 
      <div className="activity-post-image">
        <img alt="" src={activity.image} />
      </div>
      } 

      {activity.type === "like"  && 
      <div className="activity-post-image">
        <img alt="" src={activity.image} />
      </div>
      } 

      {activity.type === "follow" && <div>
      {followingArr.includes(user.id) ? <button onClick={() => followHandler(user.id)} className="activity-following-button">
        Following
      </button> :
      <button onClick={() => followHandler(user.id)} className="activity-follow-button">
        Follow
      </button>
      
    }

      </div>}
      
    </div>
  )
}

export default Notification;