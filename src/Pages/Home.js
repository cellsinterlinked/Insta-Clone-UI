import React, { useState, useEffect, useContext } from 'react';
import './Landing.css';
import './Home.css';
import Post from '../Components/Reusable/Post';
import { FiCamera } from 'react-icons/fi';
import { IoPersonCircle } from 'react-icons/io5';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { BsPlusCircleFill } from 'react-icons/bs';
import api from '../Static/axios';
import { NavLink } from 'react-router-dom';
import BottomNav from '../Components/Navigation/BottomNav';
import ErrorModal from '../Components/Reusable/ErrorModal';
import Spinner from '../Components/Reusable/Spinner2';
import { AuthContext } from '../Context/auth-context';
import { CgDisplayFullwidth } from 'react-icons/cg';

const Home = () => {
  const auth = useContext(AuthContext);
  const myId = auth.userId;
  const [loading, setLoading] = useState(false);
  const [followed, setFollowed] = useState();
  const [posts, setPosts] = useState();
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [showError, setShowError] = useState();
  const [followedArr, setFollowedArr] = useState();
  const [messageNotifications, setMessageNotifications] = useState()

  useEffect(() => {
   
  }, [posts]);

  useEffect(() => {
    async function getUser() {
      let res;
      try {
        res = await api.get(`users/${auth.userId}`);
      } catch (err) {
        setError('Error getting user info');
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
        return;
      }
      const annoying = res.data.user;
      setFollowedArr(res.data.user.following);
      setUser(annoying);
    }

    async function getMessageNotifications() {
      let res;
      try {
        res = await api.get(`convos/notifications/${myId}`)
      } catch (err) {
        setError('Error getting user notifications');
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
        return;
      }
     
      setMessageNotifications(res.data.number)

    }

    getUser();
    getMessageNotifications()
  }, [loading, posts, auth.userId]);

  useEffect(() => {
    async function fetchFollowed() {
      let res;
      try {
        res = await api.get(`users/following/${auth.userId}`);
      } catch (err) {
        setFollowed([]);
        setError('You must follow users to populate your feed!');
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
        return;
      }
  
      setFollowed(res.data.users);
    }
    fetchFollowed();
  }, [loading, auth.userId]);

  useEffect(() => {
    async function fetchPosts() {
      let res;
      try {
        res = await api.get(`posts/followed/${auth.userId}`);
      } catch (err) {
        setPosts([]);
        setError('You must follow users to populate your feed!');
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
        return;
      }

      console.log(res.data.posts)
      const sortedPosts = res.data.posts.sort((a, b) =>  b.date.time - a.date.time)
      
      setPosts(sortedPosts);
    }
    fetchPosts();
  }, [loading, auth.userId]);

  const saveHandler = (postId) => {
    async function saveClick() {
      let res;
      try {
        res = await api.patch(`users/saves/${auth.userId}`, { postId: postId });
      } catch (err) {
        setError('Error Saving Post');
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
        return;
      }

      if (user.saves.includes(postId)) {
        setError('Removed this post from saves');
        setShowError(true);
      } else {
        setError('You saved this post');
        setShowError(true);
      }
    
      setLoading(!loading);
      setTimeout(function () {
        setShowError(false);
      }, 2000);
    }
    saveClick();
  };

  const likeHandler = (postId) => {
    async function likeClick() {
      let res;
      try {
        res = await api.patch(`posts/likes/${postId}`, { user: myId });
      } catch (err) {
        setError('Error liking post');
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
      }

      const thisPost = posts.find((post) => post.id === postId);
      if (thisPost.likes.includes(myId)) {
        setError('you unliked this post');
        setShowError(true);
      } else {
        setError('You liked this post');
        setShowError(true);
      }
     
      setLoading(!loading);
      setTimeout(function () {
        setShowError(false);
      }, 2000);
    }
    likeClick();
  };

  const unfollow = async (user) => {
    let res;
    try {
      res = await api.patch(
        `users/following/${myId}`,
        { otherUser: user.id },
        { headers: { 'Content-Type': 'application/json' } }
      );
    } catch (err) {
      setError('Error unfollowing');
      setShowError(true);
      setTimeout(function () {
        setShowError(false);
      }, 2000);
    }
    setFollowedArr(followedArr.filter((u) => u !== user.id));
    setError(`You unfollowed ${user.userName}`);
    setShowError(true);
    setTimeout(function () {
      setShowError(false);
    }, 2000);
  };

  return (
    <div className="landing-wrapper">
      <ErrorModal
        show={showError}
        children={<p className="errorText">{error}</p>}
      />
      <div className="home-header-wrapper">
        <NavLink to={'/create'} className="left-home-head-wrapper">
          <FiCamera className="home-icon" />
        </NavLink>
        <h1 className="home-head-text">Nonurgentgram</h1>
        <NavLink to={`/inbox`} className="right-home-head-wrapper">
          <IoPaperPlaneOutline className="home-icon" />
          {(messageNotifications && messageNotifications !== 0) ? <div className="message-notification-home">{messageNotifications}</div> : <div></div>}
        </NavLink>
      </div>

      {(!user || !myId || !followed || !posts) && <Spinner />}

      {user && myId && posts && followed && (
        <div>
          <div className="home-carousel-wrapper">
            {followed !== 'pending' && (
              <div className="friends-carousel">
                <NavLink to={`/create`} className="carousel-item-container">
                  <div
                    className="carousel-portrait-container"
                    style={{
                      backgroundColor: '#dbdbdb',
                      border: '1px solid #8e8e8e',
                      overflow: 'visible',
                    }}
                  >
                    <BsPlusCircleFill className="plus-circle" />
                    <div
                      style={{ backgroundColor: 'white', borderRadius: '50%' }}
                    >
                      <IoPersonCircle className="no-portrait-story" />
                    </div>
                  </div>
                  <p className="carousel-item-userName">New Post</p>
                </NavLink>
                {followed.map((user, index) => (
                  <NavLink
                    to={`/user/${user.userName}`}
                    key={index}
                    className="carousel-item-container"
                  >
                    <div className="carousel-portrait-container">
                      {user.image ? <img src={user.image} alt="" /> : <IoPersonCircle style={{height: "100%", width: "100%", color: "#dbdbdb"}}/>}
                    </div>
                    <p className="carousel-item-userName">{user.userName}</p>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <div className="home-list-container">
           
            {user && myId && posts[0] === undefined && (
              <div className="no-feed-wrapper">
                <div className="no-feed-circle">
                  <CgDisplayFullwidth className="no-feed-icon" />
                </div>
                <h1>Your Feed Is Empty!</h1>
                <p>
                  When you follow other users or hashtags their posts will
                  display here.
                </p>
                <NavLink to="/search" className="no-feed-link">
                  <p>Search for users/hashtags to follow</p>
                </NavLink>
              </div>
            )}

            {posts &&
              followed &&
              user &&
              posts.reverse().map((post, index) => (
                <Post
                  post={post}
                  key={index}
                  myId={myId}
                  user={followed.find((u) => u.id === post.user)}
                  likeHandler={likeHandler}
                  saveHandler={saveHandler}
                  viewer={user}
                  unfollow={unfollow}
                  followedArr={followedArr}
                />
              ))}
          </div>
        </div>
      )}

      {user && <BottomNav notificationNumber={user.activityNotifications}/>}
    </div>
  );
};

export default Home;
