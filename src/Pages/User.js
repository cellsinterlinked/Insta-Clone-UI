import React, {useState, useEffect, useContext} from 'react';
import api from '../Static/axios';
import { useParams, NavLink } from 'react-router-dom';
import { BsChevronLeft} from 'react-icons/bs';
import './User.css';
import '../Components/Reusable/Modal.css';
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
import ErrorModal from '../Components/Reusable/ErrorModal';
import Modal from '../Components/Reusable/Modal';
import Suggested from '../Components/Reusable/Suggested';
import Spinner from '../Components/Reusable/Spinner';
import { IoPersonCircle } from 'react-icons/io5'



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
const [error, setError] = useState()
const [showError, setShowError] = useState(false)
const [followedArr, setFollowedArr] = useState()
const [showModal, setShowModal] = useState(false)
const [suggested, setSuggested] = useState(false)
const [popular, setPopular] = useState()


async function getViewer() {
  let res;
  try{
    res = await api.get(`users/${myId}`)
  } catch(err) {
    setError("Error getting your user data")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
  }

  setViewer(res.data.user)
  setFollowedArr(res.data.user.following)
}

async function getUser() {
  let res;
  try{
    res = await api.get(`/users/profile/${params}`)
  } catch(err) {
    setError("Error getting user data")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
  }

  setUser(res.data.user);
}

async function fetchPopular() {
  let res;
  try{
    res = await api.get(`users/popular/${myId}`);
  } catch(err) {
    setError("Error fetching popular users")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
  }

  setPopular(res.data.users);
}

const follow = async () => {
  let res;
  try{
    res = await api.patch(
      `users/following/${myId}`,
      { otherUser: user.id },
    );
  } catch(err) {
    setError("Error trying to follow")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
  }

 setFollowedArr([...followedArr, user.id])
 setError(`You followed ${user.userName}`)
 setShowError(true)
 setTimeout(function() {setShowError(false)}, 2000)
}

const suggestedFollow = async (user) => {
  let res;
  try{
    res = await api.patch(
      `users/following/${myId}`,
      { otherUser: user.id },
    );

  } catch(err) {
    setError("An error occured")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
  }
 setFollowedArr([...followedArr, user.id])
 setError(`You followed ${user.userName}`)
 setShowError(true)
 setTimeout(function() {setShowError(false)}, 2000)
}

