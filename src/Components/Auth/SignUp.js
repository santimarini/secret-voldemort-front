import React, { useState }  from 'react'
import axios from 'axios'

//alias and password lengths
const DATA_FORMAT = {
  min: 4,
  max: 16
}
const ENDPOINT_SU = 'http://0.0.0.0:8000/signup'


function SignUp(props) {

  const [userInfo, setUserInfo] = useState({
    alias: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('') 

  const handleChange = (e) => {
    setUserInfo({...userInfo, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(userInfo)
    setError('')
    setEmailError('')
    //check userInfo length
    try {
      if (userInfo.alias.length < DATA_FORMAT.min ||
       DATA_FORMAT.max < userInfo.alias.length)
        throw Error("alias")
      if (userInfo.password.length < DATA_FORMAT.min ||
       DATA_FORMAT.max < userInfo.password.length)
        throw Error("password")
      //if all ok, send post request to backend
      try { 
        await axios.post(ENDPOINT_SU, userInfo) 
        alert(`Welcome ${userInfo.alias}! Log in for play!`)
        props.history.push("/login")
      }
      catch (error) {
        if (error.response.status === 404) {
          setEmailError("Email entered is already registered. Please enter another email.")
        }
        else
          alert(error)
      }
   }
    catch(err) {
      setError(`Invalid ${err.message}. Please insert a ${err.message} between ${DATA_FORMAT.min} to ${DATA_FORMAT.max} characters.`)
    }
  }

  return (
    <div class className="container">
      <form onSubmit={handleSubmit} className="white">
        <h3 className="grey-text text-darken-3">Sign up for play!</h3>
        <div className="input-field">
          <label htmlFor="text"> Alias: </label>
          <input type="text" id="alias" name="alias" 
            onChange={handleChange} required/>
        </div>
        <div className="input-field">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" 
            onChange={handleChange} required/>
        </div>
        <div className="input-field">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" 
            onChange={handleChange} required/>
        </div>
        <div className="input-field">
          <button className="btn pink lighten-1 z-depth-0"> Sign Up </button>
        </div>
        {error ? (
          <div>
            {error}
          </div>
        ): null}
        {emailError ? (
          <div>
            {emailError}
          </div>
        ): null}

      </form>
    </div>
  );

}

export default SignUp;
