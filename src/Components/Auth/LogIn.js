import React, {useState} from 'react';

function LogIn() {
    const [userInfo, setUserInfo] = useState({
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
          <h2 className="grey-text text-darken-3">Login for play!</h2>
          <div className="input-field">
            <label htmlFor="text">Email: </label>
            <input type="email" id="username" name="email" onChange={handleChange}/>
          </div>
          <div className="input-field">
            <label htmlFor="email">Password: </label>
            <input type="password" id="email" name="password" onChange={handleChange}/>
          </div>
          <button className="btn pink lighten-1 z-depth-0"> Log In </button>  
        </form>
      </div>
    )
}

export default LogIn;