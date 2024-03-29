import React, { useState, useEffect, useContext } from 'react';
import './NewPost.css';
import { BsChevronLeft } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import api from '../Static/axios';
import { IoPersonCircle } from 'react-icons/io5';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import newPostContent from '../Static/newPostContent';
import Axios from 'axios';
import { RiImageAddLine } from 'react-icons/ri';
import { BsChevronRight } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import FullModal from '../Components/Reusable/FullModal';
import './Search.css';
import { MdCancel } from 'react-icons/md';
import { AuthContext } from '../Context/auth-context';
import ErrorModal from '../Components/Reusable/ErrorModal';
import Spinner from '../Components/Reusable/Spinner2';


const NewPost = () => {
  const schema = yup.object().shape({
    caption: yup.string().required().min(5),
    image: yup
      .mixed()
      .required('You need to provide a file')
      .test('fileSize', 'The file is too large', (value) => {
        return value && value[0].size <= 1000000;
      })
      .test('type', 'We only support jpeg', (value) => {
        return value && value[0].type === 'image/jpeg';
      }),
  });

  const { register, handleSubmit, errors, formState } = useForm({
    // resolver: yupResolver(schema),
    // mode: "onChange"
    validationSchema: schema,
  });
  const [previewUrl, setPreviewUrl] = useState();
  const [file, setFile] = useState();
  const [fullModal, setFullModal] = useState(false);
  const history = useHistory();
  const [query, setQuery] = useState();
  const [users, setUsers] = useState();
  const [displayedUsers, setDisplayedUsers] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false);
  const auth = useContext(AuthContext);
  const myId = auth.userId;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  useEffect(() => {
    async function fetchUsers() {
      let res;
      let myUser;
      try {
        res = await api.get('users');
      } catch (err) {
        setError("Couldn't get users information from database");
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
      }
      myUser = res.data.users.filter((user) => user.id === myId);
      setUsers(res.data.users);
      setUser(myUser[0]);
      
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users && query && query[0] !== '#') {
      setDisplayedUsers(
        users.filter(
          (user) =>
            user.userName.toLowerCase().includes(query.toLowerCase()) ||
            user.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, users]);

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
    }
  };



  const postHandler = async (data) => {
    let res;
    let description = data.caption;
    let captionArray = description.split(' ');
    let tags = captionArray.filter((w) => w[0] === '#');

    async function uploadImage() {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'postImage');
      try {
        res = await Axios.post(
          `${process.env.REACT_APP_CLOUDINARY_URL}`,
          formData
        );
      } catch (err) {
        setError("Couldn't store image");
        setShowError(true);
        setTimeout(function () {
          setShowError(false);
        }, 2000);
        setLoading(false);
        return;
      }
      
    }

    async function sendNewPost() {
      let newImageUrl = res.data.url;
      let newPublicId = res.data.public_id;
      let results;
      if (newImageUrl !== undefined) {
        try {
          results = await api.post(
            'posts',
            {
              description: description,
              image: newImageUrl,
              user: myId,
              hashTags: tags,
              tags: selectedTags,
              publicId: newPublicId,
            },
            { headers: { Authorization: 'Bearer ' + auth.token } }
          );
        } catch (err) {
          setError('Posting was unsuccessful');
          setShowError(true);
          setTimeout(function () {
            setShowError(false);
          }, 2000);
          setLoading(false);
          return;
        }
      }
      
    }

    setLoading(true);
    await uploadImage();
    await sendNewPost();
    setLoading(false);
    if (!error) {
      history.push('/home');
    }
  };





  const cancelModal = () => {
    setFullModal(false);
  };

  const setModal = () => {
    setFullModal(true);
  };

  const queryHandler = (e) => {
    setQuery(e.target.value);
  };

  const tagHandler = async (userName) => {
    async function addTag() {
      setSelectedTags([...selectedTags, userName]);
    }
    await addTag();
    cancelModal();
  };

  const tagRemove = (userName) => {
    const modTags = selectedTags.filter((user) => user !== userName);
    setSelectedTags(modTags);
  };

  const cancelSearch = () => {
    setQuery('');
    document.getElementById('search').value = '';
    setFullModal(false);
  };

  return (
    <div className="create-post-wrapper">
      <ErrorModal
        children={<p className="errorText">{error}</p>}
        show={showError}
      />
      {loading && <Spinner />}
      <FullModal
        show={fullModal}
        onCancel={cancelModal}
        children={
          <div>
            <div className="search-header-wrapper">
              {query && (
                <MdCancel className="cancel-input" onClick={cancelSearch} />
              )}
              <input
                style={{ fontSize: '16px' }}
                className="search-input"
                placeholder="Search"
                value={query}
                onChange={queryHandler}
                id="search"
              ></input>
            </div>

            {query && query[0] !== '#' && displayedUsers && (
              <div className="user-search-container">
                {displayedUsers.map((user, index) => (
                  <div
                    key={index}
                    className="search-user-object"
                    onClick={() => tagHandler(user.userName)}
                  >
                    <div className="search-user-portrait">
                      {user.image ? <img alt="user" src={user.image} /> : <IoPersonCircle style={{height: "100%", width: "100%", color: "#dbdbdb"}} />}
                    </div>
                    <div className="search-user-name-container">
                      <p style={{ fontWeight: 'bold' }}>{user.userName}</p>
                      <p style={{ color: '#8e8e8e' }}>{user.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        }
      ></FullModal>
      <form onSubmit={handleSubmit(postHandler)}>
        <div className="new-post-header-wrapper">
          <NavLink to="/home" className="new-post-back-button">
            <BsChevronLeft className="create-back-icon" />
          </NavLink>
          <p>New Post</p>
          <button
            type="submit"
            disabled={!formState.isValid || !file || loading}
            className="new-post-share-button"
          >
            Share
          </button>
        </div>

        <div className="new-post-info1-wrapper">
          <div className="new-post-portrait-wrapper">
            {user && user.image ? (
              <img className="new-post_user-display" alt="" src={user.image} />
            ) : (
              <IoPersonCircle className="new-post-no-icon" />
            )}
          </div>

          <div className="new-post-input-wrapper">
            <textarea
              className="new-post-caption-input"
              type="text"
              placeholder="Write a caption..."
              name="caption"
              {...register('caption')}
            />
          </div>

          <div className="new-post-image-wrapper">
            <div className="file-button-wrapper">
              <label className="label-button" for="image">
                {previewUrl && (
                  <img
                    className="post-preview"
                    src={previewUrl}
                    alt="Preview"
                  />
                )}
                {!previewUrl && <RiImageAddLine className="add-image-icon" />}
              </label>
              <input
                style={{ fontSize: '16px' }}
                className="new-post-image-input"
                type="file"
                placeholder=""
                name="image"
                id="image"
                {...register('image')}
                label=""
                onChange={pickedHandler}
              />
            </div>
          </div>
        </div>
      </form>

      {/* <div className="add-location-wrapper">
        <p className="post-add-text">Add Location</p>
        <BsChevronRight className="add-to-post-arrow" />
      </div> */}

      <div className="tag-person-wrapper" onClick={setModal}>
        <p className="post-add-text">Tag People</p>
        <BsChevronRight className="add-to-post-arrow" />
      </div>
      <div className="tagged-users-wrapper">
        {selectedTags.map((tag, index) => (
          <div key={index} className="tag-selected-container">
            <p>{tag}</p>
            <div className="tagged-cancel" onClick={() => tagRemove(tag)}>
              X
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewPost;