const suggestedUnfollow = async (user) => {
  let res;
  try{
    res = await api.patch(
     `users/following/${myId}`, 
     {otherUser: user.id}, 
     {headers: {'Content-Type': 'application/json'}})
    } catch(err) {
      setError("An error occured")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

  setShowModal(false)
  setFollowedArr(followedArr.filter(u => u !== user.id))
  setError(`You unfollowed ${user.userName}`)
  setShowError(true)
  setTimeout(function() {setShowError(false)}, 2000)
  
}
const unfollow = async (user) => {
  let res;
  try{
    res = await api.patch(
      `users/following/${myId}`, 
      {otherUser: user.id}, 
      {headers: {'Content-Type': 'application/json'}})
    } catch(err) {
      setError("Error unfollowing")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

  setShowModal(false)
  setFollowedArr(followedArr.filter(u => u !== user.id))
  setError(`You unfollowed ${user.userName}`)
  setShowError(true)
  setTimeout(function() {setShowError(false)}, 2000)
  
}


useEffect(() => {
  getViewer()
  getUser();
  fetchPopular()
}, [params])



useEffect(() => {
  async function getPosts() {
    let res; 
    try{
      res = await api.get(`/posts/profile/${params}`)
    } catch(err) {
      setPosts([])
      setError("Error getting posts")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
        return
    }

    setPosts(res.data.posts.reverse())

  }
  getPosts()
},[params, loading])

useEffect(() => {
  async function getTagged() {
    let res;
    try{
      res = await api.get(`/posts/tagged/${params}`)
    } catch(err) {
      setError("Error getting tagged posts")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

    setTagged(res.data.posts.reverse())
  }
  getTagged();
}, [params])
    

const likeHandler = (postId) => {

  async function likeClick() {
    let res;
    try{
      res = await api.patch(`posts/likes/${postId}`, {user: myId})
    } catch(err) {
      setError("An error occured")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

    setLoading(!loading);
  }
  likeClick()
}

const suggestedHandler = () => {
  setSuggested(!suggested)
}



const messageHandler = async () => {
  let conversation = []
  let res;
  async function loop() {
    for (let i = 0; i < viewer.convos.length; i++) {
      if (user.convos.includes(viewer.convos[i])) {
        conversation.push(viewer.convos[i])
        history.push(`/direct/${conversation[0]}`)
      }
    }
  }
    
    
  await loop()
  if (conversation.length === 0) {
    try{
      res = await  api.post('convos', {user1: myId, user2: user.id, message:"init", image: ""})
    } catch(err) {
      setError("An error occured")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

    history.push(`/direct/${res.data.convo.id}`)
  }
}

const developingError = () => {
  setError("Blocking feature in development!")
  setShowError(true)
  setTimeout(function() {setShowError(false)}, 2000)
}


  
const modalHandler = () => {
  setShowModal(true);
}    

const cancelModalHandler = () => {
  setShowModal(false);
}

const removeItem = (id) => {
  setPopular(popular.filter(user => user.id !== id)) 
}

  return(
    <>
    {(!user || !viewer || !myId) && <Spinner />}
    {user && viewer && <div className="user-wrapper">
      <Modal 
    show={showModal}
    onCancel={cancelModalHandler}
    children = {user && <div className="post-modal-wrapper">
      <div className="unfollow-modal-portrait">
        <img alt="" src={user.image}/>
        </div>
      <p className="unfollow-modal-text">Unfollow @{user.userName}?</p>
      <div className="unfollow-modal-break"></div>
      <div className="danger-post-modal-button" onClick={() => unfollow(user)}>Unfollow</div>
      <div className="post-modal-button last-button-post-modal" onClick={cancelModalHandler}>Cancel</div>
    </div>

    }
    />
      <ErrorModal 
        show={showError}
        children={<p className="errorText">{error}</p>}
      />
       <div className="user-header-wrapper">
        <div onClick={history.goBack} className="profile-back-button">
          <BsChevronLeft className="profile-back-icon" />
        </div>
         <p>{params}</p>
      </div>
      <div className="wtf"></div>
   { user && viewer && followedArr && <div>

      <div className="profile-second-box" >
        <div className="profile-portrait-info-wrapper">
          <div className="profile-face-box">
            {user.image ? <img alt="" src={user.image}/>: <IoPersonCircle style={{height:"100%", width:"100%", color:"#dbdbdb"}}/>}
          </div>
          <div className="profile-name-buttons-wrapper">
              <div className="profile-name-wrapper">
                <p>{user.userName}</p>
                <FaCheckCircle className="profile-check-icon" />
                <BsThreeDots className="profile-dots-button" onClick={developingError} />
              </div>
              { followedArr.includes(user.id) && <div className="profile-buttons-wrapper">
                <button className="profile-message-button" onClick={messageHandler}>Message</button>
                <button className="profile-follow-button" onClick={modalHandler}>
                    <BsFillPersonFill className="follow-button-person"/>
                    <BsCheck className="follow-button-check" />
                </button>
                <button className="show-suggestions-profile-button" onClick={suggestedHandler}>
                  <BsChevronDown />
                </button>
              </div>}

              { !followedArr.includes(user.id) && <div className="profile-buttons-wrapper">
                <button className="profile-big-follow-button" onClick={follow}>Follow</button>
                <button className="show-suggestions-profile-button-blue" onClick={suggestedHandler} >
                  <BsChevronDown />
                  
                </button>
              </div>}


          </div>

        </div>
        {suggested && <div className="suggested-header">
          <p>Suggested</p>
        </div>}
        { suggested && 
        <Suggested followingArr={followedArr} users={popular} removeItem={removeItem} suggestedFollow={suggestedFollow} suggestedUnfollow={suggestedUnfollow}/>
        }
        { suggested && <div className="suggested-footer">
        </div>}

        <div className="profile-name-details-wrapper">
          <p className="profile-full-name">{user.name}</p>
          {user.bio && user.bio !== "" && <p className="profile-bio">{user.bio}</p>}
          {user.email && user.email !== "" && <a href={user.email} className="profile-email">{user.email}</a>}
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
          <NavLink to={`/post/${post.id}`} className="grid-picture-wrapper"key={index}>
            <img alt="" src={post.image} />
          </NavLink>)}
        </div>}

        {page === 2 && 
        <div className="profile-stream-wrapper">
          {posts.map((post, index) => 
            <Post post={post} key={index} myId={myId} user={user} viewer={viewer} likeHandler={likeHandler} loading={loading} unfollow={unfollow} followedArr={followedArr}/>
          )}
        </div>
        
        }

        {page === 3 && 
        <div className="working-content-wrapper">
          <div className="working-content-circle">
            <BsCollectionPlay className="working-content-icon" />
          </div>
          <h1>Feature In Development</h1>
          <p>The developer is a noob and hasn't gotten to this feature yet!</p>
            

        </div>
        }

        {page === 4 && 
        <div className="working-content-wrapper">
          <div className="working-content-circle">
            <GrChannel className="working-content-icon" />
          </div>
          <h1>Feature In Development</h1>
          <p>The developer is a noob and hasn't gotten to this feature yet!</p>
            

        </div>
        }

        {page === 5 && tagged && 
        <div className="profile-grid-wrapper">
        {tagged.map((post, index) => 
        <NavLink to={`/post/${post.id}`} className="grid-picture-wrapper"key={index}>
          <img alt="" src={post.image} />
        </NavLink>)}
        </div>}
        



      </div>}

      <BottomNav />
    </div>}
    </>
  )
}

export default User
