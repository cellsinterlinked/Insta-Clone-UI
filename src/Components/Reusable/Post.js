import React, {useEffect, useState, useContext} from 'react';
import '../../Pages/Landing.css';
import './Post.css';
import {BiDotsVerticalRounded} from 'react-icons/bi';
import {BsHeart} from 'react-icons/bs';
import {BsHeartFill} from 'react-icons/bs'
import {IoChatbubbleOutline} from 'react-icons/io5';
import {IoPaperPlaneOutline} from 'react-icons/io5';
import {MdTurnedInNot} from 'react-icons/md';
import {MdTurnedIn} from 'react-icons/md';
import {NavLink} from 'react-router-dom';
import Modal from './Modal';
import api from '../../Static/axios';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../Reusable/ErrorModal';
import { AuthContext } from '../../Context/auth-context';



const Post = ({post, user, likeHandler, loading, saveHandler, viewer, params}) => {
  const [showModal, setShowModal] = useState(false)
  const [showError, setShowError] = useState(false)
  const [error, setError] = useState()
  const [timeDisplay, setTimeDisplay] = useState()
  const [time, setTime] = useState()
  const history = useHistory()
  const auth = useContext(AuthContext)
  const myId = auth.userId
  const cancelModalHandler = () => {
    setShowModal(false)
  }

  const showModalHandler = () => {
    setShowModal(true)
  }

  useEffect(() => {

  }, [loading, user, post, viewer])

  
  useEffect(() => {
    const now = new Date();
    const time = now.getTime();
    if (time - post.date.time <= 3600000) {setTimeDisplay("minutesAgo"); setTime(time - post.date.time)}
    else if (time - post.date.time <= 86400000) {setTimeDisplay("today"); setTime(time - post.date.time)}
    else if (time - post.date.time <= 604800000) {setTimeDisplay("thisWeek"); setTime(time - post.date.time)}
    else if (time - post.date.time <= 31536000000) {setTimeDisplay("thisYear"); setTime(time - post.date.time)}
    else {setTimeDisplay("longTime"); setTime(time - post.date.time)}

  }, [post.date.time])

  const removeFollowing = async() => {

    async function unfollow() {
      const res = await api.patch(`users/following/${myId}`, {otherUser: user.id})
      console.log(res)
      setShowModal(false);

    }
    await unfollow()
    history.push('/home')
    //get rid of this history.push/ make this function for follow or unfollow. Also needs to refresh this component's page. 

  }

  const deleteHandler = async () => {
  const res = await api.delete(`posts/${post.id}`, {}, {headers: {Authorization: 'Bearer ' + auth.token}})
  console.log(res)
  setShowModal(false)
  setError("Post deleted")
  setShowError(true);
  setTimeout(function() {setShowError(false)}, 2000)
  history.goBack();

  }
  

  return(
  <div className='post-wrapper'>

    <ErrorModal
     show={showError}
     children={<p className="errorText">{error}</p>}
    />
   
    <Modal 
    show={showModal}
    onCancel={cancelModalHandler}
    children= {
      <div className="post-modal-wrapper">
        {myId !== post.user && <a href="https://www.mentalhealth.gov/get-help/immediate-help" target="_blank" className="danger-post-modal-button" rel="noopener noreferrer">Report</a>}
        {myId !== post.user && <div className="danger-post-modal-button" onClick={removeFollowing}>Unfollow</div>}
        {myId === post.user && <div className="danger-post-modal-button" onClick={deleteHandler}>Delete</div>}
        {!params && <NavLink to={`/post/${post.id}`} className="post-modal-button">Go To Post</NavLink>}
        <div className="post-modal-button last-button-post-modal" onClick={cancelModalHandler}>Cancel</div>
      </div>
    }
    >

    </Modal>
          <div className="post-header">
            <div className='post-header-pic-wrapper'>
              <img alt="" src={user.image}/>
            </div>
            <NavLink to={`user/${user.userName}`} className="userLink">{user.userName}</NavLink>
            <div className="dots-menu-wrapper" onClick={showModalHandler}>
              <BiDotsVerticalRounded className='menu-dots'/>
            </div>
          </div>
          <div className='post-image-wrapper'>
            <img src={post.image} alt="" />
          </div>
          {user.id !== myId && <div className='post-icons-wrapper'> 
            {post.likes.includes(myId)  ? 
            <BsHeartFill style={{color: "red"}} className='post-icon' onClick={() => likeHandler(post.id)}/>
            : 
            <BsHeart className='post-icon' onClick={() => likeHandler(post.id)}/> 
            }
            <NavLink to={`/comments/${post.id}`} style={{color: "black", textDecoration: "none", marginTop:"3px"}}>
            <IoChatbubbleOutline className='post-icon' />
            </NavLink>

            <IoPaperPlaneOutline className='post-icon'/>

            {viewer && viewer.saves.includes(post.id) &&
            <MdTurnedIn  onClick={() => saveHandler(post.id)} className='last-post-icon' style={{color: "#000000"}}/>}
            
            {viewer && !viewer.saves.includes(post.id) && <MdTurnedInNot className='last-post-icon' onClick={() => saveHandler(post.id)}/>}

            {/* {!viewer && <MdTurnedIn  className='last-post-icon' style={{color: "#0095f6"}}/>} */}


           </div>}
          <div className='post-details-wrapper'>
            <p className='likes'>{post.likes.length} Likes</p>
            <div className='post-description'>
            <p className="post-description-text"><strong>{user.userName}</strong> {post.description}</p>
            </div>

            <div className="view-comments-title">
              <NavLink to={`/comments/${post.id}`} >View all {post.comments.length} comments</NavLink>
            </div>

            <div className="post-description">
            {post.comments[0] && <p style={{fontSize: "0.9rem", marginTop: "0"}}className="post-description-text"><strong>{post.comments[0].userName}</strong> {post.comments[0].comment}</p>}
            {post.comments[1] && <p style={{fontSize: "0.9rem", marginTop: "0"}} className="post-description-text"><strong>{post.comments[1].userName}</strong> {post.comments[1].comment}</p>}
            </div>

            {timeDisplay && time && <div className="post-date-wrapper">
              {timeDisplay === "minutesAgo" && <p>{Math.floor(time / 60000)} MINUTES AGO</p>}
              {timeDisplay === "today" && <p>{Math.floor(time / 3600000)} HOURS AGO</p>}
              {timeDisplay === "thisWeek" && <p>{Math.floor(time / 86400000)} DAYS AGO</p>}
              {timeDisplay === "thisYear" && <p>{post.date.monthString} {post.date.day}</p>}
              {timeDisplay === "longTime" && <p>{post.date.monthString} {post.date.day} {post.date.year}</p>}
              
            </div>}
        
            
          </div>
        </div>

  )
}

export default Post;