import React, {useState, useEffect, useContext} from 'react';
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


  useEffect(() => {
    async function fetchConvo() {
      const res = await api.get(`convos/${params}`)
      let user = res.data.convo.users.find(user => user !== myId)
     
      const userres = await api.get(`users/${user}`)
      res.data.convo.messages.shift() //this gets rid of the init message.
      setConvo(res.data.convo)
      setUser(userres.data.user)

      // put this all in try catch blocks?
    }
    fetchConvo()
  },[params, loading])

  const toStandardTime = (militaryTime) => {
    militaryTime = militaryTime.split(':');
    if (militaryTime[0].charAt(0) !== 1 && militaryTime[0].charAt(1) > 2) {
      return (militaryTime[0] - 12) + ':' + militaryTime[1] + ' PM';
    } else if (militaryTime[0].charAt(0) !== 2){
      return (militaryTime[0] - 12) + ':' + militaryTime[1] + ' PM';
    } else {
      return militaryTime.join(':').slice(0,5) + ' AM';
    }
  }

  const sendTextHandler = (data) => {
    async function sendText() {
     const res = await api.patch(`convos/${params}`, {user: myId, message: data.message, image: ""})
     setLoading(!loading)
    }
    sendText()
    reset({})
  }


  const sendHeartHandler = () => {
    async function sendHeart() {
      const res = await api.patch(`convos/${params}`, {user: myId, message: "<3", image: ""})
      setLoading(!loading)
     }
     sendHeart()
    }


  const sendImageHandler = async(event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0]
    }
    let res;
    
    async function uploadImage() {
      const formData = new FormData();
      formData.append("file", pickedFile)
      formData.append("upload_preset", "postImage")
      res = await Axios.post("https://api.cloudinary.com/v1_1/dbnapmpvm/image/upload", formData)
      console.log(res.data.url);
    }

    async function sendNewImage() {
      let newImageUrl = res.data.url;
      let results;
      if (newImageUrl !== undefined) {
       results = await api.patch(`convos/${params}`, {message:"message", image: newImageUrl, user: myId})
      }
      console.log(results)
      setLoading(!loading)
    }

    await uploadImage()
    await sendNewImage()
  }

  const cancelModalHandler = () => {
    setShowModal(false)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }
  
  const deleteHandler = () => {
    async function deleteConvo() {
      const res = await api.delete(`/convos/${convo.id}`)
      console.log(res)
      history.push(`/inbox`)
    }
    deleteConvo()
  }



  return(
    <>
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
                <img alt="" src={user.image}></img>
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


     { user && convo && <div className="direct-message-wrapper">Direct Message
      <div className="direct-message-head-wrapper">
        <NavLink to="/inbox" className="direct-back-wrapper">
          <BsChevronLeft className="direct-back-icon"/>
        </NavLink>

        <div className="direct-user-wrapper">
          <div className="direct-image-wrapper">
            <img src={user.image} alt=""/>
          </div>
          <p style={{fontWeight: "bold"}}>{user.userName}</p>

        </div>
        <div className="direct-info-icon-wrapper" onClick={() => setShowModal(true)}>
          <IoInformationCircleOutline className="direct-info-icon" />
        </div>
      
      </div>

      <div className="convo-wrapper">
        {convo.messages.map((message, index) => 
        <div key={index} className="message-component-wrapper">
        {( !convo.messages[index - 1] || convo.messages[index - 1].date.time - message.date.time < -3600000) && <div className="message-time-stamp">
         
          {toStandardTime(message.date.fullDate.slice(11, 19))}</div>}

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
          <img src={user.image} alt=""/>
        </div>}
        </div>
        )}
        
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
          <input className="message-image-input" type="file" name="image" {...register2("image")} onChange={sendImageHandler} />

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