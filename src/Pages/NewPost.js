import React, {useState, useEffect} from 'react';
import './NewPost.css';
import { BsChevronLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import api from '../Static/axios';
import { IoPersonCircle } from 'react-icons/io5';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import newPostContent from '../Static/newPostContent';
import Axios from 'axios';
import { RiImageAddLine } from 'react-icons/ri';
import { BsChevronRight} from 'react-icons/bs'
import { useHistory } from 'react-router-dom'

const NewPost = () => {

  const schema = yup.object().shape({
    caption: yup.string().required().min(5),
    image: yup.mixed().required("You need to provide a file").test("fileSize", "The file is too large", (value) => {
      return value && value[0].size <= 1000000
    })
    .test("type", "We only support jpeg", (value) => {
      return value && value[0].type === "image/jpeg";
    })
  })
  
  const { register, handleSubmit, errors, formState} = useForm({
    validationSchema: schema,
  })
  const [previewUrl, setPreviewUrl] = useState();
  const [file, setFile] = useState()
  const history = useHistory();


  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();  
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    }
    fileReader.readAsDataURL(file)
  }, [file])
      
  

  const pickedHandler = event => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
    }
  }
    

  const postHandler = async(data) => {
    let res;

    async function uploadImage() {
      const formData = new FormData();
      formData.append("file", file)
      formData.append("upload_preset", "postImage")
      res = await Axios.post("https://api.cloudinary.com/v1_1/dbnapmpvm/image/upload", formData)
      console.log(res.data.url);
    }
      
      
      
    
    let description = data.caption;
    let captionArray = description.split(" ")
    let tags = captionArray.filter(w => w[0] === "#")
    async function sendNewPost() {
      //setup hashtags in here
      let newImageUrl = res.data.url;
      let results;
      if (newImageUrl !== undefined) {
       results = await api.post("posts", {description: description, image: newImageUrl, user: "60f701da7c0a002afd585c03", hashTags: tags})
      }
      console.log(results)
    }

      


    await uploadImage();
    await sendNewPost();
    history.push('/home')
  }
    

  return(
    <div className="create-post-wrapper">
      <form onSubmit={handleSubmit(postHandler)}>
      <div className="new-post-header-wrapper">
        <NavLink to="/home" className="new-post-back-button">
          <BsChevronLeft className="create-back-icon" />
        </NavLink>
        <p>New Post</p>
        <button type="submit" disabled={!formState.isValid} className="new-post-share-button">
          <p >Share</p>
        </button>
      </div>

      <div className="new-post-info1-wrapper">
        <div className="new-post-portrait-wrapper">
          <IoPersonCircle className="new-post-no-icon" />
        </div>

        <div className="new-post-input-wrapper">
          <textarea className="new-post-caption-input" type="text" placeholder="Write a caption..." name="caption" {...register("caption")} />
        </div>

        <div className="new-post-image-wrapper">
          <div className="file-button-wrapper">
          <label className="label-button" for="image">
          {previewUrl && <img className="post-preview" src={previewUrl} alt="Preview" />}
            {!previewUrl && <RiImageAddLine className="add-image-icon" />}
          </label>
          <input className="new-post-image-input" type="file" placeholder="" name="image" id="image" {...register("image")} label="" onChange={pickedHandler}/>
          </div>
        </div>

      </div>
      </form>

      <div className="add-location-wrapper">
        <p className="post-add-text">Add Location</p>
        <BsChevronRight className="add-to-post-arrow" />
      </div>

      <div className= 'tag-person-wrapper'>
        <p className="post-add-text">Tag People</p>
        <BsChevronRight className="add-to-post-arrow"/>
      </div>
    </div>
  )
}

export default NewPost