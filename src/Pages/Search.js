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



  useEffect(() => {
    async function getHashTags() {
      const res = await api.get('/posts/hashtags')
      setHashTags(res.data.hashTags)
      setFullTags(res.data.fullTags)
    }
    getHashTags()
  },[])

  useEffect(() => {
    async function getUser() {
      const res = await api.get(`users/${myId}`)
      console.log(res);
      setUser(res.data.user)
    }
    getUser()
  }, [loading])

  useEffect(() => {
    async function fetchPosts() {
      const res = await api.get('posts')
      console.log(res)
      setPosts(res.data.posts.reverse())
    }
    fetchPosts()

  },[loading])

  useEffect(() => {
    async function fetchUsers() {
      const res = await api.get('users')
      console.log(res)
      let allUsers = res.data.users.filter(user => user.id !== myId)
      setUsers(allUsers)
    }
    fetchUsers()

  }, [])

  
  useEffect(() => {
    if (hashTags && query && query[0] === "#") {
      setDisplayedHashTags(hashTags.filter(tag => tag.includes(query)))
    }
  }, [query, hashTags])

  useEffect(() => {
    if (users && query && query[0] !== "#") {
      setDisplayedUsers(users.filter(user => user.userName.toLowerCase().includes(query) || user.name.toLowerCase().includes(query)))
    }
  },[query, users])
  
  
  
  const queryHandler = (e) => {
    setQuery(e.target.value)
    // console.log(e.target.value)
    // console.log(displayedHashTags)
    // console.log(displayedUsers)
  }

  const countHash = (array, value) => {
    return array.reduce((h, x) => h + (x === value), 0);
  }

  const cancelSearch = () => {
    setQuery("")
    document.getElementById("search-page-input").value = ""
    
  }
  

  return (
    <div>
      <div className="search-header-wrapper">
        <input id="search-page-input" className="search-input" placeholder="Search" onChange={queryHandler}></input>
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
        {displayedUsers.map((user, index) => <div key={index} className="search-user-object">
          <div className="search-user-portrait">
            <img alt="user" src={user.image} />

          </div>
          <div className="search-user-name-container">
            <p style={{fontWeight: "bold"}}>{user.userName}</p>
            <p style={{color: "#8e8e8e"}}>{user.name}</p>
          </div>


        </div>)}


      </div>
      
      }
     
      {posts && !query && <div className="profile-grid-wrapper search-margin-top">
          {posts.map((post, index) => 
          <NavLink to={`post/${post.id}`} className="grid-picture-wrapper"key={index}>
            <img alt="" src={post.image} />
          </NavLink>)}
          </div>}
    <BottomNav />
    </div>
  )
}

export default Search