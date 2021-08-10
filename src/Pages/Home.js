import React, {useState, useEffect} from 'react';
import './Landing.css';
import './Home.css';
import Post from '../Components/Reusable/Post';
import { FiCamera } from 'react-icons/fi';
import { IoPersonCircle } from 'react-icons/io5';
import {IoPaperPlaneOutline} from 'react-icons/io5';
import {BsPlusCircleFill} from 'react-icons/bs'
import api from '../Static/axios';
import { NavLink } from 'react-router-dom';
import BottomNav from '../Components/Navigation/BottomNav';




const Home = () => {
  const myId = "60f701da7c0a002afd585c03"
  const [loading, setLoading] = useState(false)
  const [followed, setFollowed] = useState()
  const [posts, setPosts] = useState();
  const [user, setUser] = useState();

  
  
  
  useEffect(() => {
    async function getUser() {
      const res = await api.get('users/60f701da7c0a002afd585c03')
      console.log(res);
      const annoying = res.data.user
      setUser(annoying)
    }
    getUser()
  }, [loading, posts])
  
  
  useEffect(() => {
    async function fetchFollowed () {
      const res = await api.get('users/following/60f701da7c0a002afd585c03')
      console.log(res);
      setFollowed(res.data.users)
    }
    fetchFollowed()
  }, [loading])
  
  useEffect(() => {
    async function fetchPosts() {
      const res = await api.get('posts/followed/60f701da7c0a002afd585c03')
      console.log(res)
      setPosts(res.data.posts.reverse())
    }
    fetchPosts()
  }, [loading])
  
  const saveHandler = (postId) => {
    async function saveClick() {
      const res = await api.patch(`users/saves/${myId}`, {postId: postId})
      console.log(res);
      setLoading(!loading)
    }
    saveClick()
  }

  const likeHandler = (postId) => {
    async function likeClick() {
      const res = await api.patch(`posts/likes/${postId}`, {user: "60f701da7c0a002afd585c03"})
      console.log(res)
      setLoading(!loading);
    }
    likeClick()
 
  }

 
  return (
    <div className='landing-wrapper'>
      <div className="home-header-wrapper">
        <div className="left-home-head-wrapper"><FiCamera className="home-icon"/></div>
          <h1 className="home-head-text">Nonurgentgram</h1>
      <NavLink to={`/inbox`} className="right-home-head-wrapper"><IoPaperPlaneOutline className="home-icon"/></NavLink>
      </div>
      <div className="home-carousel-wrapper">
        { followed && <div className="friends-carousel">
          <div className="carousel-item-container">
          <div className="carousel-portrait-container" style={{backgroundColor: "#dbdbdb", border:"1px solid #8e8e8e", overflow:"visible"}}>
            <BsPlusCircleFill className="plus-circle"/>
          <div style={{backgroundColor:"white", borderRadius: "50%"}}>
            <IoPersonCircle className="no-portrait-story"/>
            </div>
          </div>
          <p className="carousel-item-userName">Your Story</p>
          </div>
          {followed.map((user, index) => 
          <div key={index} className="carousel-item-container">
          <div className="carousel-portrait-container">
            <img src={user.image} alt=""/>
          </div>
          <p className="carousel-item-userName">{user.userName}</p>
          </div>
          )}
        </div>}
      </div>

     <div className="home-list-container">
     {posts && followed && user && posts.map((post, index) => 
     <Post  
        post={post} 
        key={index} 
        myId={"60f701da7c0a002afd585c03"} 
        user={followed.find(u => u.id === post.user)} 
        likeHandler={likeHandler}  
        saveHandler={saveHandler}  
        viewer={user}
        /> )}
     </div>





    <BottomNav />
    </div>
  )
}

export default Home;