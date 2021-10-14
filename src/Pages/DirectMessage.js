import React, {useState, useEffect, useContext, useRef} from 'react';
import './DirectMessage.css';
import { BsChevronLeft } from 'react-icons/bs';
import { BsImage } from 'react-icons/bs';
import { BsHeart } from 'react-icons/bs';
import { BsHeartFill } from 'react-icons/bs';
import { IoInformationCircleOutline } from 'react-icons/io5';
import api from '../Static/axios';
import { useParams, NavLink } from 'react-router-dom';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Axios from 'axios'
import FullModal from '../Components/Reusable/FullModal';
import Modal from '../Components/Reusable/Modal';
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../Context/auth-context'; 
import { IoPersonCircle } from 'react-icons/io5'
import ErrorModal from '../Components/Reusable/ErrorModal'
import Spinner from '../Components/Reusable/Spinner2';

const schemaText = yup.object().shape({
  message: yup.string().required().min(1)
})

const schemaImage = yup.object().shape({
  image: yup.mixed().required("You need to provide a file").test("fileSize", "The file is too large", (value) => {
    return value && value[0].size <= 1000000
  })
  .test("type", "We only support jpeg", (value) => {
    return value && value[0].type === "image/jpeg";
  })
})

const DirectMessage = () => {
  const { register, handleSubmit, errors, formState, reset} = useForm({
    resolver: yupResolver(schemaText),
    mode: "onChange"
  })

  const { register: register2, handleSubmit: handleSubmit2, errors: errors2, formState: formState2} = useForm({
    resolver: yupResolver(schemaImage),
    mode: "onChange"
  })
  
  
  const history = useHistory()
  const auth = useContext(AuthContext)
  const myId = auth.userId;
  const params = useParams().convoId;
  const [user, setUser] = useState()
  const [convo, setConvo] = useState()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState()
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false);
  const [spinner, setSpinner] = useState(false)
  
  const messagesEndRef = useRef(null)
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

  }

  useEffect(() => {
    scrollToBottom()
  }, [convo, loading, messagesEndRef])

