import React, {useState, useEffect, useContext} from 'react'
import './Inbox.css';
import { BsChevronLeft } from 'react-icons/bs';
import { BsPencilSquare } from 'react-icons/bs';
import api from '../Static/axios';
import MessagePrev from '../Components/Reusable/MessagePrev';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../Context/auth-context';
import { useHistory } from 'react-router';
import { BiConversation } from 'react-icons/bi';

const Inbox = () => {
  const auth = useContext(AuthContext);
  const myId = auth.userId
  const history = useHistory()
  const [convos, setConvos] = useState([])
  const [users, setUsers] = useState()

  useEffect(() => {
    async function fetchFollowed() {
      const res = await api.get('users')
      console.log(res)
      setUsers(res.data.users)
    }
    fetchFollowed()
  },[])

  useEffect(() => {
    async function fetchConvos() {
      const res = await api.get(`convos/messages/${myId}`)
      console.log(res)
      const orderedConvos = res.data.convos.sort(function(a, b) {return a.messages[a.messages.length - 1].date.time - b.messages[b.messages.length - 1].date.time })
      setConvos(orderedConvos.reverse())
    }
    fetchConvos()
  }, [])


  return(
    <div className="inbox-wrapper">
      <div className="inbox-header-wrapper">
        <NavLink to="/home" className="inbox-back-wrapper">
          <BsChevronLeft className="inbox-back-icon" />
        </NavLink>
        <p>Direct</p>
        <NavLink to="/direct/new" className ="new-message-wrapper">
          <BsPencilSquare className="new-message-icon"/>
        </NavLink>
      </div>
      <div className="convo-margin">

      {users && convos && convos.length === 0 && 
      <div className="no-convos-wrapper">
        <div className="no-convos-circle">
          <BiConversation className="no-convos-icon"/>
        </div>
        <h1>No Direct Messages</h1>
        <p>This is where your direct messages will be displayed.</p>
        <NavLink className="new-dm-link" to="/direct/new"><p>Send someone a direct message.</p></NavLink>
      </div>}

      {users && convos && convos.map((convo, index) => 
      <MessagePrev key={index} user={users.find(user => user.conversations.includes(convo.id))} convo={convo} />)}

      </div>
      







    </div>
  )
}

export default Inbox;