import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Static/axios';
import './Comments.css';
import { BsChevronLeft} from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { IoPersonCircle } from 'react-icons/io5';
import Comment from '../Components/Reusable/Comment';
import { useForm } from 'react-hook-form';
import { yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import commentContent from '../Static/leaveComment';
import ErrorModal from '../Components/Reusable/ErrorModal';
import { useHistory } from 'react-router';
import { AuthContext } from '../Context/auth-context';

const schemaComment = yup.object().shape({
  comment: yup.string().required().min(1)
})


const Comments = () => {
  const {register, handleSubmit, errors, formState, reset} = useForm({
    resolver: yupResolver(schemaComment),
    mode: "onChange"
  })
 const auth = useContext(AuthContext);
 const myId = auth.userId;
 const history = useHistory()
 const params = useParams().postId
 const [error, setError] = useState()
 const [errorModal, setErrorModal] = useState(false)
 const [post, setPost] = useState();
 const [user, setUser] = useState()
 const [users, setUsers] = useState();
 const [loading, setLoading] = useState(false);



 useEffect(() => {
   async function getPost() {
     let res;
     try{
       res = await api.get(`posts/${params}`)
      } catch(err) {
        setError("getting posts was unsuccessful")
        setErrorModal(true)
        setTimeout(function() {setErrorModal(false)}, 2000)
      }

     console.log(res);
     setPost(res.data.post)
    }
    getPost()
  }, [params, loading])
  
  useEffect(() => {
    async function fetchUsers() {
      let res;
      try{
        const res = await api.get('users')

      } catch(err) {
        setError("Getting users was unsuccessful")
        setErrorModal(true)
        setTimeout(function() {setErrorModal(false)}, 2000)
      }
      console.log(res)
      setUsers(res.data.users)
      setUser(res.data.users.find(user => user.id === myId))
    }
    fetchUsers()
  }, [])
  
  const commentSubmitHandler = (data) => {
   console.log(data)
   async function sendComment() {
     const newData = {comment: data.comment, commentor: myId}
     let res;
     try{
       res = await api.patch(`posts/comments/${params}`, newData, {headers: {'Content-Type': 'application/json'}})

     } catch(err) {
      setError("Error posting comment")
      setErrorModal(true)
      setTimeout(function() {setErrorModal(false)}, 2000)
     }
     console.log(res)
     setError("Comment posted!")
     setErrorModal(true)
      setTimeout(function() {setErrorModal(false)}, 2000)
     setLoading(!loading)
   }
 
  //  async function fetchUsers() {const res = await api.get(`posts/${params}`)
  //  setPost(res.data.post)
  // }
   sendComment()

  //  fetchUsers()
 
   reset({})
  }

  const deleteHandler = (commentId) => {
    setLoading(true)
    async function deleteComment() {
      let res;
      try{
        res = await api.patch(`posts/comment-delete/${commentId}`, {postId: post.id}, {headers: {'Content-Type': 'application/json'}})

      } catch(err) {
        setError("Error deleting comment")
        setErrorModal(true)
        setTimeout(function() {setErrorModal(false)}, 2000)
      }
      setError('Deleted comment')
      setErrorModal(true)
      setTimeout(function() {setErrorModal(false)}, 2000)
      console.log(res);
      setLoading(false)
    }
    deleteComment()
  }

  const heartHandler = () => {
    setError("This Feature Isnt Working Yet -__-")
    setErrorModal(true)
    setTimeout(function() {setErrorModal(false)}, 2000)
   }
  
   
  
   

  return(
    <div>
      <div className="comments-header">
      <div onClick={history.goBack} className="comments-back-navlink"><BsChevronLeft className="following-back-icon"/></div>
        <p>Comments</p>
      </div>

      <div className="comment-input-wrapper">
        <div className="comment-portrait-wrapper">
          {user && !user.image && <IoPersonCircle className="comment-no-icon"/>}
          {user && user.image && <img alt="" src={user.image} />}
        </div>
        <form className="comment-input-holder" onSubmit={handleSubmit(commentSubmitHandler)}>
        {commentContent.inputs.map((input,key) => {
            return (
              <div key={key} className="CommentInputWrapper">
                <input style={{fontSize: "16px"}} className="add-comment-input" name={input.name} placeholder={input.label} type={input.type} {...register(input.name)} deletable={false} />
              </div>
            )
          } )}
       
          <button className="post-comment-button" type="submit" disabled={!formState.isValid}>Post</button>
        </form>

      </div>
      {post && users && <div className="post-description-comment">
        <Comment comment={{comment: post.description, date: {time: post.date.time}}} user={users.find(user => user.id === post.user)} heart={false} />
      </div>}
      {post && users && post.comments.length !== 0 && <div className="full-comment-list">
          {post.comments.map((comment, index) => <Comment deleteHandler={deleteHandler} key={index} comment={comment} commentId={comment.id} user={users.find(user => user.id === comment.user)} heart={true} myId={myId} postUser={post.user} deletable={true} heartHandler={heartHandler} />)}
      </div>}
      <ErrorModal
      show={errorModal}
      children={<p className="errorText">{error}</p>}
      />
    </div>
  )
}

export default Comments;