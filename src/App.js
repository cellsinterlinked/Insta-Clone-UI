import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import './App.css';
import Landing from './Pages/Landing';
import Post from './Pages/Post';

function App() {

  let users = [
    {
      name: 'Scott_Billings',
      picture: "https://res.cloudinary.com/dbnapmpvm/image/upload/v1624483656/ikkm4fmdyxoxxlm5zxte.jpg"
    },
    {
      name: 'Lauren',
      picture: 'https://res.cloudinary.com/dbnapmpvm/image/upload/v1624483784/aim6f28z0aeidsbqwlit.jpg'
    },
    {
      name: 'Ken_Montgomery',
      picture: 'https://res.cloudinary.com/dbnapmpvm/image/upload/v1624500899/niha1kliyko28sd4e4mn.jpg'
    }
  ]

  let routes;

  routes = (
    <Switch>
      <Route path="/home">
        <Landing users={users} />
      </Route>

      <Route path="/post">
        <Post />
      </Route>
      <Redirect to="/home" />

    </Switch>
  )
  return (
    <Router>
      <div className="header-wrapper">
        <h2 className='title-head'>Nonurgentgram</h2>
      </div>
      <main>{routes}</main> 
    </Router>
  );
}

export default App;
