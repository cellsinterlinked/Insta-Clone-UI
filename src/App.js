import React, {useState, useCallback, useContext} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import './App.css';
import Home from './Pages/Home'
import Auth from './Pages/Auth';
import { AuthContext } from './Context/auth-context';
import BottomNav from './Components/Navigation/BottomNav';
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = useContext(AuthContext)
  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, [])

  
  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
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
    <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}>
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
