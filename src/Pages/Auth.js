import React, {useState, useContext} from 'react';
import loginContent from '../Static/login';
import signUpContent from '../Static/signup';
import { useForm } from 'react-hook-form';
import { yupResolver} from '@hookform/resolvers/yup';
import api from '../Static/axios';
import * as yup from 'yup';
import './Auth.css';
import { AuthContext } from '../Context/auth-context';
import ErrorModal from '../Components/Reusable/ErrorModal';
import Modal from '../Components/Reusable/Modal';


const schemaLogin = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6)
})
// put these in a seperate static file 
const schemaSignUp = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
  userName: yup.string().required().min(6),
  name: yup.string().required().min(4)
})



const Auth = () => {
  const auth = useContext(AuthContext)
  const [login, setLogin] = useState(true);
  const [error, setError] = useState()
  const [showError, setShowError] = useState(false)
  const [waiverModal, setWaiverModal] = useState(false)

 
  const {register, handleSubmit, errors, formState} = useForm({
    resolver: yupResolver(schemaLogin),
    mode: "onChange"
  })

  const {register: register2, handleSubmit: handleSubmit2, errors: errors2, formState: formState2} = useForm({
    resolver: yupResolver(schemaSignUp),
    mode: "onChange"
  })

  const signUpHandler = () => {
    setLogin(false)
    setWaiverModal(true)
  }

  const acceptWaiver = () => {
    setWaiverModal(false)
  }

  const rejectWaiver = () => {
    setWaiverModal(false)
    setLogin(true)
  }

  const loginHandler = () => {
    setLogin(true)
  }

  const loginSubmitHandler = (data) => {
    let res;
    console.log(data)
    async function sendLogin() {
      try {
        res = await api.post('users/login', data, {headers: {'Content-Type': 'application/json'}})
        console.log(res)
        auth.login(res.data.userId, res.data.token, res.data.userName)
      } catch (err) {
        setError("Check your credentials and try again")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
      }
        
    }
    sendLogin()
    }

  const signupSubmitHandler = (data) => {
    let res
    async function sendSignUp() {
    try {
      res = await api.post('users/signup', data, {headers: {'Content-Type': 'application/json'}})
    } catch(err) {
      setError("Something went wrong. Try different username/password")
        setShowError(true)
        setTimeout(function() {setShowError(false)}, 2000)
    }

      console.log(res)
      auth.login(res.data.userId, res.data.token, res.data.userName)
    }
    sendSignUp()
  }

  return (
    <div>
      <ErrorModal 
      children={<p className="errorText">{error}</p>}
      show={showError}
      />
      <Modal
        modalStyle={"alternate-modal"}
        show={waiverModal}
        onCancel={acceptWaiver}
        children={
          <div className="waiver-wrapper">
              <h1>Before You Join...</h1>
              <p>This site is currently in development. There will be tons of bugs which you can report when in hitting the gear icon in your account page. If you report a bug PLEASE report HOW you encountered it,
                otherwise it will be difficult to pinpoint what went wrong. I am very aware that this site does not contain all the features of instagram. I am one bad developer and Instagram has thousands of
                the smartest developers in the world and billions of dollars of funding. That being said, There are some features I do hope to add once I have more time. These include:</p>
              <ul>
                <li>Sharing feature</li>
                <li>Emojis</li>
                <li>Video Upload</li>
                <li>Tagging in comments</li>
                <li>Liking comments</li>
                <li>No I'm not doing a story feature because its pointless so don't ask me.</li>
                <li>Virtual Pizza Parties</li>
              </ul>
              <h1>Security</h1>
              <p>...Yea there isn't very much of it. It would be hard for anyone to access your account. That being said, don't post sensitive information or pictures. Any data you post or even private messages you 
                send can be seen in the database by me if for some reason I had to go digging. Another feature I will be working on will be encrypting all of that data. This isn't because I'm worried about your privacy
                as much as it is me just avoiding the awkward feeling if I accidentally saw it. Your password on the other hand IS encrypted and I cannot see it. 
              </p>
              <h1>Final Thoughts</h1>
              <p>If there is a bug such as a page not loading, being stuck on a loading spinner, or the page crashing, a simple refresh will likely fix the issue temporarily. Also, don't tap buttons over and over
                again if it doesn't do something. I haven't coded in any error handling for that and it may cause errors I have not forseen. 
              </p>
              <div className="waiver-button-box">
                <button className="waiver-button1" onClick={acceptWaiver}>Accept</button>
                <button className="waiver-button2" onClick={rejectWaiver}>Nope!</button>
              </div>
          </div>
        }
      
      >
        

      </Modal>
      <p>{auth.isLoggedIn}</p>
      <h2 className="auth-head text-center">Nonurgentgram</h2>
      {login && 
      <div className="loginWrapper">
        <form onSubmit={handleSubmit(loginSubmitHandler)}>
          {loginContent.inputs.map((input,key) => {
            return (
              <div key={key} className="loginInputWrapper">
                <input className="loginInput" name={input.name} placeholder={input.label} type={input.type} {...register(input.name)} />
              </div>
            )
          } )}
          <button className="authButton" type='submit' disabled={!formState.isValid}>Log In</button>
        </form>
        <div className="choicesWrapper">
          <div className="choiceLine"></div>
          <h2>OR</h2>
          <div className="choiceLine"></div>
        </div>

        <div className="authAlternative">
          <p className="altText">Don't have an account?</p>
          <p className="blueButton" onClick={signUpHandler}>Sign up</p>
        </div>

      </div>  
      }
      {!login && 
        <div className="loginWrapper">
        <form onSubmit={handleSubmit2(signupSubmitHandler)} >
          {signUpContent.inputs.map((input,key) => {
            return (
              <div key={key} className="loginInputWrapper">
                <input className="loginInput" name={input.name} placeholder={input.label} type={input.type} {...register2(input.name)}  />
              </div>
            )
          } )}
          <button className="authButton" type='submit'   disabled={!formState2.isValid}>Sign Up</button>
          
        </form>
        <div className="choicesWrapper">
          <div className="choiceLine"></div>
          <h2>OR</h2>
          <div className="choiceLine"></div>
        </div>

        <div className="authAlternative">
          <p className="altText">Already have an account?</p>
          <p className="blueButton" onClick={loginHandler}>Log in</p>
        </div>

      </div>  
      }
    </div>
  )
}

export default Auth;