import React, {useState, useEffect} from 'react'
import './Inbox.css';
import { BsChevronLeft } from 'react-icons/bs';
import { BsPencilSquare } from 'react-icons/bs';
import api from '../Static/axios';
import MessagePrev from '../Components/Reusable/MessagePrev';
import { NavLink } from 'react-router-dom';

const Inbox = () => {
  const [convos, setConvos] = useState()
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
      const res = await api.get('convos/messages/60f701da7c0a002afd585c03')
      console.log(res)
      setConvos(res.data.convos)
    }
    fetchConvos()
  }, [])


  return(
    <div className="inbox-wrapper">
      <div className="inbox-header-wrapper">
        <NavLink to='/home' className="inbox-back-wrapper">
          <BsChevronLeft className="inbox-back-icon" />
        </NavLink>
        <p>Direct</p>
        <NavLink to="/direct/new" className ="new-message-wrapper">
          <BsPencilSquare className="new-message-icon"/>
        </NavLink>
      </div>
      <div className="convo-margin">
      {users && convos && convos.map((convo, index) => 
      <MessagePrev key={index} user={users.find(user => user.conversations.includes(convo.id))} convo={convo} />)}

      </div>
      







    </div>
  )
}

export default Inbox;