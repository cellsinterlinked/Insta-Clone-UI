import React, {useState, useEffect, useContext} from 'react';
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
import ErrorModal from '../Components/Reusable/ErrorModal';
import Spinner from '../Components/Reusable/Spinner';
import {AuthContext} from '../Context/auth-context';
import { CgDisplayFullwidth } from 'react-icons/cg';




const Home = () => {
  const auth = useContext(AuthContext)
  const myId = auth.userId
  const [loading, setLoading] = useState(false)
  const [followed, setFollowed] = useState()
  const [posts, setPosts] = useState();
  const [user, setUser] = useState();
  const [error, setError] = useState()
  const [showError, setShowError] = useState()
  const [followedArr, setFollowedArr] = useState();

  

  
  
  
  useEffect(() => {
    async function getUser() {
      const res = await api.get(`users/${auth.userId}`)
      console.log(res);
      const annoying = res.data.user
      setFollowedArr(res.data.user.following)
      setUser(annoying)
    }
    getUser()
  }, [loading, posts, auth.userId])
  
  
  useEffect(() => {
    async function fetchFollowed () {
      const res = await api.get(`users/following/${auth.userId}`)
      console.log(res);
      setFollowed(res.data.users)
    }
    fetchFollowed()
  }, [loading, auth.userId])
  
  useEffect(() => {
    async function fetchPosts() {
      const res = await api.get(`posts/followed/${auth.userId}`)
      console.log(res)
      setPosts(res.data.posts.reverse())
    }
    fetchPosts()
  }, [loading, auth.userId])
  
  const saveHandler = (postId) => {
    async function saveClick() {
      const res = await api.patch(`users/saves/${auth.userId}`, {postId: postId})
      if (user.saves.includes(postId)) {
        setError("Removed this post from saves")
        setShowError(true)
      } else {
        setError("You saved this post")
        setShowError(true)
      }
      console.log(res);
      setLoading(!loading)
      setTimeout(function() {setShowError(false)}, 2000)
    }
    saveClick()
  }

  const likeHandler = (postId) => {
    async function likeClick() {
      const res = await api.patch(`posts/likes/${postId}`, {user: myId})
      const thisPost = posts.find(post => post.id === postId)
      if (thisPost.likes.includes(myId)) {
        setError("you unliked this post")
        setShowError(true)
      } else {
        setError("You liked this post")
        setShowError(true)
      }
      console.log(res)
      setLoading(!loading);
      setTimeout(function() {setShowError(false)}, 2000)
    }
    likeClick()
 
  }

  const unfollow = async (user) => {
    
    const res = await api.patch(
      `users/following/${myId}`, 
      {otherUser: user.id}, 
      {headers: {'Content-Type': 'application/json'}})
    setFollowedArr(followedArr.filter(u => u !== user.id))
    setError(`You unfollowed ${user.userName}`)
    setShowError(true)
    setTimeout(function() {setShowError(false)}, 2000)
    
  }

  

 
  return (
    <div className='landing-wrapper'>
     <ErrorModal
     show={showError}
     children={<p className="errorText">{error}</p>}
    />
      <div className="home-header-wrapper">
        <NavLink to={'/create'} className="left-home-head-wrapper"><FiCamera className="home-icon"/></NavLink>
          <h1 className="home-head-text">Nonurgentgram</h1>
      <NavLink to={`/inbox`} className="right-home-head-wrapper"><IoPaperPlaneOutline className="home-icon"/></NavLink>
      </div>

      {(!user || !myId || !posts || !followed) && <Spinner  />}

      {user && myId && followed && <div>

      <div className="home-carousel-wrapper">
        { followed && <div className="friends-carousel">
          <NavLink to={`/create`} className="carousel-item-container">
          <div className="carousel-portrait-container" style={{backgroundColor: "#dbdbdb", border:"1px solid #8e8e8e", overflow:"visible"}}>
            <BsPlusCircleFill className="plus-circle"/>
          <div style={{backgroundColor:"white", borderRadius: "50%"}}>
            <IoPersonCircle className="no-portrait-story"/>
            </div>
          </div>
          <p className="carousel-item-userName">New Post</p>
          </NavLink>
          {followed.map((user, index) => 
          <NavLink to={`/user/${user.userName}`} key={index} className="carousel-item-container">
          <div className="carousel-portrait-container">
            <img src={user.image} alt=""/>
          </div>
          <p className="carousel-item-userName">{user.userName}</p>
          </NavLink>
          )}
        </div>}
      </div>

     <div className="home-list-container">

     {user && myId && !posts &&
      <div className="no-feed-wrapper">
        <div className="no-feed-circle">
          <CgDisplayFullwidth className="no-feed-icon"/>
        </div>
        <h1>Your Feed Is Empty!</h1>
        <p>When you follow other users or hashtags their posts will display here.</p>
        <NavLink to="/search" className="no-feed-link"><p>Search for users/hashtags to follow</p></NavLink>
        
      </div>}

     {posts && myId && followed && user && posts.map((post, index) => 
     <Post  
        post={post} 
        key={index} 
        myId={myId} 
        user={followed.find(u => u.id === post.user)} 
        likeHandler={likeHandler}  
        saveHandler={saveHandler}  
        viewer={user}
        unfollow={unfollow}
        followedArr={followedArr}
        /> )}
     </div>





      </div>}

    <BottomNav />
    </div>
  )
}

export default Home;