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
    console.log(data)
    async function sendSignUp() {
     res = await api.post('users/signup', data, {headers: {'Content-Type': 'application/json'}})
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