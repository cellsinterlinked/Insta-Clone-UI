import React, {useState, useEffect} from 'react'
import './ListHashTag.css';
import api from '../../Static/axios';
import { NavLink } from 'react-router-dom'
import ErrorModal from '../Reusable/ErrorModal';

const ListHashTag = ({hashTag, hashHandler, followedArr, shortHash}) => {
  const [posts, setPosts] = useState()
  const [popular, setPopular] = useState()
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    async function getPosts() {
      let res;
      try{
        res = await api.get(`posts/hash/${shortHash}`)
      } catch(err) {
        setError("Error getting posts")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

      setPosts(res.data.posts)
      setPopular(res.data.popular)
    }
    getPosts()
  }, [hashTag, shortHash])

  return (
    <div>
      <ErrorModal 
      children={<p className="errorText">{error}</p>}
      show={showError}
      />
     {posts && popular &&  <div className="listHash-wrapper">
      <div className="list-hash-wrapper1">
        <div className='list-hash-image-wrapper'>
          <img alt="" src={popular[0].image}/>
        </div>
        <NavLink to={`hashtag/${shortHash}`} className="list-hash-names-wrapper">
          <p >{hashTag}</p>
           <p style={{color: "#8e8e8e", fontWeight: "400" }}>{posts.length} posts</p>
        </NavLink>
      </div>
     <div className="list-person-wrapper2">

        {followedArr.includes(hashTag) ? <button onClick={() => hashHandler(hashTag)}className="list-following-button">
          Following
        </button> : <button onClick={() => hashHandler(hashTag)} className="list-follow-button">
          Follow
        </button> }

       

      </div>
        

    </div>}
    </div>
  )
}

export default ListHashTag
