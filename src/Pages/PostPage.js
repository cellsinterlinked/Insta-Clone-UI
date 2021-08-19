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

  useEffect(() => {
    async function getUser() {
      const res = await api.get(`users/${myId}`)
      console.log(res);
      
      setViewer(res.data.user)
    }
    getUser()
  },[loading, post])

  useEffect(() => {
    async function getPost() {
      const res  = await api.get(`posts/${params}`)
      console.log(res)
      setPost(res.data.post)
    }
    getPost()
  },[params, loading])

  useEffect(() => {
    async function getUser() {
       if (post) {
         const res = await api.get(`users/${post.user}`)
         console.log(res);
         setUser(res.data.user)
       } else return;
      }
      getUser()
  }, [post])

  const likeHandler = (postId) => {
    async function likeClick() {
      const res = await api.patch(`posts/likes/${postId}`, {user: myId})
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
      const res = await api.patch(`users/saves/${myId}`, {postId: postId})
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

  return(
    <div className="post-page-wrapper">
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
      <Post post={post} myId={myId} user={user} likeHandler={likeHandler} loading={loading} viewer={viewer} saveHandler={saveHandler} params={params}/>  
      </div>}

    </div>
  )
}

export default PostPage;