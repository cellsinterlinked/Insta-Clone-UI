import React, {useState, useEffect} from 'react'
import { BsChevronLeft} from 'react-icons/bs'
import { FaCommentsDollar } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import api from '../Static/axios';
import './PostPage.css';
import Post from '../Components/Reusable/Post';

const PostPage = () => {
  const myId = "60f701da7c0a002afd585c03"
  const [post, setPost] = useState()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false)
  const [viewer, setViewer] = useState()

  const params = useParams().postId

  useEffect(() => {
    async function getUser() {
      const res = await api.get('users/60f701da7c0a002afd585c03')
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
      const res = await api.patch(`posts/likes/${postId}`, {user: "60f701da7c0a002afd585c03"})
      console.log(res)
      setLoading(!loading);
    }
    likeClick()
 
  }

  const saveHandler = (postId) => {
    async function saveClick() {
      const res = await api.patch(`users/saves/${myId}`, {postId: postId})
      console.log(res);
      setLoading(!loading)
    }
    saveClick()
  }

  return(
    <div className="post-page-wrapper">
      <div className="post-page-header">
        <NavLink to={`/`} className="post-page-back" >
          <BsChevronLeft className="post-back-icon" />
        </NavLink>
        <p>Post</p>
      </div>

      {post && user && 
      <div className="post-page-margin">
      <Post post={post} myId={"60f701da7c0a002afd585c03"} user={user} likeHandler={likeHandler} loading={loading} viewer={viewer} saveHandler={saveHandler}/>  
      </div>}

    </div>
  )
}

export default PostPage;