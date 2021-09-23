import React, { useState, useEffect, useContext } from 'react';
import api from '../Static/axios';
import './Following.css';
import { useParams } from 'react-router-dom';
import ListPerson from '../Components/Reusable/ListPerson';
import { NavLink } from 'react-router-dom';
import { BsChevronLeft } from 'react-icons/bs';
import './Following.css';
import BottomNav from '../Components/Navigation/BottomNav';
import { AuthContext } from '../Context/auth-context';
import ErrorModal from '../Components/Reusable/ErrorModal';

const ProfileFollowing = () => {
  const auth = useContext(AuthContext);
  const myId = auth.userId;
  const params = useParams().username;
  const [following, setFollowing] = useState();
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState(true);
  const [followedArr, setFollowedArr] = useState();
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false);

  async function getMe() {
    const res = await api.get(`users/${myId}`);
    setFollowedArr(res.data.user.following);
  }

  useEffect(() => {
    async function fetchFollowed() {
      let res;
      try {
        res = await api.get(`users/profile/following/${params}`);
      } catch (err) {
        setError('Error fetching followed users');
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
      }

      setFollowing(res.data.users);
    }
    fetchFollowed();
    getMe();
  }, [params]);

  const unfollow = async (friend) => {
    let res;
    try {
      res = await api.patch(
        `users/following/${myId}`,
        { otherUser: friend.id },
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      setError('Error while trying to unfollow');
      setShowError(true);
      setTimeout(function () {
        setShowError(false);
      }, 2000);
    }

    setFollowedArr(followedArr.filter((u) => u !== friend.id));
    setError(`You unfollowed ${friend.userName}`);
    setShowError(true);
    setTimeout(function () {
      setShowError(false);
    }, 2000);
  };

  const follow = async (friend) => {
    let res;
    try {
      res = await api.patch(`users/following/${myId}`, {
        otherUser: friend.id,
      });
    } catch (err) {
      setError('Error while trying to follow');
      setShowError(true);
      setTimeout(function () {
        setShowError(false);
      }, 2000);
    }
    setFollowedArr([...followedArr, friend.id]);
    setError(`You followed ${friend.userName}`);
    setShowError(true);
    setTimeout(function () {
      setShowError(false);
    }, 2000);
  };

  return (
    <div>
      <ErrorModal
        show={showError}
        children={<p className="errorText">{error}</p>}
      />
      <div className="following-header-wrapper">
        <NavLink to={`/user/${params}`} className="back-navlink">
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
      <div className="following-list-margin">
        {following && following.length !== 0 && (
          <div className="following-list-wrapper">
            {following.map((user, index) => (
              <ListPerson
                user={user}
                myId={myId}
                key={index}
                followed={true}
                removeFollowing={unfollow}
                addFollowing={follow}
                followedArr={followedArr}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfileFollowing;
