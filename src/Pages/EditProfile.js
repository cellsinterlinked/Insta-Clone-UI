import React, {useState, useEffect} from 'react';
import './EditProfile.css';
import { BsChevronLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import api from '../Static/axios';
import BottomNav from '../Components/Navigation/BottomNav';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Axios from 'axios';


const EditProfile = () => {
  // const schema = yup.object().shape({
  //   caption: yup.string().required().min(5),
  //   image: yup.mixed().required("You need to provide a file").test("fileSize", "The file is too large", (value) => {
  //     return value && value[0].size <= 1000000
  //   })
  //   .test("type", "We only support jpeg", (value) => {
  //     return value && value[0].type === "image/jpeg";
  //   })
  // })
  
  // const { register, handleSubmit, errors, formState} = useForm({
  //   validationSchema: schema,
  // })
  // const [previewUrl, setPreviewUrl] = useState();
  // const [file, setFile] = useState()




  const [user, setUser] = useState()

  useEffect(() => {
    async function getUser() {
      const res = await api.get('users/60f701da7c0a002afd585c03')
      console.log(res)
      setUser(res.data.user)
    }
    getUser()
  }, [])




  return (
    <div className="edit-profile-wrapper">
      <div className="edit-profile-header-wrapper">
        <NavLink to="/account" className="edit-back-container"><BsChevronLeft  className="edit-back-icon"/></NavLink>
        <p>Edit Profile</p>
      </div>

      { user && <form className="edit-profile-list">
        <div className="edit-profile-photo-wrapper">
          <div className="edit-profile-image">
            <img alt="" src={user.image}/>
          </div>
        <div className="edit-profile-photo-text">
          <p style={{fontSize: "1.2rem", fontWeight: "500"}}>{user.userName}</p>
          <p style={{fontWeight: "bold", color: "#0095f6", fontSize: ".9rem"}}>Change Profile Photo</p>
        </div>

        </div>

        <div className="edit-piece-wrapper">
          <h1>Name</h1>
          <input className="edit-small-input" value={user.name} />

          <p>Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
          <p>You can only change your name twice within 14 days.</p>
        </div>

        <div className="edit-piece-wrapper">
          <h1>Username</h1>
          <input className="edit-small-input" value={user.userName} />
          <p>{`In most cases, you'll be able to change your username back to ${user.userName} for another 14 days `}</p>
        </div>

        <div className="edit-piece-wrapper">
          <h1>Website</h1>
          <input className="edit-small-input" value={user.webSite || ""}/>
          <h1>Bio</h1>
          <textarea className="edit-large-input" value={user.bio || ""}/>

          <h2>Personal Information</h2>
          <p style={{marginTop: "1px"}}>Provide your personal information, even if the account is used for a business, a pet, or something else. This won't be part of your public profile.</p>

          <h1>Email</h1>
          <input className="edit-small-input" value={user.email}/>
          <button className="confirm-edit-button">Confirm Email</button>

          <h1>Phone Number</h1>
          <input className="edit-small-input" value={user.phone || ""}/>

          <h1>Gender</h1>
          <input className="edit-small-input" value={user.gender || ""}/>

          <button className="confirm-edit-button">Submit</button>
        </div>

        
      </form>}

    <BottomNav />
    </div>
  )
}

export default EditProfile;
