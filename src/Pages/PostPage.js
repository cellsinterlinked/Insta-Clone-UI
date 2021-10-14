import React, {useState, useEffect, useContext} from 'react'
import { BsChevronLeft} from 'react-icons/bs'
import { FaCommentsDollar } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import api from '../Static/axios';
import './PostPage.css';
import Post from '../Components/Reusable/Post';
import { useHistory } from 'react-router';
import ErrorModal from '../Components/Reusable/ErrorModal';
import { AuthContext } from '../Context/auth-context';
import Spinner from '../Components/Reusable/Spinner2';

const PostPage = () => {
  const auth = useContext(AuthContext);
  const myId = auth.userId
  const [post, setPost] = useState()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)
  const [viewer, setViewer] = useState()
  const [error, setError] = useState()
  const [showError, setShowError] = useState()
  const params = useParams().postId
  const history = useHistory();
  const [followedArr, setFollowedArr] = useState()

  // async function starterFunction() {
  //   await getViewer()
  //   await getPost()
  //   await getUser()
  // }

  async function getViewer() {
    let res;
    try{
      res = await api.get(`users/${myId}`)
    } catch(err) {
      setError("Error getting your user info")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

    console.log(res);
    setFollowedArr(res.data.user.following)
    setViewer(res.data.user)
  }
  
  async function getPost() {
    let res;
    try{
      res  = await api.get(`posts/${params}`)
    } catch(err) {
      setError("Error getting post")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }
      
    console.log(res)
    setPost(res.data.post)
  }
  async function getUser() {
     if (post) {
       let res;
       try{
        res = await api.get(`users/${post.user}`)
        } catch(err) {
          setError("Error getting user info")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
        }

       console.log(res);
       setUser(res.data.user)
     } else return;
    }

    // useEffect(() => {
    //   starterFunction()
    // }, [])
    
    useEffect(() => {
      getViewer()
    },[loading, post])
    
    useEffect(() => {
      getPost()
    },[params, loading])
    
    useEffect(() => {
    getUser()
  }, [post, loading])

  const likeHandler = (postId) => {
    async function likeClick() {
      let res;
      try{
        res = await api.patch(`posts/likes/${postId}`, {user: myId})
      } catch(err) {
        setError("Error liking post")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }
 
      if (post.likes.includes(myId)) {
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

  const saveHandler = (postId) => {
    async function saveClick() {
      let res;
      try{
        res = await api.patch(`users/saves/${myId}`, {postId: postId})
      } catch(err) {
        setError("Error while saving")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

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

  async function unfollow(friend) {
    let res;
    try{
      res = await api.patch(
        `users/following/${myId}`,
        { otherUser: friend.id },
      );
    } catch(err) {
      setError("Error unfollowing")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

    setFollowedArr(followedArr.filter(u => u !== friend.id))
    getUser()
    setError(`You unfollowed ${friend.userName}`)
    setShowError(true)
    setTimeout(function() {setShowError(false)}, 2000)
    
  }




  return(
    
    <div className="post-page-wrapper">
      {(!post || !user) && <Spinner />}
      <ErrorModal
     show={showError}
     children={<p className="errorText">{error}</p>}
    />
      <div className="post-page-header">
        <div onClick={history.goBack} className="post-page-back" >
          <BsChevronLeft className="post-back-icon" />
        </div>
        <p>Post</p>
      </div>

      {post && user && 
      <div className="post-page-margin">
      <Post post={post} myId={myId} user={user} likeHandler={likeHandler} loading={loading} viewer={viewer} saveHandler={saveHandler} params={params} unfollow={unfollow} followedArr={followedArr}/>  
      </div>}

    </div>
    
  )
}

export default PostPage;