import React, {useState, useEffect, useContext} from 'react'
import './HashPage.css';
import {BsChevronLeft} from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import api from '../Static/axios';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import ErrorModal from '../Components/Reusable/ErrorModal';
import { AuthContext } from '../Context/auth-context';

const HashPage = () => {
  let auth = useContext(AuthContext)
  let myId = auth.userId
  let history = useHistory()
  const [posts, setPosts] = useState()
  const [recent, setRecent] = useState();
  const [popular, setPopular] = useState()
  const [user, setUser] = useState();
  const [followedHashTags, setFollowedHashTags] = useState([])
  const params = useParams().hash;
  const fullParams = `#${params}`
  const [error, setError] = useState()
  const [showError, setShowError] = useState(false)

 

  async function getUser() {
    let res;
    try{
      res = await api.get(`users/${myId}`)

    } catch(err) {
      setError("Error getting user info")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }
    setUser(res.data.user);
    setFollowedHashTags(res.data.user.followedHash)
 

  }

  async function getPosts() {
    let res;
    try{
      res = await api.get(`posts/hash/${params}`)
    } catch(err) {
      setError("Error getting posts")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

    setPosts(res.data.posts)
    setRecent(res.data.recent)
    setPopular(res.data.popular)
  }


useEffect(() => {
  getPosts()
  getUser()
}, [])

const followHandler = async() => {
  let res;
  try{
  res = await api.patch(`users/hashtags/${myId}`, {hashTag: fullParams})
    
  } catch(err) {
    setError("Error editing follows")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
  }
 
  if (followedHashTags.includes(fullParams)) {
    setFollowedHashTags(followedHashTags.filter(h => h !== fullParams))
    setError(`Unfollowed ${fullParams}`)
    setShowError(true)

  } else {
    setFollowedHashTags([...followedHashTags, fullParams])
    setError(`Followed ${fullParams}`)
    setShowError(true)
  }
  setTimeout(function() {setShowError(false)}, 2000)
}


  return (
    <div className="hash-page-wrapper">
       <ErrorModal
     show={showError}
     children={<p className="errorText">{error}</p>}
    />
      <div className="hash-page-header">
        <p>{`#${params}`}</p>
        <div className="hash-page-back">
          <BsChevronLeft className="hash-page-back-icon" onClick={history.goBack}/>
        </div>
      </div>

      { posts && <div className="hash-page-top-details">
        <div className="hash-page-top-image">
          <img alt="" src={posts[0].image} />
        </div>

        <div className="hash-page-button-wrapper">
          <p><strong>{posts.length}</strong> posts</p>
          {followedHashTags.includes(fullParams) ? <button onClick={followHandler} className="hash-following-button">Following</button> : <button onClick={followHandler} className="hash-follow-button">Follow</button>}
        </div>
      </div>}

      <p style={{marginLeft: "1rem", fontWeight: "bold", color: "#8E8E8E", fontSize: "0.9rem" }}>Top posts</p>

      {popular && 
      <div className="hash-top-posts-grid">
        {popular.map((post, index) => 
          <NavLink to={`/post/${post.id}`} className="grid-hash-picture-wrapper"key={index}>
            <img alt="" src={post.image} />
          </NavLink>)}

      </div>
      
      }

<p style={{marginLeft: "1rem", fontWeight: "bold", color: "#8E8E8E", fontSize: "0.9rem" }}>Most recent </p>

      {recent && 
      <div className="hash-top-posts-grid">
        {recent.map((post, index) => 
          <NavLink to={`/post/${post.id}`} className="grid-hash-picture-wrapper"key={index}>
            <img alt="" src={post.image} />
          </NavLink>)}

      </div>
      
      }

    </div>
  )
}

export default HashPage