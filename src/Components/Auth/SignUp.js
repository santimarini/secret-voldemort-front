import React, { Component, useState }  from 'react'


function SignUp() {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setUserInfo({...userInfo, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(userInfo)
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="white">
        <h5 className="grey-text text-darken-3">Sign up for play!</h5>
        <div className="input-field">
          <label htmlFor="text">Username: </label>
          <input type="text" id="username" name="username" onChange={handleChange}/>
        </div>
        <div className="input-field">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" onChange={handleChange}/>
        </div>
        <div className="input-field">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" onChange={handleChange}/>
        </div>
        <div className="input-field">
          <button className="btn pink lighten-1 z-depth-0"> Sign Up </button>
        </div>
      </form>
    </div>
  );

}

export default SignUp;

