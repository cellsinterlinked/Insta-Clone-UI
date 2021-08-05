import React, {useState, useEffect} from 'react'
import './NewMessage.css';
import { BsChevronLeft } from 'react-icons/bs'
import api from '../Static/axios';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const NewMessage = () => {
  const history = useHistory();

  const myId = "60f701da7c0a002afd585c03"
  const [selected, setSelected] = useState()
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState()
  const [convos, setConvos] = useState()
  const [displayedUsers, setDisplayedUsers] = useState()
  const [chattingUsers, setChattingUsers] = useState()


  useEffect(() => {
    async function fetchUsers() {
      const userRes = await api.get('/users')
      const convoRes = await api.get(`/convos/messages/${myId}`)
      let me = userRes.data.users.find(user => user.id === myId)
      let existingConvos = userRes.data.users.filter(user => user.conversations.some(c => me.conversations.includes(c) && user.id !== myId))
      // holy crap it works 
      
      setUsers(userRes.data.users)
      setConvos(convoRes.data.convos)
      setChattingUsers(existingConvos)
      console.log(userRes, convoRes, existingConvos)
    }
    fetchUsers()
  },[])
  
  
  useEffect(() => {
    if (users) {
      setDisplayedUsers(users.filter(user => user.userName.toLowerCase().includes(query) || user.name.toLowerCase().includes(query)))
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
    //filter the users based on the query
    console.log(displayedUsers)
    console.log(query)
  }

  const newConversationHandler = async () => {
    let chosenUser;
    let ourConvo;
    let res;
    if (chattingUsers.filter(user => user.id === selected).length !== 0) {
      chosenUser = await users.find(user => user.id === selected )
      console.log(chosenUser)
      ourConvo = await chosenUser.conversations.find(convo => convos.some(c => c.id === convo)) //this isn't working. this is stupid. it only has the convoId.
      console.log(ourConvo)
      console.log(convos)
      history.push(`/direct/${ourConvo}`)
    }


    if (chattingUsers.filter(user => user.id === selected).length === 0) {
     res = await api.post('convos', {user1: myId, user2: selected, message:"init", image: ""})
          console.log(res.data.convo.id);
           history.push(`/direct/${res.data.convo.id}`)
    }
  } 

  const data = () => {
    console.log(chattingUsers)
  }



  return(
    <div className="new-private-message-wrapper">

      <div className="new-message-header-wrapper">
        <NavLink to="/inbox" className="new-message-back-wrapper">
          <BsChevronLeft className="new-message-back-icon"/>
        </NavLink>
        <p>New Message</p>
        <button className="new-message-next-button" disabled={!selected} onClick={newConversationHandler}>Next</button>
      </div>


      <div className="new-message-search-wrapper">
        <p className="new-message-to">To:</p>
        {(!selected || selected === null) && <input type="text" value={query} placeholder="Search..." onChange={queryHandler} className="new-message-search-input" />}

        {selected && <div className="name-selected-container">
          <p>{users.find(user => user.id === selected).userName}</p>
          <div className="recipient-cancel" onClick={cancelSelect}>X</div>
          </div>}
      </div>
      <div className="new-message-spacer"></div>





      {query === "" && 
      <div className="new-message-suggested-wrapper" >
        <p className="new-message-suggested-text">Suggested</p>
        {chattingUsers && chattingUsers.length > 0 && 
        <div className="new-message-user-container">
          {chattingUsers.map((user, index) =>
            <div key={index} className="new-message-user-object" onClick={() => selectHandler(user.id)} style={{backgroundColor: selected === user.id ? "#e9e9e9" : "white"}}>
              <div className="user-container-portrait">
                <img alt="" src={user.image} />
              </div>
              <div className="user-object-name-container">
              <p style={{fontWeight: "bold"}}>{user.userName}</p>
              <p style={{color: "#8e8e8e"}}>{user.name}</p>
              </div>
            </div>
          )}
        </div>}

        <button onClick={data}></button>
      </div>
    }


    {query !== "" && 
    <div className="new-message-suggested-wrapper">
      { displayedUsers && displayedUsers.length > 0 &&
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