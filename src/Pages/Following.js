import React, { useState, useEffect } from 'react';
import api from '../Static/axios';
import './Following.css';
import { BsChevronLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import ListPerson from '../Components/Reusable/ListPerson';
import BottomNav from '../Components/Navigation/BottomNav';
import ListHashTag from '../Components/Reusable/ListHashTag';

const Following = () => {
  const myId = '60f701da7c0a002afd585c03';
  const [popular, setPopular] = useState();
  const [followed, setFollowed] = useState();
  // change to set following?
  const [people, setPeople] = useState(true);
  const [loading, setLoading] = useState(false);
  const [followedArr, setFollowedArr] =useState([])
  const [me, setMe] = useState()
  const [followedHashTags, setFollowedHashTags] = useState([])

  async function fetchMe() {
    const res = await api.get('users/60f701da7c0a002afd585c03');
    setMe(res.data.user)
    setFollowedArr(res.data.user.following)
    setFollowedHashTags(res.data.user.followedHash)
    console.log(res.data.user.followedHash)
  }

  async function fetchFollowed() {
    const res = await api.get('users/following/60f701da7c0a002afd585c03');
    setFollowed(res.data.users);
  }
  
  async function fetchPopular() {
    const res = await api.get('users/popular/60f701da7c0a002afd585c03');
    setPopular(res.data.users);
  }
  
  async function unfollow(friend) {
    const res = await api.patch(
      'users/following/60f701da7c0a002afd585c03',
      { otherUser: friend.id },
      { headers: { 'Content-Type': 'application/json' } }
    );
    setFollowedArr(followedArr.filter(u => u !== friend.id))
    // setLoading(!loading);
  }

  async function follow(friend) {
    const res = await api.patch(
      'users/following/60f701da7c0a002afd585c03',
      { otherUser: friend.id },
      { headers: { 'Content-Type': 'application/json' } }
    );
   setFollowedArr([...followedArr, friend.id])
    // setLoading(!loading);
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
    const res = await api.patch('users/hashtags/60f701da7c0a002afd585c03', {hashTag: hashTag})
    console.log(res)
    if (followedHashTags.includes(hashTag)) {
      setFollowedHashTags(followedHashTags.filter(h => h !== hashTag))
    } else {
      setFollowedHashTags([...followedHashTags, hashTag])
    }
  }

  return (
    <div>
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
        {followedHashTags &&  
        <div className="following-list-wrapper">

       {followedHashTags.map((tag, index) => (<ListHashTag hashTag={tag} shortHash={tag.slice(1)} key={index} hashHandler={hashHandler} followedArr={followedHashTags}/>))}
          </div>}

        </div>}

      <BottomNav />
    </div>
  );
};

export default Following;