////////// why doesn't this work? ^


  
  useEffect(() => {
    async function fetchConvo() {
      let res;
      try{
        res = await api.get(`convos/${params}`)
      } catch(err) {
        setError("Error getting your conversations")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

      let user = res.data.convo.users.find(user => user !== myId)
      let userres;
      try {
        userres = await api.get(`users/${user}`)
      } catch(err) {
        setError("Error finding your info")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
        return
      }

      res.data.convo.messages.shift() //this gets rid of the init message.
      setConvo(res.data.convo)
      setUser(userres.data.user)
      let resetRes;
      try {
        resetRes = await api.patch(`convos/reset/${res.data.convo.id}`, {user: myId})
      } catch(err) {
        setError("Error resetting notifications")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
        return
      }

      console.log(resetRes)

      // put this all in try catch blocks?
    }

    
    
    fetchConvo()
  },[params, loading])

  const sendTextHandler = (data) => {
    async function sendText() {
    let res;
    try{
      res = await api.patch(`convos/${params}`, {user: myId, message: data.message, image: ""})
    } catch(err) {
      setError("Error sending message")
      setShowError(true)
      setTimeout(function() {setShowError(false)}, 2000)
      return
    }

     setLoading(!loading)
     console.log(res)
    }
    sendText()
    reset({})
  }


  const sendHeartHandler = () => {
    async function sendHeart() {
      let res;
      try{
        res = await api.patch(`convos/${params}`, {user: myId, message: "<3", image: ""})
      } catch(err) {
        setError("Error sending your love")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }

      setLoading(!loading)
     }
     sendHeart()
    }


  const sendImageHandler = async(event) => {
    setSpinner(true)
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0]
    }
    let res;
    
    async function uploadImage() {
      const formData = new FormData();
      formData.append("file", pickedFile)
      formData.append("upload_preset", "postImage")
      try{
        res = await Axios.post(`${process.env.REACT_APP_CLOUDINARY_URL}`, formData)

      } catch(err) {
        setError("Error uploading image")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }
      console.log(res.data.url);
    }

    async function sendNewImage() {
      let newImageUrl = res.data.url;
      let newPublicId = res.data.public_id
      let results;
      if (newImageUrl !== undefined) {
        try{
          results = await api.patch(`convos/${params}`, {message:"message", image: newImageUrl, user: myId, publicId: newPublicId})

        } catch(err) {
          setError("Error sending your image")
          setShowError(true)
          setTimeout(function() {setShowError(false)}, 2000)
        }
      }
      console.log(results)
      setLoading(!loading)
    }

    await uploadImage()
    await sendNewImage()
    setSpinner(false)
  }

  const cancelModalHandler = () => {
    setShowModal(false)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }

  
  const deleteHandler = () => {
    async function deleteConvo() {
      let res;
      try{
        res = await api.delete(`/convos/${convo.id}`)

      } catch(err) {
        setError("Error deleting your conversation")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }
      console.log(res)
      history.push(`/inbox`)
    }
    deleteConvo()
  }

  const annoyingDate = (param) => {
    let now = new Date()
    let nowSec = now.getTime()
    let amPm = ""
    let date = new Date(param.time)
    let hour = date.getHours();
    if (hour < 12) 
    {
      amPm = "AM"
    } else {
      amPm = "PM"
    }
    if (hour === 0) {
      hour = 12
    }
    if (hour > 12) {
      hour = hour - 12
    }

    let minutes = date.getMinutes();
    if (minutes < 10) {minutes = `0${minutes}`}
    if (nowSec - param.time < 86400000) {
      return `${hour}:${minutes} ${amPm}`
    } else {
      return `${param.monthString} ${param.day} ${param.year} ${hour}:${minutes} ${amPm}`
    }




    
  }



  return(
    <>
      <ErrorModal 
      children={<p className="errorText">{error}</p>}
      show={showError}
      />
      {user && convo && <FullModal
      show={showModal}
      onCancel={cancelModalHandler}
      children= {
        <div className="convo-delete-wrapper">
          <Modal
            show={showDeleteModal}
            onCancel={cancelDelete}
            children={
              <div className="delete-modal-wrapper">
                <div className="delete-modal-text-wrapper">
                  <h1>Delete Chat?</h1>
                  <p>Deleting removes the chat from both inboxes because your developer is a noob.</p>
                </div>
                <div className="danger-delete-modal-button" onClick={deleteHandler}>Delete</div>
                <div className="last-button-delete-modal delete-modal-button" onClick={cancelDelete}>Cancel</div>
              </div>
            }
          >

          </Modal>
          <div className="convo-delete-header">
            <div className="delete-convo-back" onClick={cancelModalHandler}>
              <BsChevronLeft className="direct-back-icon"/>
            </div>
            <p>Details</p>
          </div>

          <div className="members-container">
            <p>Members</p>
            <div>
              <div className="members-details-wrapper">
              <div className="members-image-wrapper">
                {user.image ? <img alt="" src={user.image}></img> : <IoPersonCircle style={{height:"100%", width:"100%", color:"#dbdbdb"}}/>}
              </div>

              <div className="members-names-wrapper">
                <p>{user.userName}</p>
                <p style={{color: "#8e8e8e", fontWeight: "500"}}>{user.name}</p>
              </div>

              </div>

            </div>
          </div>

          <div className="members-options-wrapper">
            <p onClick={() => setShowDeleteModal(true)}>Delete Chat</p>
            <p>Block</p>
            <p>Report</p>
          </div>

        </div>
      }
      >
      </FullModal>}


     { user && convo && 
     <div className="direct-message-wrapper">Direct Message
      <div className="direct-message-head-wrapper">
        <NavLink to="/inbox" className="direct-back-wrapper">
          <BsChevronLeft className="direct-back-icon"/>
        </NavLink>

        <div className="direct-user-wrapper">
          <div className="direct-image-wrapper">
            {user.image ? <img src={user.image} alt=""/> : <IoPersonCircle style={{height:"100%", width:"100%", color:"#dbdbdb"}}/>}
          </div>
          <p style={{fontWeight: "bold"}}>{user.userName}</p>

        </div>
        <div className="direct-info-icon-wrapper" onClick={() => setShowModal(true)}>
          <IoInformationCircleOutline className="direct-info-icon" />
        </div>
      
      </div>
        {spinner && <Spinner />}
      <div className="convo-wrapper">
        {convo.messages.map((message, index) => 
        <div key={index} className="message-component-wrapper">
        {( !convo.messages[index - 1] || convo.messages[index - 1].date.time - message.date.time < -3600000) && <div className="message-time-stamp">
         
          {annoyingDate(message.date)}
        </div>}

        {(!message.image || message.image === "") && (message.message !== "<3") && <div 
        className={message.user === myId ? "sender-message-wrapper" : "reciever-message-wrapper"}
        >
        {message.message}
        </div>}

        {message.message === "<3" && 
        <div className={message.user === myId ? "sender-heart-wrapper" : "reciever-heart-wrapper"}>
         <BsHeartFill className="message-heart"/> 
          
        </div>}

        {(message.image && message.image !== "") && 
        <div 
        className={message.user === myId ? "sender-image-wrapper" : "reciever-image-wrapper"} 
        >
        <img src={message.image} alt=""/>
        </div>}


        { message.user !== myId && (!convo.messages[index + 1] || convo.messages[index + 1].user === myId)  &&  <div className="message-user-circle">
          {user.image ? <img src={user.image} alt=""/> : <IoPersonCircle style={{height:"100%", width:"100%", color:"#dbdbdb"}}/>}
        </div>}
        </div>
        )}
        <div ref={messagesEndRef}/>
      </div>


      <div className="message-input-wrapper">
        <form onSubmit={handleSubmit(sendTextHandler)} className="send-message-form">
        <textarea className="message-input" placeholder="Message..." name="message" type="text" {...register("message")}/>
        {formState.isValid && <button className="message-send-button" type="submit">Send</button>}
        </form>
          
        {!formState.isValid && <form className="message-input-icon1">
          <label className="message-image-input-label">
          <BsImage className="messageInput-Icon" />
          </label>
          <input style={{fontSize: "16px"}} className="message-image-input" type="file" name="image" {...register2("image")} onChange={sendImageHandler} />

        </form>}
        {!formState.isValid && <div className="message-input-icon2" onClick={sendHeartHandler}>
          <BsHeart className="messageInput-Icon" />
        </div>}

      </div>
    </div>}
    </>
  )
}

export default DirectMessage