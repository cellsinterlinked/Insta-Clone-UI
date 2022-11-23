 import React, {useState, useCallback, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import './App.css';
import Home from './Pages/Home'
import Auth from './Pages/Auth';
import { AuthContext } from './Context/auth-context';
import Search from './Pages/Search';
import Account from './Pages/Account';
import Following from './Pages/Following';
import Followers from './Pages/Followers';
import Comments from './Pages/Comments';
import NewPost from './Pages/NewPost';
import User from './Pages/User';
import ProfileFollowing from './Pages/ProfileFollowing';
import ProfileFollowers from './Pages/ProfileFollowers';
import PostPage from './Pages/PostPage';
import DirectMessage from './Pages/DirectMessage';
import Inbox from './Pages/Inbox';
import NewMessage from './Pages/NewMessage';
import EditProfile from './Pages/EditProfile';
import Activity from './Pages/Activity';
import HashPage from './Pages/HashPage';

let logoutTimer;

function App() {

  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false)
  const [userName, setUserName] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState()


  const login = useCallback((uid, token, userName, expirationDate) => {
    setToken(token);
    setUserId(uid)
    setUserName(userName)
    const tokenExpirationDate = expirationDate ||  new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate)
    localStorage.setItem(
      'userData', 
      JSON.stringify({
        userId: uid, 
        token: token,
        userName: userName,
        expiration: tokenExpirationDate.toISOString()
      }))
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setUserName(null);
    localStorage.removeItem('userData');

  }, [])

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, storedData.userName, new Date(storedData.expiration));
    }
  }, [login]);

  
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/hashtag/:hash">
          <HashPage />
        </Route>
        <Route path="/post/:postId">
          <PostPage />
        </Route>
        <Route path="/inbox">
          <Inbox />
        </Route>
        <Route path="/activity">
          <Activity />
        </Route>
        <Route path="/direct/new">
          <NewMessage />
        </Route>
        <Route path="/direct/:convoId">
          <DirectMessage />
        </Route>
        <Route path="/user/:username">
          <User />
        </Route>
        <Route path="/:username/following">
          <ProfileFollowing />
        </Route>
        <Route path="/:username/followers">
          <ProfileFollowers />
        </Route>

        <Route path="/comments/:postId">
          <Comments/>
        </Route>

        <Route path="/home">
          <Home  />
        </Route>
  
        <Route path="/search">
          <Search/>
        </Route>
        <Route path="/create">
          <NewPost/>
        </Route>
        <Route path="/account/edit">
          <EditProfile/>
        </Route>
        <Route path="/account">
          <Account/>
        </Route>
        <Route path="/following">
          <Following/>
        </Route>
        <Route path="/followers">
          <Followers/>
        </Route>

        <Redirect to="/home" />
  
      </Switch>
    )

  } else {
    routes = (
      <Switch>
        <Route>
          <Auth path="/" />
        </Route>
        <Redirect to="/" />
  
      </Switch>
    )
  }
  return (
    <AuthContext.Provider value={{ 
        isLoggedIn: !!token,
        userId: userId,
        userName: userName, 
        token: token,
        login: login, 
        logout: logout 
        }}>
    <Router>
      <main>
        {routes}
         {/* <BottomNav /> */}
      </main> 
    </Router>
    </AuthContext.Provider>

  );
}

export default App;
