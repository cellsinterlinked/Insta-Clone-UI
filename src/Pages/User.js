import React, {useState, useEffect, useContext} from 'react';
import api from '../Static/axios';
import { useParams, NavLink } from 'react-router-dom';
import { BsChevronLeft} from 'react-icons/bs';
import './User.css';
import { set } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import {BsFillPersonFill} from 'react-icons/bs';
import { BsCheck } from 'react-icons/bs';
import { BsChevronDown } from 'react-icons/bs';
import { BsGrid3X3 } from 'react-icons/bs';
import { BsViewList } from 'react-icons/bs';
import {BsPersonBoundingBox } from 'react-icons/bs';
import { BsCollectionPlay } from 'react-icons/bs'
import { GrChannel } from 'react-icons/gr';
import { MdSettingsInputAntenna } from 'react-icons/md';
import Post from '../Components/Reusable/Post';
import BottomNav from '../Components/Navigation/BottomNav';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../Context/auth-context';



const User = () => {
const auth = useContext(AuthContext);
const myId = auth.userId
let history = useHistory()
const [page, setPage] = useState(1)
const [posts, setPosts] = useState([])
const [user, setUser] = useState()
const [loading, setLoading] = useState(false)
const params = useParams().username
const [viewer, setViewer] = useState()
const [tagged, setTagged] = useState()

useEffect(() => {
  async function getViewer() {
    const res = await api.get(`users/${myId}`)
    console.log(res);
    setViewer(res.data.user)
  }
  getViewer()
}, [])

useEffect(() => {
  async function getUser() {
    const res = await api.get(`/users/profile/${params}`)
    console.log(res)
    setUser(res.data.user);
  }
  getUser();
}, [params])

useEffect(() => {
  async function getPosts() {
    const res = await api.get(`/posts/profile/${params}`)
    console.log(res)
    setPosts(res.data.posts.reverse())

  }
  getPosts()
},[params, loading])

useEffect(() => {
  async function getTagged() {
    const res = await api.get(`/posts/tagged/${params}`)
    setTagged(res.data.posts.reverse())
  }
  getTagged();
}, [params])
    

const likeHandler = (postId) => {
  async function likeClick() {
    const res = await api.patch(`posts/likes/${postId}`, {user: myId})
    console.log(res)
    setLoading(!loading);
  }
  likeClick()

}

const messageHandler = () => {
  
}

  return(
    
    <div className="user-wrapper">
       <div className="user-header-wrapper">
        <div onClick={history.goBack} className="profile-back-button">
          <BsChevronLeft className="profile-back-icon" />
        </div>
         <p>{params}</p>
      </div>
      <div className="wtf"></div>
      { user && <div>

      <div className="profile-second-box" >
        <div className="profile-portrait-info-wrapper">
          <div className="profile-face-box">
            <img alt="" src={user.image}/>
          </div>
          <div className="profile-name-buttons-wrapper">
              <div className="profile-name-wrapper">
                <p>{user.userName}</p>
                <FaCheckCircle className="profile-check-icon" />
                <BsThreeDots className="profile-dots-button" />
              </div>
              <div className="profile-buttons-wrapper">
                <button className="profile-message-button">Message</button>
                <button className="profile-follow-button">
                    <BsFillPersonFill className="follow-button-person"/>
                    <BsCheck className="follow-button-check" />
                </button>
                <button className="show-suggestions-profile-button" >
                  <BsChevronDown />
                  {/* these buttons are replaced with wider blue follow button and chevron down button that are blue */}
                </button>
              </div>
          </div>

        </div>
        <div className="profile-name-details-wrapper">
          <p className="profile-full-name">{user.name}</p>
          <p className="profile-email">{user.email}</p>
        </div>
      </div>

      <div className="profile-follow-bar">
        <div className="profile-follow-bar-box">
          <p style={{fontWeight: "bold"}}>{user.posts.length}</p>
          <p style={{color: "#8e8e8e"}}>posts</p>
        </div>
        <NavLink className="profile-follow-bar-box" to={`/${params}/followers`}>
          <p style={{fontWeight: "bold"}}>{user.followers.length}</p>
          <p style={{color: "#8e8e8e"}}>followers</p>

        </NavLink>
        <NavLink className="profile-follow-bar-box" to={`/${params}/following`}>
          <p style={{fontWeight: "bold"}}>{user.following.length}</p>
          <p style={{color: "#8e8e8e"}}>following</p>
          
        </NavLink>
      </div>
        <div className="profile-displays-bar">
          <div className="profile-display-icon-wrapper" onClick={() => setPage(1)}>
          <BsGrid3X3 style={{color: page === 1 ? "#0095f6" : "#8e8e8e"}} className="profile-display-icon"/>
           </div>

           <div className="profile-display-icon-wrapper" onClick={() => setPage(2)}>
          <BsViewList style={{color: page === 2 ? "#0095f6" : "#8e8e8e"}} className="profile-display-icon" />
           </div>

           <div className="profile-display-icon-wrapper" onClick={() => setPage(3)}>
          <BsCollectionPlay style={{color: page === 3 ? "#0095f6" : "#8e8e8e"}} className="profile-display-icon" />
           </div>

           <div className="profile-display-icon-wrapper" onClick={() => setPage(4)}>
           <GrChannel style={{opacity: page === 4 ? "1" : "0.5" }} className="profile-display-icon" />
           </div>

           <div className="profile-display-icon-wrapper" onClick={() => setPage(5)}>
          <BsPersonBoundingBox style={{color: page === 5 ? "#0095f6" : "#8e8e8e"}} className="profile-display-icon" />
           </div>

        </div>

        {page === 1 && 
        <div className="profile-grid-wrapper">
          {posts.map((post, index) => 
          <NavLink to={`post/${post.id}`} className="grid-picture-wrapper"key={index}>
            <img alt="" src={post.image} />
          </NavLink>)}
        </div>}

        {page === 2 && 
        <div className="profile-stream-wrapper">
          {posts.map((post, index) => 
            <Post post={post} key={index} myId={myId} user={user} viewer={viewer} likeHandler={likeHandler} loading={loading}/>
          )}
        </div>
        
        }

        {page === 5 && tagged && 
        <div className="profile-grid-wrapper">
        {tagged.map((post, index) => 
        <NavLink to={`post/${post.id}`} className="grid-picture-wrapper"key={index}>
          <img alt="" src={post.image} />
        </NavLink>)}
        </div>}
        



      </div>}

      <BottomNav />
    </div>
    
  )
}

export default User
