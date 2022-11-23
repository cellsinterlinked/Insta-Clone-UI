import React, {useState, useEffect, useContext} from 'react'
import api from '../Static/axios';
import Post from '../Components/Reusable/Post';
import './Search.css';
import './User.css';
import {NavLink} from 'react-router-dom';
import BottomNav from '../Components/Navigation/BottomNav';
import {BsHash} from 'react-icons/bs';
import {MdCancel} from 'react-icons/md'
import { AuthContext } from '../Context/auth-context';
import Spinner from '../Components/Reusable/Spinner2';
import { IoPersonCircle } from 'react-icons/io5'
import ErrorModal from '../Components/Reusable/ErrorModal'

const Search = () => {
  const auth = useContext(AuthContext)
  const myId = auth.userId;
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState()
  const [users, setUsers] = useState()
  const [user, setUser] = useState()
  const [query, setQuery] = useState()
  const [displayedUsers, setDisplayedUsers] = useState();
  const [displayedHashTags, setDisplayedHashTags] = useState();
  const [hashTags, setHashTags] = useState();
  const [fullTags, setFullTags] = useState()
  const [error, setError] = useState()
  const [showError, setShowError] = useState(false);



  useEffect(() => {
    async function getHashTags() {
      let res;
      try{
        res = await api.get('/posts/hashtags')
      } catch(err) {
        setError("Error getting hashtags")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

      setHashTags(res.data.hashTags)
      setFullTags(res.data.fullTags)
    }
    getHashTags()
  },[])

  useEffect(() => {
    async function getUser() {
      let res;
      try{
        res = await api.get(`users/${myId}`)
      } catch(err) {
        setError("Error getting user")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

    
      setUser(res.data.user)
    }
    getUser()
  }, [loading])

  useEffect(() => {
    async function fetchPosts() {
      let res;
      try{
        res = await api.get('posts')
      } catch(err) {
        setError("Error getting posts")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

     
      setPosts(res.data.posts.reverse())
    }
    fetchPosts()

  },[loading])

  useEffect(() => {
    async function fetchUsers() {
      let res;
      try{
        res = await api.get('users')
      } catch(err) {
        setError("Error getting users")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

     
      let allUsers = res.data.users.filter(user => user.id !== myId)
      setUsers(allUsers)
    }
    fetchUsers()

  }, [])

  
  useEffect(() => {
    if (hashTags && query && query[0] === "#") {
      setDisplayedHashTags(hashTags.filter(tag => tag.includes(query.toLowerCase())))
    }
  }, [query, hashTags])

  useEffect(() => {
    if (users && query && query[0] !== "#") {
      setDisplayedUsers(users.filter(user => user.userName.toLowerCase().includes(query.toLowerCase()) || user.name.toLowerCase().includes(query)))
    }
  },[query, users])
  
  
  
  const queryHandler = (e) => {
    setQuery(e.target.value)
    
  }

  const countHash = (array, value) => {
    return array.reduce((h, x) => h + (x === value), 0);
  }

  const cancelSearch = () => {
    setQuery("")
    document.getElementById("search-page-input").value = ""
    
  }
  

  return (
    <>
     <ErrorModal 
      children={<p className="errorText">{error}</p>}
      show={showError}
      />
    {(!myId || !posts || !user || !users || !hashTags) && <Spinner />}
    {myId && posts && user && users && hashTags && <div>
      <div className="search-header-wrapper">
        <input style={{fontSize: "16px"}} id="search-page-input" className="search-input" placeholder="Search" onChange={queryHandler}></input>
        {query && <MdCancel className="cancel-input" onClick={cancelSearch} />}
      </div>

      {query && query[0] === "#" && displayedHashTags &&
      <div className="hash-search-wrapper">
      {displayedHashTags.map((tag, index) => 
      <NavLink to={`hashtag/${tag.slice(1)}`} key={index} className="hash-search-list-wrapper">
      <div className="hash-search-circle">
        <BsHash className="hash-search-icon"/>
      </div>  

      <div className="hash-search-deets-wrapper">
        <p style={{fontWeight: "600", textDecoration: "none", color: "black"}}>{tag}</p>
        <p style={{color: "#8e8e8e", textDecoration: "none"}}>{countHash(fullTags, tag)} posts</p>

      </div>
        
        
      </NavLink>)}
      </div>
      }


      {query && query[0] !== "#" && displayedUsers &&
      <div className="user-search-container">
        {displayedUsers.map((user, index) => <NavLink style={{textDecoration: "none"}} to={`/user/${user.userName}`} key={index} className="search-user-object">
          <div className="search-user-portrait">
            {user.image ? <img alt="" src={user.image} /> : <IoPersonCircle style={{height:"100%", width:"100%", color:"#dbdbdb"}}/> }

          </div>
          <div className="search-user-name-container">
            <p style={{fontWeight: "bold", color: "black"}}>{user.userName}</p>
            <p style={{color: "#8e8e8e"}}>{user.name}</p>
          </div>


        </NavLink>)}


      </div>
      
      }
     
      {posts && !query && <div className="profile-grid-wrapper search-margin-top">
          {posts.map((post, index) => 
          <NavLink to={`post/${post.id}`} className="grid-picture-wrapper"key={index}>
            <img alt="" src={post.image} />
          </NavLink>)}
          </div>}
    {<BottomNav notificationNumber={user.activityNotifications} />}
    </div>}
    </>
  )
}

export default Search