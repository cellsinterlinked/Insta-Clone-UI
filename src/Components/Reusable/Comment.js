import React, { useState, useEffect, useContext } from 'react';
import './Comment.css';
import { BsHeart } from 'react-icons/bs';
import { IoPersonCircle } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/auth-context';

const Comment = ({
  comment,
  user,
  heart,
  postUser,
  deletable,
  deleteHandler,
  commentId,
  heartHandler,
  tags,
}) => {
  const [timeDisplay, setTimeDisplay] = useState();
  const [time, setTime] = useState();
  const auth = useContext(AuthContext);
  const myId = auth.userId;
  const myName = auth.userName;

  useEffect(() => {
    const now = new Date();
    const time = now.getTime();
    if (time - comment.date.time <= 3600000) {
      setTimeDisplay('minutesAgo');
      setTime(time - comment.date.time);
    } else if (time - comment.date.time <= 86400000) {
      setTimeDisplay('today');
      setTime(time - comment.date.time);
    } else if (time - comment.date.time <= 604800000) {
      setTimeDisplay('thisWeek');
      setTime(time - comment.date.time);
    } else if (time - comment.date.time <= 31536000000) {
      setTimeDisplay('thisYear');
      setTime(time - comment.date.time);
    } else {
      setTimeDisplay('longTime');
      setTime(time - comment.date.time);
    }
  }, [comment.date.time]);

  return (
    <div className="comment-wrapper">
      <div className="comment-item-portrait-wrapper">
        {user.image ? (
          <img src={user.image} alt="" />
        ) : (
          <IoPersonCircle
            style={{ height: '100%', width: '100%', color: '#dbdbdb' }}
          />
        )}
      </div>
      <div className="comment-details-wrapper">
        <p>
          {user.userName !== myName ? <NavLink
            style={{ textDecoration: 'none', color: 'black' }}
            to={`/user/${user.userName}`}
          >
            <strong>{user.userName}</strong>
          </NavLink> : <NavLink
            style={{ textDecoration: 'none', color: 'black' }}
            to={`/account`}
          >
            <strong>{user.userName}</strong>
          </NavLink>}
          {` ${comment.comment}`}{' '}
        </p>
        {tags && <div style={{ marginTop: '6px' }}></div>}
        {tags &&
          tags.map((tag, index) => (
            <NavLink
              style={{
                color: 'rgb(20, 0, 147)',
                textDecoration: 'none',
                fontSize: '.9rem',
              }}
              to={`/hashtag/${tag.slice(1)}`}
              key={index}
            >
              {tag}{' '}
            </NavLink>
          ))}

        {time && timeDisplay && (
          <div className="comment-fine-wrapper">
            {timeDisplay === 'minutesAgo' && (
              <p>{Math.floor(time / 60000)} MINUTES AGO</p>
            )}
            {timeDisplay === 'today' && (
              <p>{Math.floor(time / 3600000)} HOURS AGO</p>
            )}
            {timeDisplay === 'thisWeek' && (
              <p>{Math.floor(time / 86400000)} DAYS AGO</p>
            )}
            {timeDisplay === 'thisYear' && (
              <p>
                {comment.date.monthString} {comment.date.day}
              </p>
            )}
            {timeDisplay === 'longTime' && (
              <p>
                {comment.date.monthString} {comment.date.day}{' '}
                {comment.date.year}
              </p>
            )}
            {deletable === true && (
              <div>
                {(myId === user.id || myId === postUser) && (
                  <p
                    onClick={() => {
                      deleteHandler(commentId);
                    }}
                    className="comment-delete"
                  >
                    Delete
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="comment-heart-wrapper">
        {heart === true && (
          <BsHeart className="comment-empty-heart" onClick={heartHandler} />
        )}
      </div>
    </div>
  );
};

export default Comment;
