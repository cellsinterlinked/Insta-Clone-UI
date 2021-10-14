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
import Spinner from '../Components/Reusable/Spinner2';
import ErrorModal from '../Components/Reusable/ErrorModal';

const Inbox = () => {
  const auth = useContext(AuthContext);
  const myId = auth.userId
  const history = useHistory()
  const [convos, setConvos] = useState([])
  const [users, setUsers] = useState()
  const [error, setError] =useState()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    async function fetchFollowed() {
      let res;
      try{
        res = await api.get('users')
      } catch(err) {
        setError("Error getting followed users")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

      // console.log(res)
      setUsers(res.data.users)
    }
    fetchFollowed()
  },[])

  useEffect(() => {
    async function fetchConvos() {
      let res;
      try{
        res = await api.get(`convos/messages/${myId}`)
      } catch(err) {
        setError("Error getting messages")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

      console.log(res) 
      const orderedConvos = res.data.convos.sort(function(a, b) {return a.messages[a.messages.length - 1].date.time - b.messages[b.messages.length - 1].date.time })
      setConvos(orderedConvos.reverse())
    }
    fetchConvos()
  }, [])


  return(
    <>
    <ErrorModal 
      children={<p className="errorText">{error}</p>}
      show={showError}
      />
    {(!users || !myId) && <Spinner /> }
    {users && myId && <div className="inbox-wrapper">
      
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
      <MessagePrev key={index} user={users.find(user => user.conversations.includes(convo.id) && user.id !== myId)} convo={convo} />)}

      </div>
      







    </div>}
    </>
  )
}

export default Inbox;