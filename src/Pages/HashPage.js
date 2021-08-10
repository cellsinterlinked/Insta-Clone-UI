import React, {useState, useEffect} from 'react'
import './HashPage.css';
import {BsChevronLeft} from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import api from '../Static/axios';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const HashPage = () => {
  let history = useHistory()
  const [posts, setPosts] = useState()
  const [recent, setRecent] = useState();
  const [popular, setPopular] = useState()
  const params = useParams().hash;

useEffect(() => {
  async function getPosts() {
    const res = await api.get(`posts/hash/${params}`)
    console.log(res.data.posts)
    setPosts(res.data.posts)
    setRecent(res.data.recent)
    setPopular(res.data.popular)
  }
  getPosts()
}, [params])


  return (
    <div className="hash-page-wrapper">
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
          <button className="hash-follow-button">Follow</button>
        </div>
      </div>}

      <p style={{marginLeft: "1rem", fontWeight: "bold", color: "#8E8E8E", fontSize: "0.9rem" }}>Top posts</p>

      {popular && 
      <div className="hash-top-posts-grid">
        {popular.map((post, index) => 
          <NavLink to={`post/${post.id}`} className="grid-hash-picture-wrapper"key={index}>
            <img alt="" src={post.image} />
          </NavLink>)}

      </div>
      
      }

<p style={{marginLeft: "1rem", fontWeight: "bold", color: "#8E8E8E", fontSize: "0.9rem" }}>Most recent </p>

      {recent && 
      <div className="hash-top-posts-grid">
        {recent.map((post, index) => 
          <NavLink to={`post/${post.id}`} className="grid-hash-picture-wrapper"key={index}>
            <img alt="" src={post.image} />
          </NavLink>)}

      </div>
      
      }

    </div>
  )
}

export default HashPage