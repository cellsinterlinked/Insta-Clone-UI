import React, {useState, useEffect} from 'react';
import './Comment.css';
import { BsHeart } from 'react-icons/bs';
import api from '../../Static/axios';


const Comment = ({comment, user, heart, myId, postUser, deletable, deleteHandler, commentId, heartHandler}) => {

  const [timeDisplay, setTimeDisplay] = useState()
  const [time, setTime] = useState()
  
  useEffect(() => {

    const now = new Date();
    const time = now.getTime();
    if (time - comment.date.time <= 3600000) {setTimeDisplay("minutesAgo"); setTime(time - comment.date.time)}
    else if (time - comment.date.time <= 86400000) {setTimeDisplay("today"); setTime(time - comment.date.time)}
    else if (time - comment.date.time <= 604800000) {setTimeDisplay("thisWeek"); setTime(time - comment.date.time)}
    else if (time - comment.date.time <= 31536000000) {setTimeDisplay("thisYear"); setTime(time - comment.date.time)}
    else {setTimeDisplay("longTime"); setTime(time - comment.date.time)}

  }, [comment.date.time])
  
  return (
    <div className="comment-wrapper">
      <div className="comment-item-portrait-wrapper">
        <img src={user.image} alt="" />
      </div>
      <div className="comment-details-wrapper">
        <p><strong>{user.userName}</strong>{` ${comment.comment}`} </p>

        {time && timeDisplay && <div className="comment-fine-wrapper">
        {timeDisplay === "minutesAgo" && <p>{Math.floor(time / 60000)} MINUTES AGO</p>}
              {timeDisplay === "today" && <p>{Math.floor(time / 3600000)} HOURS AGO</p>}
              {timeDisplay === "thisWeek" && <p>{Math.floor(time / 86400000)} DAYS AGO</p>}
              {timeDisplay === "thisYear" && <p>{comment.date.monthString} {comment.date.day}</p>}
              {timeDisplay === "longTime" && <p>{comment.date.monthString} {comment.date.day} {comment.date.year}</p>}
        {deletable === true && <div>
        {(myId === user.id || myId === postUser) && <p onClick={() => {deleteHandler(commentId)} }className="comment-delete">Delete</p>}
        </div>}

        </div>}

      </div>
      <div className="comment-heart-wrapper">
        {heart === true && <BsHeart className="comment-empty-heart" onClick={heartHandler}/>}
      </div>
    </div>
  )
}

export default Comment;