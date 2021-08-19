import React, {useState, useEffect, useContext} from 'react';
import api from '../Static/axios';
import './Account.css';
import './User.css';
import { BsPersonPlus } from 'react-icons/bs';
import { BsGearWide } from 'react-icons/bs'
import { BsPeopleCircle } from 'react-icons/bs';
import { BsGrid3X3 } from 'react-icons/bs';
import { BsViewList } from 'react-icons/bs';
import { BsBookmark } from 'react-icons/bs';
import {BsPersonBoundingBox } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import Post from '../Components/Reusable/Post';
import BottomNav from '../Components/Navigation/BottomNav';
import { FiCamera } from 'react-icons/fi';
import { AuthContext } from '../Context/auth-context';

//you were turning following into navlink on thursday




const Account = () => {
  const auth = useContext(AuthContext);
  const myId = auth.userId;
  const myName = auth.userName;
  const [user, setUser] = useState()
  const [posts, setPosts] = useState();
  const [button, setButton] = useState(1)
  const [loading, setLoading] = useState(false)
  const [tagged, setTagged] = useState()
  const [saved, setSaved] = useState()

  useEffect(() => {
    async function getUser() {
      const res = await api.get(`users/${myId}`)
      console.log(res);
      setUser(res.data.user)
    }
    getUser()
  }, [])

  useEffect(() => {
    async function getPosts() {
      const res = await api.get(`/posts/user/${myId}`)
      console.log(res)
      setPosts(res.data.posts.reverse())
  
    }
    getPosts()
  },[loading])  

  useEffect(() => {
    async function getTagged() {
      const res = await api.get(`/posts/tagged/${myName}`)
      setTagged(res.data.posts.reverse())
      
    }
    getTagged();
  }, [])

  useEffect(() => {
    async function getSaved() {
      const res = await api.get(`users/saved/${myId}`)
      console.log(res);
      setSaved(res.data.posts.reverse())
    }
    getSaved()
  }, [])

  return(
    <>
    {user && 
    
    <div>
      <div className="top-account-head-wrapper">
        <div className="account-head-icon-wrapper"><BsGearWide className="account-head-icon"/></div>
        <p>{user.userName}</p>
        <div className="account-head-icon-wrapper"><BsPersonPlus className="account-head-icon" /></div>
      </div>

      <div className="account-basic-wrapper">

        <div className="account-profile-wrapper">
          {!user.image && <div className="editPicture-container"><BsPeopleCircle className="edit-profile-icon" /></div>}
         {user.image && <div className="editPicture-container"><img  alt="why" src={user.image}/></div>}
          <p>{user.name}</p>
        </div>

        <div className="account-name-edit-wrapper">
          <h1>{user.userName}</h1>
          <NavLink to="account/edit">
          <button className="edit-profile-button"> Edit Profile</button>
          </NavLink>

        </div>
      </div>
        



        <div className="account-follow-wrapper">
          <div  className="follow-info-wrapper">
            <p style={{fontWeight: "bold", color: "black"}}>{user.posts.length}</p>
            <p style={{color: "#8E8E8E"}}>Posts</p>
          </div>

          <NavLink to="/followers" className="follow-info-wrapper">
            <p style={{fontWeight: "bold", color: "black"}}>{user.followers.length}</p>
            <p style={{color: "#8E8E8E"}}>Followers</p>
          </NavLink>

          <NavLink to="/following" className="follow-info-wrapper">
            <p style={{fontWeight: "bold" , color: "black"}}>{user.following.length}</p>
            <p style={{color: "#8E8E8E"}}>Following</p>
          </NavLink>
        </div>

        <div className="account-buttons-wrapper2">
          <div className="account-button-container" onClick={() => setButton(1)}><BsGrid3X3 style={{color: button === 1 ? "#0095F6" : "#8e8e8e"}} className="account-button-icon"/></div>
          <div className="account-button-container" onClick={() => setButton(2)}><BsViewList style={{color: button === 2 ? "#0095F6" : "#8e8e8e"}} className="account-button-icon" /></div>
          <div className="account-button-container" onClick={() => setButton(3)}><BsBookmark style={{color: button === 3 ? "#0095F6" : "#8e8e8e"}} className="account-button-icon" /></div>
          <div className="account-button-container" onClick={() => setButton(4)}><BsPersonBoundingBox style={{color: button === 4 ? "#0095F6" : "#8e8e8e"}} className="account-button-icon" /></div>
        
        </div>

        {button === 1 && posts && 
        <div className="profile-grid-wrapper">
          {posts.map((post, index) => 
          <NavLink to={`post/${post.id}`} className="grid-picture-wrapper"key={index}>
            <img alt="" src={post.image} />
          </NavLink>)}
        </div>}

        {button === 1 && !posts && 
        <div className="no-posts-wrapper">
          <div className="camera-circle">
            <FiCamera className="no-posts-icon" />
          </div>
          <h1>Share Photos</h1>
          <p>When you share photos, they will appear on your profile.</p>
          <a href="/create">Share your first photo</a>
        </div>
      }





        
        

        {button === 4 && tagged && 
        <div className="profile-grid-wrapper">
        {tagged.map((post, index) => 
        <NavLink to={`post/${post.id}`} className="grid-picture-wrapper"key={index}>
          <img alt="" src={post.image} />
        </NavLink>)}
        </div>}

        {button === 4 && !tagged && 
          <div className="no-posts-wrapper">
          <div className="camera-circle">
            <BsPersonBoundingBox className="no-posts-icon" />
          </div>
          <h1>Photos of you</h1>
          <p>When people tag you in photos, they'll appear here.</p>
         
        </div>
        }

        {button === 3 && saved &&
        <>
        <p className="saved-message">Only you can see what you've saved</p> 
        <div className="profile-grid-wrapper">
        {saved.map((post, index) => 
        <NavLink to={`post/${post.id}`} className="grid-picture-wrapper"key={index}>
          <img alt="" src={post.image} />
        </NavLink>)}
        </div>
        </>}

        {button === 3 && !saved &&
        <>
        <p className="saved-message">Only you can see what you've saved</p> 
        <div className="no-posts-wrapper">
          <div className="camera-circle">
            <BsBookmark className="no-posts-icon" />
          </div>
          <h1>Save</h1>
          <p>Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.</p>
         
        </div>
        </>

        }

        

        {button === 2 && posts &&
        <div className="profile-stream-wrapper">
          {posts.map((post, index) => 
            <Post post={post} key={index} myId={myId} user={user}  loading={loading}/>
          )}
        </div>
        
        }

{button === 2 && !posts && 
        <div className="no-posts-wrapper">
          <div className="camera-circle">
            <FiCamera className="no-posts-icon" />
          </div>
          <h1>Share Photos</h1>
          <p>When you share photos, they will appear on your profile.</p>
          <a href="/create">Share your first photo</a>
        </div>
      }


          
    </div>}
    <BottomNav />
    </>
  )
}

export default Account;