import React, {useState, useEffect} from 'react'
import api from '../Static/axios';
import Post from '../Components/Reusable/Post';
import './Search.css';
import './User.css';
import {NavLink} from 'react-router-dom';
import BottomNav from '../Components/Navigation/BottomNav';

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState()
  const [users, setUsers] = useState()
  const [user, setUser] = useState()
  const [query, setQuery] = useState()
  const [displayedUsers, setDisplayedUsers] = useState();
  const [displayedHashTags, setDisplayedHashTags] = useState();

  useEffect(() => {
    async function getUser() {
      const res = await api.get('users/60f701da7c0a002afd585c03')
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
      setUsers(res.data.users)
    }
    fetchUsers()

  }, [])

  
  // useEffect(() => {
  //   if(posts) {
  //   for(let i = 0; i <= posts.length; i++) {
  //     console.log(posts[i].hashTags.find(tag => tag.includes(query)))
  //   } 
  //   // setDisplayedHashTags(newArr)
  //   // console.log(newArr)
  //   }
  // },[query, posts])
  
  
  
  const queryHandler = (e) => {
    setQuery(e.target.value)
    // console.log(e.target.value)
    // console.log(displayedHashTags)
    // console.log(displayedUsers)
  }

  

  return (
    <div>
      <div className="search-header-wrapper">
        <input className="search-input" placeholder="Search" onChange={queryHandler}></input>
      </div>
      {/* <div className="search-list-container">
      {posts && users && user && posts.map((post, index) => 
      <Post  
        post={post} 
        key={index} 
        myId={"60f701da7c0a002afd585c03"} 
        user={users.find(u => u.id === post.user)} 
        likeHandler={likeHandler} loading={loading}
        viewer={user}
        /> )}
      </div> */}
      {posts && <div className="profile-grid-wrapper search-margin-top">
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