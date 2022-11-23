import React, { useEffect, useState, useContext } from 'react';
import '../../Pages/Landing.css';
import './Post.css';
import './Modal.css';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { BsHeart } from 'react-icons/bs';
import { BsHeartFill } from 'react-icons/bs';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { MdTurnedInNot } from 'react-icons/md';
import { MdTurnedIn } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import Modal from './Modal';
import api from '../../Static/axios';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../Reusable/ErrorModal';
import { AuthContext } from '../../Context/auth-context';
import { BsPersonBoundingBox } from 'react-icons/bs';
import { IoPersonCircle } from 'react-icons/io5';

const Post = ({
  post,
  user,
  likeHandler,
  saveHandler,
  viewer,
  params,
  unfollow,
  followedArr,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState();
  const [timeDisplay, setTimeDisplay] = useState();
  const [time, setTime] = useState();
  const [finalDescription, setFinalDescription] = useState();
  const [tagView, setTagView] = useState(false);
  const history = useHistory();
  const auth = useContext(AuthContext);
  const myId = auth.userId;
  const myName = auth.userName;
  const cancelModalHandler = () => {
    setShowModal(false);
  };

  const showModalHandler = () => {
    setShowModal(true);
  };

  // useEffect(() => {

  // }, [loading, user, post, viewer])

  useEffect(() => {
    let descSplit = post.description
      .split(' ')
      .filter((word) => word[0] !== '#');
    let finalDesc = descSplit.join(' ');
    setFinalDescription(finalDesc);
  }, [post]);

  useEffect(() => {
    const now = new Date();
    const time = now.getTime();
    if (time - post.date.time <= 3600000) {
      setTimeDisplay('minutesAgo');
      setTime(time - post.date.time);
    } else if (time - post.date.time <= 86400000) {
      setTimeDisplay('today');
      setTime(time - post.date.time);
    } else if (time - post.date.time <= 604800000) {
      setTimeDisplay('thisWeek');
      setTime(time - post.date.time);
    } else if (time - post.date.time <= 31536000000) {
      setTimeDisplay('thisYear');
      setTime(time - post.date.time);
    } else {
      setTimeDisplay('longTime');
      setTime(time - post.date.time);
    }
  }, [post.date.time]);

  const deleteHandler = async () => {
    const res = await api.delete(
      `posts/${post.id}`,
      {},
      { headers: { Authorization: 'Bearer ' + auth.token } }
    );

    setShowModal(false);
    setError('Post deleted');
    setShowError(true);
    setTimeout(function () {
      setShowError(false);
    }, 2000);
    history.goBack();
  };

  const removeFollow = async () => {
    const res = await unfollow(user);
    setShowModal(false);
  };

  const shareClick = () => {
    setError("Share functionality isn't finished!");
    setShowError(true);
    setTimeout(function () {
      setShowError(false);
    }, 2000);
  };

  const tagHandler = () => {
    setTagView(!tagView);
  };

  return (
    <>
      {post && user && myId && finalDescription && (
        <div className="post-wrapper">
          <ErrorModal
            show={showError}
            children={<p className="errorText">{error}</p>}
          />

          <Modal
            show={showModal}
            onCancel={cancelModalHandler}
            children={
              <div className="post-modal-wrapper">
                {myId !== post.user && (
                  <a
                    href="https://www.mentalhealth.gov/get-help/immediate-help"
                    target="_blank"
                    className="danger-post-modal-button"
                    rel="noopener noreferrer"
                  >
                    Report
                  </a>
                )}
                {myId !== post.user && followedArr.includes(user.id) && (
                  <div
                    className="danger-post-modal-button"
                    onClick={removeFollow}
                  >
                    Unfollow
                  </div>
                )}
                {myId === post.user && (
                  <div
                    className="danger-post-modal-button"
                    onClick={deleteHandler}
                  >
                    Delete
                  </div>
                )}
                {!params && (
                  <NavLink
                    to={`/post/${post.id}`}
                    className="post-modal-button"
                  >
                    Go To Post
                  </NavLink>
                )}
                <div
                  className="post-modal-button last-button-post-modal"
                  onClick={cancelModalHandler}
                >
                  Cancel
                </div>
              </div>
            }
          ></Modal>
          <div className="post-header">
            <div className="post-header-pic-wrapper">
              {user.image ? <img alt="" src={user.image} /> : <IoPersonCircle style={{height: "100%", width: "100%", color: "#dbdbdb"}} />}
            </div>
            {user.userName !== myName ? (
              <NavLink to={`/user/${user.userName}`} className="userLink">
                {user.userName}
              </NavLink>
            ) : (
              <NavLink to={`/account`} className="userLink">
                {user.userName}
              </NavLink>
            )}
            <div className="dots-menu-wrapper" onClick={showModalHandler}>
              <BiDotsVerticalRounded className="menu-dots" />
            </div>
          </div>
          <div className="post-image-wrapper">
            <img src={post.image} alt="" />
            <BsPersonBoundingBox
              className="tag-image-icon"
              onClick={tagHandler}
            />
            {tagView === true && (
              <div className="tag-cover">
                {post.tags.map((tag, index) => (
                  tag !== myName ? <NavLink
                    to={`/user/${tag}`}
                    style={{ textDecoration: 'none', color: 'white' }}
                    key={index}
                    className="tag-display-name"
                  >
                    <div className="tag-left-arrow"></div>
                    {tag}
                  </NavLink> : <NavLink
                    to={`/account`}
                    style={{ textDecoration: 'none', color: 'white' }}
                    key={index}
                    className="tag-display-name"
                  >
                    <div className="tag-left-arrow"></div>
                    {tag}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          {user.id !== myId && (
            <div className="post-icons-wrapper">
              {post.likes.includes(myId) ? (
                <BsHeartFill
                  style={{ color: 'red' }}
                  className="post-icon"
                  onClick={() => likeHandler(post.id)}
                />
              ) : (
                <BsHeart
                  className="post-icon"
                  onClick={() => likeHandler(post.id)}
                />
              )}
              <NavLink
                to={`/comments/${post.id}`}
                style={{
                  color: 'black',
                  textDecoration: 'none',
                  marginTop: '3px',
                }}
              >
                <IoChatbubbleOutline className="post-icon" />
              </NavLink>

              <IoPaperPlaneOutline className="post-icon" onClick={shareClick} />

              {viewer && viewer.saves.includes(post.id) && (
                <MdTurnedIn
                  onClick={() => saveHandler(post.id)}
                  className="last-post-icon"
                  style={{ color: '#000000' }}
                />
              )}

              {viewer && !viewer.saves.includes(post.id) && (
                <MdTurnedInNot
                  className="last-post-icon"
                  onClick={() => saveHandler(post.id)}
                />
              )}

              {/* {!viewer && <MdTurnedIn  className='last-post-icon' style={{color: "#0095f6"}}/>} */}
            </div>
          )}
          <div className="post-details-wrapper">
            <p className="likes">{post.likes.length} Likes</p>
            <div className="post-description">
              <p className="post-description-text">
                <strong>{user.userName}</strong> {finalDescription}
              </p>
            </div>

            <div className="hash-post-display-wrapper">
              {post.hashTags.map((tag, index) => (
                <NavLink
                  className="post-hash-link"
                  key={index}
                  to={`/hashtag/${tag.slice(1)}`}
                >
                  <p className="why-need-class">{tag}</p>
                </NavLink>
              ))}
            </div>

            <div className="view-comments-title">
              <NavLink to={`/comments/${post.id}`}>
                View all {post.comments.length} comments
              </NavLink>
            </div>

            <div className="post-description">
              {post.comments[0] && (
                <p
                  style={{ fontSize: '0.9rem', marginTop: '0' }}
                  className="post-description-text"
                >
                  {post.comments[0].userName !== myName ? <NavLink
                    style={{ textDecoration: 'none', color: 'black' }}
                    to={`/user/${post.comments[0].userName}`}
                  >
                    <strong>{post.comments[0].userName}</strong>
                  </NavLink> : <NavLink
                    style={{ textDecoration: 'none', color: 'black' }}
                    to={`/account`}
                  >
                    <strong>{post.comments[0].userName}</strong>
                  </NavLink>}
                  {' '}
                  {post.comments[0].comment}
                </p>
              )}
              {post.comments[1] && (
                <p
                  style={{ fontSize: '0.9rem', marginTop: '0' }}
                  className="post-description-text"
                >
                  {post.comments[1].userName !== myName ? <NavLink
                    style={{ textDecoration: 'none', color: 'black' }}
                    to={`/user/${post.comments[1].userName}`}
                  >
                    <strong>{post.comments[1].userName}</strong>
                  </NavLink> : <NavLink
                    style={{ textDecoration: 'none', color: 'black' }}
                    to={`/account`}
                  >
                    <strong>{post.comments[1].userName}</strong>
                  </NavLink>}
                  {' '}
                  {post.comments[1].comment}
                </p>
              )}
            </div>

            {timeDisplay && time && (
              <div className="post-date-wrapper">
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
                    {post.date.monthString} {post.date.day}
                  </p>
                )}
                {timeDisplay === 'longTime' && (
                  <p>
                    {post.date.monthString} {post.date.day} {post.date.year}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
