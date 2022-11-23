import React, { useState, useEffect, useContext } from 'react';
import api from '../Static/axios';
import './Account.css';
import './User.css';
import { BsPersonPlus } from 'react-icons/bs';
import { BsGearWide } from 'react-icons/bs';
import { BsPeopleCircle } from 'react-icons/bs';
import { BsGrid3X3 } from 'react-icons/bs';
import { BsViewList } from 'react-icons/bs';
import { BsBookmark } from 'react-icons/bs';
import { BsPersonBoundingBox } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import Post from '../Components/Reusable/Post';
import BottomNav from '../Components/Navigation/BottomNav';
import { FiCamera } from 'react-icons/fi';
import { AuthContext } from '../Context/auth-context';
import FullModal from '../Components/Reusable/FullModal';
import Modal from '../Components/Reusable/Modal';
import { BsChevronLeft } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import Spinner from '../Components/Reusable/Spinner2';
import ErrorModal from '../Components/Reusable/ErrorModal';


//you were turning following into navlink on thursday

const Account = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const myId = auth.userId;
  const myName = auth.userName;
  const [user, setUser] = useState();
  const [posts, setPosts] = useState();
  const [button, setButton] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tagged, setTagged] = useState();
  const [saved, setSaved] = useState();
  const [systemModal, setSystemModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [error, setError] =  useState()
  const [showError, setShowError] = useState(false);
  
  

  useEffect(() => {
    async function getUser() {
      let res;
      try {
      res = await api.get(`users/${myId}`);
    } catch(err) {
      setError("Couldn't get user information")
      setShowError(true)
      setTimeout(function() {setShowError(false)}, 2000)
      return;
    }
    setUser(res.data.user);
  }
  getUser();
}, [myId]);


  useEffect(() => {
    async function getPosts() {
      let res;
      try{
        res = await api.get(`/posts/user/${myId}`);
      } catch(err) {
        setError("You don't have any posts yet.")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000) 
        return
      }
      if (res && res.data) {
        setPosts(res.data.posts.reverse());

      }
    }
    getPosts();
  }, [loading, myId]);


  useEffect(() => {
    async function getTagged() {
      let res;
      try{
        res = await api.get(`/posts/taggeduser/${myId}`);
      } catch(err) {
        setTagged([])
        setError("You haven't posted anything yet.")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000) 
        return
      }
    
      setTagged(res.data.posts.reverse());
    }
    getTagged();
  }, [myName]);

  useEffect(() => {
    async function getSaved() {
      let res;
      try{
        res = await api.get(`users/saved/${myId}`);
      } catch(err) {
        setError("You haven't saved any posts.")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000) 
        return
      }


      setSaved(res.data.posts.reverse());
    }
    getSaved();
  }, [myId]);

  const systemHandler = () => {
    setSystemModal(!systemModal);
  };

  const deleteModalHandler = () => {
    setDeleteModal(!deleteModal);
  };

  const logoutModalHandler = () => {
    setLogoutModal(!logoutModal);
  };

  const accountDeleteHandler = async () => {
    let res;
    try {
      res = await api.delete(`/users/${myId}`)
    } catch (err) {
      setError("Couldn't delete your account")
      setShowError(true)
      setTimeout(function() {setShowError(false)}, 2000) 
      return
    }
    auth.logout()
   
  };

  const logoutHandler = () => {
    logoutModalHandler();
    systemHandler();
    auth.logout();
  };

  return (
    <>
    {(!user || !myName || !myId) && <Spinner />}
      {user && myId && myName &&  (
        <div>
          <ErrorModal 
        children={<p className="errorText">{error}</p>}
        show={showError}
          />
          <FullModal
            show={systemModal}
            onCancel={systemHandler}
            children={
              <div className="system-wrapper">
                <Modal
                  show={deleteModal}
                  onCancel={deleteModalHandler}
                  children={
                    <div className="delete-modal-wrapper">
                      <div className="delete-modal-text-wrapper">
                        <h1>Delete Account?</h1>
                        <p>
                          This will permanently delete your account and all of
                          your photos! Don't Do It!
                        </p>
                      </div>
                      <div
                        className="danger-delete-modal-button"
                        onClick={accountDeleteHandler}
                      >
                        Delete
                      </div>
                      <div
                        className="last-button-delete-modal delete-modal-button"
                        onClick={deleteModalHandler}
                      >
                        Cancel
                      </div>
                    </div>
                  }
                ></Modal>

                <Modal
                  show={logoutModal}
                  onCancel={logoutModalHandler}
                  children={
                    <div className="delete-modal-wrapper">
                      <div className="delete-modal-text-wrapper">
                        <h1>Log Out?</h1>
                        <p>See you next time!</p>
                      </div>
                      <div
                        className="danger-delete-modal-button"
                        onClick={logoutHandler}
                      >
                        Log Out
                      </div>
                      <div
                        className="last-button-delete-modal delete-modal-button"
                        onClick={logoutModalHandler}
                      >
                        Cancel
                      </div>
                    </div>
                  }
                ></Modal>

                <div className="system-options-header">
                  <div className="system-options-back" onClick={systemHandler}>
                    <BsChevronLeft className="system-back-icon" />
                  </div>
                  <p>System</p>
                </div>

                <div className="system-user-container">
                  <p>Account</p>
                  <div>
                    <div className="system-details-wrapper">
                      <div className="system-image-wrapper">
                      {user.image ? <img alt="" src={user.image}/> : <BsPersonBoundingBox style={{height: "100%", width: "100%", color: "#dbdbdb"}}/> }
                      </div>

                      <div className="system-name-wrapper">
                        <p>{user.userName}</p>
                        <p style={{ color: '#8e8e8e', fontWeight: '500' }}>
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="system-options-wrapper">
                  <p onClick={() => setDeleteModal(true)}>Delete Account</p>
                  <p onClick={() => setLogoutModal(true)}>Logout</p>
                  <a href="mailto: scottbillings88@gmail.com">
                    Report technical issues
                  </a>
                </div>
              </div>
            }
          />

          <div className="top-account-head-wrapper">
            <div className="account-head-icon-wrapper">
              <BsGearWide
                className="account-head-icon"
                onClick={systemHandler}
              />
            </div>
            <p>{user.userName}</p>
            <div className="account-head-icon-wrapper">
              <BsPersonPlus className="account-head-icon" />
            </div>
          </div>

          <div className="account-basic-wrapper">
            <div className="account-profile-wrapper">
              {!user.image && (
                <div className="editPicture-container">
                  <BsPeopleCircle className="edit-profile-icon" />
                </div>
              )}
              {user.image && (
                <div className="editPicture-container">
                  <img alt="why" src={user.image} />
                </div>
              )}
              {/* <p>{user.name}</p> */}
            </div>

            <div className="account-name-edit-wrapper">
              <h1>{user.userName}</h1>
              <NavLink to="account/edit">
                <button className="edit-profile-button"> Edit Profile</button>
              </NavLink>
            </div>
          </div>

          <div className="account-optional-details-wrapper">
            <p className="bio-userName">{user.userName}</p>
            {user.bio && user.bio !== '' && (
              <p className="userBio">{user.bio}</p>
            )}
            {user.webSite && user.webSite !== '' && (
              <a href={user.webSite} className="userSite">
                {user.webSite}
              </a>
            )}
          </div>

          <div className="account-follow-wrapper">
            <div className="follow-info-wrapper">
              <p style={{ fontWeight: 'bold', color: 'black' }}>
                {user.posts.length}
              </p>
              <p style={{ color: '#8E8E8E' }}>Posts</p>
            </div>

            <NavLink to="/followers" className="follow-info-wrapper">
              <p style={{ fontWeight: 'bold', color: 'black' }}>
                {user.followers.length}
              </p>
              <p style={{ color: '#8E8E8E' }}>Followers</p>
            </NavLink>

            <NavLink to="/following" className="follow-info-wrapper">
              <p style={{ fontWeight: 'bold', color: 'black' }}>
                {user.following.length}
              </p>
              <p style={{ color: '#8E8E8E' }}>Following</p>
            </NavLink>
          </div>

          <div className="account-buttons-wrapper2">
            <div
              className="account-button-container"
              onClick={() => setButton(1)}
            >
              <BsGrid3X3
                style={{ color: button === 1 ? '#0095F6' : '#8e8e8e' }}
                className="account-button-icon"
              />
            </div>
            <div
              className="account-button-container"
              onClick={() => setButton(2)}
            >
              <BsViewList
                style={{ color: button === 2 ? '#0095F6' : '#8e8e8e' }}
                className="account-button-icon"
              />
            </div>
            <div
              className="account-button-container"
              onClick={() => setButton(3)}
            >
              <BsBookmark
                style={{ color: button === 3 ? '#0095F6' : '#8e8e8e' }}
                className="account-button-icon"
              />
            </div>
            <div
              className="account-button-container"
              onClick={() => setButton(4)}
            >
              <BsPersonBoundingBox
                style={{ color: button === 4 ? '#0095F6' : '#8e8e8e' }}
                className="account-button-icon"
              />
            </div>
          </div>

          {button === 1 && posts && (
            <div className="profile-grid-wrapper">
              {posts.map((post, index) => (
                <NavLink
                  to={`post/${post.id}`}
                  className="grid-picture-wrapper"
                  key={index}
                >
                  <img alt="" src={post.image} />
                </NavLink>
              ))}
            </div>
          )}

          {button === 1 && !posts && (
            <div className="no-posts-wrapper">
              <div className="camera-circle">
                <FiCamera className="no-posts-icon" />
              </div>
              <h1>Share Photos</h1>
              <p>When you share photos, they will appear on your profile.</p>
              <a href="/create">Share your first photo</a>
            </div>
          )}

          {button === 4 && tagged && (
            <div className="profile-grid-wrapper">
              {tagged.map((post, index) => (
                <NavLink
                  to={`post/${post.id}`}
                  className="grid-picture-wrapper"
                  key={index}
                >
                  <img alt="" src={post.image} />
                </NavLink>
              ))}
            </div>
          )}

          {button === 4 && !tagged && (
            <div className="no-posts-wrapper">
              <div className="camera-circle">
                <BsPersonBoundingBox className="no-posts-icon" />
              </div>
              <h1>Photos of you</h1>
              <p>When people tag you in photos, they'll appear here.</p>
            </div>
          )}

          {button === 3 && saved && (
            <>
              <p className="saved-message">
                Only you can see what you've saved
              </p>
              <div className="profile-grid-wrapper">
                {saved.map((post, index) => (
                  <NavLink
                    to={`post/${post.id}`}
                    className="grid-picture-wrapper"
                    key={index}
                  >
                    <img alt="" src={post.image} />
                  </NavLink>
                ))}
              </div>
            </>
          )}

          {button === 3 && !saved && (
            <>
              <p className="saved-message">
                Only you can see what you've saved
              </p>
              <div className="no-posts-wrapper">
                <div className="camera-circle">
                  <BsBookmark className="no-posts-icon" />
                </div>
                <h1>Save</h1>
                <p>
                  Save photos and videos that you want to see again. No one is
                  notified, and only you can see what you've saved.
                </p>
              </div>
            </>
          )}

          {button === 2 && posts && (
            <div className="profile-stream-wrapper">
              {posts.map((post, index) => (
                <Post
                  post={post}
                  key={index}
                  myId={myId}
                  user={user}
                  loading={loading}
                />
              ))}
            </div>
          )}

          {button === 2 && !posts && (
            <div className="no-posts-wrapper">
              <div className="camera-circle">
                <FiCamera className="no-posts-icon" />
              </div>
              <h1>Share Photos</h1>
              <p>When you share photos, they will appear on your profile.</p>
              <a href="/create">Share your first photo</a>
            </div>
          )}
        </div>
      )}
      {user && <BottomNav notificationNumber={user.activityNotifications}/>}
    </>
  );
};

export default Account;
