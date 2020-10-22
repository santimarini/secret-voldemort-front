import React, { useState }  from 'react'
import axios from 'axios'

//username and password lengths
const DATA_FORMAT = {
  min: 4,
  max: 16
}
const ENDPOINT_SU = 'http://0.0.0.0:8000/signup'


function SignUp() {

  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setUserInfo({...userInfo, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(userInfo)
    //check userInfo length
    try {
      if (userInfo.username.length < DATA_FORMAT.min ||
       DATA_FORMAT.max < userInfo.username.length)
        throw Error("username")
      if (userInfo.password.length < DATA_FORMAT.min ||
       DATA_FORMAT.max < userInfo.password.length)
        throw Error("password")
    }
    catch(err) {
      return alert("Invalid " + err.message + ". \nPlease insert a correct " 
        + err.message + " between " + DATA_FORMAT.min + " and " + 
        DATA_FORMAT.max + " characters.")
    }
    
    //if all ok, send post request to backend
    try { 
      let response = await axios.post(ENDPOINT_SU, userInfo) 
      alert("Welcome " + userInfo.username + "!" + " Log in for play!")
    }
    catch(error) {
      var b = error.toString().includes("404")
      if (b)
        alert("Email entered is already registered. " +
          "Please enter another email.")
      else
        alert(error)
    }
  }

  return (
    <div class className="container">
      <form onSubmit={handleSubmit} className="white">
        <h5 className="grey-text text-darken-3">Sign up for play!</h5>
        <div className="input-field">
          <label htmlFor="text">Username: </label>
          <input type="text" id="username" name="username" 
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
      </form>
    </div>
    
  );

}

export default SignUp;
