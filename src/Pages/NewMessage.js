import React, {useState, useEffect, useContext} from 'react'
import './NewMessage.css';
import { BsChevronLeft } from 'react-icons/bs'
import api from '../Static/axios';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../Context/auth-context';
import ErrorModal from '../Components/Reusable/ErrorModal';
import { IoPersonCircle } from 'react-icons/io5';

const NewMessage = () => {


  const history = useHistory();
  const auth = useContext(AuthContext)
  const myId = auth.userId
  const [selected, setSelected] = useState()
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState()
  const [convos, setConvos] = useState()
  const [displayedUsers, setDisplayedUsers] = useState()
  const [chattingUsers, setChattingUsers] = useState([])
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false);


  useEffect(() => {
    async function fetchUsers() {
      let userRes
      let convoRes
      try{
      userRes = await api.get('/users')
      } catch (err) {
        setError("could not get users")
        setShowError(true);
        setTimeout(function() {setShowError(false)}, 2000)
      }
      setUsers(userRes.data.users)
      
      try{
        convoRes = await api.get(`/convos/messages/${myId}`)
      } catch (err) {
        setError("could not get convos")
        setShowError(true);
        setTimeout(function() {setShowError(false)}, 2000)
      }
      setConvos(convoRes.data.convos)


      let me = userRes.data.users.find(user => user.id === myId)
      let existingConvos
      if (convoRes) {
        existingConvos = userRes.data.users.filter(user => user.conversations.some(c => me.conversations.includes(c) && user.id !== myId))
        setChattingUsers(existingConvos)
      }
     console.log(myId)
    }
    fetchUsers()
  },[myId])
  
  
  useEffect(() => {
    if (users) {
      setDisplayedUsers(users.filter(user => user.userName.toLowerCase().includes(query.toLowerCase()) || user.name.toLowerCase().includes(query.toLowerCase())))
      console.log("firing")
      //eventually also make this filter so the more followed/or match those already with a conversation are at the top
    }
  },[query, users])

  const cancelSelect = () => {
    setSelected(null)
  }


  const selectHandler = (id) => {
    if (selected !== id) {
      setSelected(id)
    } else {
      setSelected(null)
    }
  }

  const queryHandler = (e) => {
    setQuery(e.target.value)
    console.log(displayedUsers)
    console.log(query)
  }

  const newConversationHandler = async () => {
    let chosenUser;
    let ourConvo;
    let res;
    if (chattingUsers.filter(user => user.id === selected).length !== 0) {
      chosenUser = await users.find(user => user.id === selected )
      ourConvo = await chosenUser.conversations.find(convo => convos.some(c => c.id === convo)) //this isn't working. this is stupid. it only has the convoId.
      history.push(`/direct/${ourConvo}`)
    }
    if (chattingUsers.filter(user => user.id === selected).length === 0) {
     try {
       res = await api.post('convos', {user1: myId, user2: selected, message:"init", image: ""})

     } catch(err) {
      setError("Could not start new conversation")
      setShowError(true);
      setTimeout(function() {setShowError(false)}, 2000)
     }
      if (error !== "Could not start new conversation") {history.push(`/direct/${res.data.convo.id}`)}
    }
  } 



  


  return(
    <div className="new-private-message-wrapper">
      <ErrorModal 
      show={showError}
      children={<p className="errorText">{error}</p>}
      
      />

      <div className="new-message-header-wrapper">
        <NavLink to="/inbox" className="new-message-back-wrapper">
          <BsChevronLeft className="new-message-back-icon"/>
        </NavLink>
        <p>New Message</p>
        <button className="new-message-next-button" disabled={!selected} onClick={newConversationHandler}>Next</button>
      </div>


      <div className="new-message-search-wrapper">
        <p className="new-message-to">To:</p>
        {(!selected || selected === null) && <input style={{fontSize: "16px"}} type="text" value={query} placeholder="Search..." onChange={queryHandler} className="new-message-search-input" />}

        {selected && <div className="name-selected-container">
          <p>{users.find(user => user.id === selected).userName}</p>
          <div className="recipient-cancel" onClick={cancelSelect}>X</div>
          </div>}
      </div>
      <div className="new-message-spacer"></div>
     




      {query === "" && 
      <div className="new-message-suggested-wrapper" >
        {convos && <p className="new-message-suggested-text">Suggested</p>}
        {chattingUsers && chattingUsers.length > 0 && 
        <div className="new-message-user-container">
          {chattingUsers.map((user, index) =>
            <div key={index} className="new-message-user-object" onClick={() => selectHandler(user.id)} style={{backgroundColor: selected === user.id ? "#e9e9e9" : "white"}}>
              <div className="user-container-portrait">
                {user.image ? <img alt="" src={user.image} /> : <IoPersonCircle className="no-image_user-circle" /> }
              </div>
              <div className="user-object-name-container">
              <p style={{fontWeight: "bold"}}>{user.userName}</p>
              <p style={{color: "#8e8e8e"}}>{user.name}</p>
              </div>
            </div>
          )}
        </div>}

        
      </div>
    }


    {query !== "" && 
    <div className="new-message-suggested-wrapper">
      { displayedUsers && displayedUsers.length > 0 && !selected &&
      <div className="new-message-user-container">
      {displayedUsers.map((user, index) =>
        <div key={index} className="new-message-user-object" onClick={() => selectHandler(user.id)} style={{backgroundColor: selected === user.id ? "#e9e9e9" : "white"}}>
          <div className="user-container-portrait">
            <img alt="" src={user.image} />
          </div>
          <div className="user-object-name-container">
          <p style={{fontWeight: "bold"}}>{user.userName}</p>
          <p style={{color: "#8e8e8e"}}>{user.name}</p>
          </div>
          {/* <input type="radio" className="user-radio" /> */}
        </div>
      )}
    </div>  
      }

    </div>
    
    }
      
    


    </div>
  )
}

export default NewMessage