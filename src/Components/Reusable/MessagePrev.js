import React, {useEffect, useState} from 'react';
import './MessagePrev.css';
import { NavLink } from 'react-router-dom';
import { IoPersonCircle } from 'react-icons/io5'

const MessagePrev = ({convo, user}) => {
  const [time, setTime] = useState()
  const [timeDisplay, setTimeDisplay] = useState()
  
  useEffect(() => {

    const now = new Date();
    const time = now.getTime();
    if (time - convo.messages[convo.messages.length-1].date.time <= 3600000) {setTimeDisplay("minutesAgo"); setTime(time - convo.messages[convo.messages.length-1].date.time)}
    else if (time - convo.messages[convo.messages.length-1].date.time <= 86400000) {setTimeDisplay("today"); setTime(time - convo.messages[convo.messages.length-1].date.time)}
    else if (time - convo.messages[convo.messages.length-1].date.time <= 604800000) {setTimeDisplay("thisWeek"); setTime(time - convo.messages[convo.messages.length-1].date.time)}
    else if (time - convo.messages[convo.messages.length-1].date.time <= 31536000000) {setTimeDisplay("thisYear"); setTime(time - convo.messages[convo.messages.length-1].date.time)}
    else {setTimeDisplay("longTime"); setTime(time - convo.messages[convo.messages - 1 ].date.time)}

  }, [convo.messages])


  return(
    <NavLink to={`/direct/${convo.id}`} className="convo-prev-wrapper">
        <div className="convo-image-wrapper">
          {user.image ? <img alt="" src={user.image}/> : <IoPersonCircle style={{height:"100%", width:"100%", color:"#dbdbdb"}}/>}
        </div>
        <div className="convo-prev-info-wrapper">
          <p style={{color: "black"}}>{user.userName}</p>
          {convo.messages.length > 1 && <p className="convo-fade-text">{convo.messages[convo.messages.length - 1].message.slice(0, 33)}...</p>}
          {convo.messages.length === 1 && <p className="convo-fade-text">{`Send ${user.userName} a message...`}</p>}
        </div>
        {time && timeDisplay && <div className="convo-prev-date-wrapper">
        {timeDisplay === "minutesAgo" && <p>∙{Math.floor(time / 60000)}m</p>}
              {timeDisplay === "today" && <p>∙{Math.floor(time / 3600000)}h</p>}
              {timeDisplay === "thisWeek" && <p>∙{Math.floor(time / 86400000)}d</p>}
              {timeDisplay === "thisYear" && <p>{convo.messages[convo.messages.length - 1].date.monthString.slice(0,3)} {convo.messages[convo.messages.length - 1].date.day}</p>}
              {timeDisplay === "longTime" && <p>{convo.messages[convo.messages.length - 1].date.monthString.slice(0,3)} {convo.messages[convo.messages.length - 1].date.day} {convo.messages[convo.messages.length - 1].date.year}</p>}

        </div>}


      </NavLink>
  )
}

export default MessagePrev;