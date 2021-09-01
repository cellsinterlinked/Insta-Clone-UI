import React, {useState, useEffect, useContext} from 'react';
import './EditProfile.css';
import { BsChevronLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import api from '../Static/axios';
import BottomNav from '../Components/Navigation/BottomNav';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Axios from 'axios';
import { AuthContext } from '../Context/auth-context';


const EditProfile = () => {
  const imageSchema = yup.object().shape({
    image: yup.mixed().required("You need to provide a file").test("fileSize", "The file is too large", (value) => {
      return value && value[0].size <= 1000000
    })
    .test("type", "We only support jpeg", (value) => {
      return value && value[0].type === "image/jpeg";
    })
  })

  const schema = yup.object().shape({
    name: yup.string().required().min(4),
    username: yup.string().required().min(6),
    email: yup.string().email().required(),
    website: yup.string(),
    bio: yup.string(),
    phone: yup.string(),
    gender: yup.string()
  })


  
  const { register, handleSubmit, errors, formState, setValue} = useForm({
    resolver: yupResolver(schema),
    mode: "onChange"
  })

  

  const { register: register2, handleSubmit: handleSubmit2, errors: errors2, formState: formState2} = useForm({
    resolver: yupResolver(imageSchema),
    mode: "onChange"
  })

  const [previewUrl, setPreviewUrl] = useState();
  const [file, setFile] = useState()


  const resetImage = async() => {
    const res = await api.get(`users/${myId}`)
    setUser(res.data.user)
  }

  const auth = useContext(AuthContext);
  const myId = auth.userId
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      const res = await api.get(`users/${myId}`)
      console.log(res)
      setUser(res.data.user)
      setValue("name", res.data.user.name, { shouldValidate: true })
      setValue("username", res.data.user.userName, { shouldValidate: true})
      setValue("email", res.data.user.email, { shouldValidate: true})
      setValue('phone', res.data.user.phone, {shouldValidate: true})
      setValue("gender", res.data.user.gender, {shouldValidate: true})
      setValue("bio", res.data.user.bio, {shouldValidate: true})
      setValue("website", res.data.user.webSite, {shouldValidate: true})
    }
    getUser()
  }, [])


  const dataSubmitHandler = (data) => {

    let res;
    console.log(data);
    async function sendUserUpdate() {
      res = await api.patch(`users/${myId}`, data)
      console.log(res)
    }

    sendUserUpdate()

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
      res = await Axios.post(`${process.env.REACT_APP_CLOUDINARY_URL}`, formData)
      console.log(res.data.url);
    }

    async function sendNewImage() {
      let newImageUrl = res.data.url;
      let results;
      if (newImageUrl !== undefined) {
       results = await api.patch(`users/${myId}`, {image: newImageUrl})
      }
      console.log(results)
      setLoading(!loading)
    }

    await uploadImage()
    await sendNewImage()
    await resetImage()
  }


  return (
    <div className="edit-profile-wrapper">
      <div className="edit-profile-header-wrapper">
        <NavLink to="/account" className="edit-back-container"><BsChevronLeft  className="edit-back-icon"/></NavLink>
        <p>Edit Profile</p>
      </div>

      { user && 
      <div className="edit-profile-list">
        <div className="edit-profile-photo-wrapper">
          <div className="edit-profile-image">
            <img alt="" src={user.image}/>
          </div>
        <form className="edit-profile-photo-text">
          <p style={{fontSize: "1.2rem", fontWeight: "500"}}>{user.userName}</p>
          <label className="edit-profile-image-label" style={{fontWeight: "bold", color: "#0095f6", fontSize: ".9rem"}}>Change Profile Photo</label>
          <input className="edit-image-input" type="file" name="image" {...register2("image")} onChange={sendImageHandler} />
        </form>

        </div>
      <form onSubmit={handleSubmit(dataSubmitHandler)}>
        <div className="edit-piece-wrapper">
          <h1>Name</h1>
          <input className="edit-small-input"  type="text" name="name" {...register("name")} />

          <p>Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
          <p>You can only change your name twice within 14 days.</p>
        </div>

        <div className="edit-piece-wrapper">
          <h1>Username</h1>
          <input className="edit-small-input" type="text" name="username" {...register("username")} />
          <p>{`In most cases, you'll be able to change your username back to ${user.userName} for another 14 days `}</p>
        </div>

        <div className="edit-piece-wrapper">
          <h1>Website</h1>
          <input className="edit-small-input" name="website" {...register("website")} />
          <h1>Bio</h1>
          <textarea className="edit-large-input" name="bio" {...register("bio")}/>

          <h2>Personal Information</h2>
          <p style={{marginTop: "1px"}}>Provide your personal information, even if the account is used for a business, a pet, or something else. This won't be part of your public profile.</p>

          <h1>Email</h1>
          <input className="edit-small-input" name="email" {...register("email")}/>
          <button className="confirm-edit-button">Confirm Email</button>

          <h1>Phone Number</h1>
          <input className="edit-small-input" name="phone" {...register("phone")}/>

          <h1>Gender</h1>
          <input className="edit-small-input" name="gender" {...register("gender")}/>

          <button className="confirm-edit-button" type="submit" disabled={!formState.isValid}>Submit</button>
        </div>
      </form>

        
      </div>}

    <BottomNav />
    </div>
  )
}

export default EditProfile;
