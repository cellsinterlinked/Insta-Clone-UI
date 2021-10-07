import React, { useState, useEffect, useContext } from 'react';
import api from '../Static/axios';
import './Following.css';
import { BsChevronLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import ListPerson from '../Components/Reusable/ListPerson';
import BottomNav from '../Components/Navigation/BottomNav';
import ListHashTag from '../Components/Reusable/ListHashTag';
import ErrorModal from '../Components/Reusable/ErrorModal';
import { BsHash } from 'react-icons/bs';
import { AuthContext } from '../Context/auth-context';
import Spinner from '../Components/Reusable/Spinner';

const Following = () => {
  const auth = useContext(AuthContext)
  const myId = auth.userId;
  const [popular, setPopular] = useState();
  const [followed, setFollowed] = useState();
  // change to set following?
  const [people, setPeople] = useState(true);
  const [loading, setLoading] = useState(false);
  const [followedArr, setFollowedArr] =useState([])
  const [me, setMe] = useState()
  const [followedHashTags, setFollowedHashTags] = useState([])
  const [error, setError] = useState()
  const [showError, setShowError] = useState(false)

  async function fetchMe() {
    let res;
    try{
      res = await api.get(`users/${myId}`);
    } catch(err) {
      setError("Error fetching your info")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

    setMe(res.data.user)
    setFollowedArr(res.data.user.following)
    setFollowedHashTags(res.data.user.followedHash)
    console.log(res.data.user.followedHash)
  }

  async function fetchFollowed() {
    let res;
    try{
      res = await api.get(`users/following/${myId}`);
    } catch(err) {
      setFollowed([])
      setError("You haven't followed anyone yet!")
      setShowError(true)
      setTimeout(function() {setShowError(false)}, 2000)
      return
    }

    setFollowed(res.data.users);
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
  
  async function unfollow(friend) {
    let res;
    try{
       res = await api.patch(
        `users/following/${myId}`,
        { otherUser: friend.id },
      );

    } catch(err) {
      setError("Error unfollowing")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }
    setFollowedArr(followedArr.filter(u => u !== friend.id))
    setError(`You unfollowed ${friend.userName}`)
    setShowError(true)
    setTimeout(function() {setShowError(false)}, 2000)
    
  }

  async function follow(friend) {
    let res;
    try{
      res = await api.patch(
        `users/following/${myId}`,
        { otherUser: friend.id },
      );

    } catch(err) {
      setError("Error following")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }
   setFollowedArr([...followedArr, friend.id])
   setError(`You followed ${friend.userName}`)
    setShowError(true)
    setTimeout(function() {setShowError(false)}, 2000)
   
  }

  useEffect(() => {
    fetchMe()
    fetchFollowed();
    fetchPopular();
  }, []);


  const removeFollowing = async (friend) => {
    await unfollow(friend);
    // await fetchFollowed()
    // await fetchPopular()
    // await fetchFollowed()
  };

  const addFollowing = async (friend) => {
    await follow(friend);
    // await fetchFollowed()
    // await fetchPopular()
    // await fetchFollowed();
  };


  const hashHandler = async(hashTag) => {
    let res;
    try{
      res = await api.patch(`users/hashtags/${myId}`, {hashTag: hashTag})

    } catch(err) {
      setError("Error editing your followed hashtags")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }
    console.log(res)
    if (followedHashTags.includes(hashTag)) {
      setFollowedHashTags(followedHashTags.filter(h => h !== hashTag))
      setError(`Unfollowed ${hashTag}`)
      setShowError(true)
    } else {
      setFollowedHashTags([...followedHashTags, hashTag])
      setError(`Followed ${hashTag}`)
      setShowError(true)
    }
    setTimeout(function() {setShowError(false)}, 2000)
  }

  return (
    <>
    {(!myId || !me || !popular) && <Spinner />}
    {popular && me && myId && <div>
       <ErrorModal
     show={showError}
     children={<p className="errorText">{error}</p>}
    />
      <div className="following-header-wrapper">
        <NavLink to="/account" className="back-navlink">
          <BsChevronLeft className="following-back-icon" />
        </NavLink>
        <p>Following</p>
      </div>

      <div className="following-options-wrapper">
        <div
          style={{
            borderBottom:
              people === true ? '1px solid black' : ' 1px solid #dbdbdb',
          }}
          className="following-options-button"
          onClick={() => setPeople(true)}
        >
          <p style={{ color: people === true ? 'black' : '#8e8e8e' }}>PEOPLE</p>
        </div>
        <div
          style={{
            borderBottom:
              people === false ? '1px solid black' : ' 1px solid #dbdbdb',
          }}
          className="following-options-button"
          onClick={() => setPeople(false)}
        >
          <p style={{ color: people === false ? 'black' : '#8e8e8e' }}>
            HASHTAGS
          </p>
        </div>
      </div>
      {people === true && <div className="following-list-margin">
        {followed && followed.length !== 0 && (
          <div className="following-list-wrapper">
            {followed.map((user, index) => (
              <ListPerson
                user={user}
                key={index}
                removeFollowing={removeFollowing}
                myId={myId}
                followedArr={followedArr}
              />
            ))}
          </div>
        )}

        <div className="follow-suggestions-text">
          <p>Suggestions For You</p>
        </div>

        {popular && popular.length !== 0 && (
          <div className="following-list-wrapper2">
            {popular.map((user, index) => (
              <ListPerson
                user={user}
                key={index}
                addFollowing={addFollowing}
                myId={myId}
                followedArr={followedArr}
              />
            ))}
          </div>
        )}
      </div>}

      {people === false && <div className="following-list-margin">
        {followedHashTags.length === 0 && 
        <div className='no-hash-wrapper'>
          <div className="no-hash-circle">
            {/* <BsHash className="hash-icon"/> */}
            <h2>#</h2>
          </div>
          <h1>Hashtags you follow</h1>
          <p>Once you follow hashtags, you'll see them here.</p>
        </div>}



        {followedHashTags &&  
        <div className="following-list-wrapper">

       {followedHashTags.map((tag, index) => (<ListHashTag hashTag={tag} shortHash={tag.slice(1)} key={index} hashHandler={hashHandler} followedArr={followedHashTags}/>))}
          </div>}

        </div>}

      <BottomNav />
    </div>}
    </>
  );
};

export default Following;
