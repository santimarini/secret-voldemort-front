import React, { useState } from "react";
import axios from "axios";

const server_uri = "http://localhost:8000/token";

function LogIn(props) {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState('')

  // get all user inputs
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // send to the back the request when user accepts the form
  const handleSubmit = (e) => {
    e.preventDefault();

    var bodyFormData = new FormData();
    bodyFormData.append('username', userInfo.email);
    bodyFormData.append('password', userInfo.password);

    axios.post(server_uri, bodyFormData) 
    .then(response => {
      localStorage.setItem("email", response.data.access_token)
      props.history.push("/profile")
    })
    .catch(error=> {
      if (error.response.status === 404)
        setErr(error.response.data.detail)
      else
        alert(error)
    })

  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="white">
        <h2 className="grey-text text-darken-3">Login for play!</h2>
        <div className="input-field">
          <label htmlFor="text">Email: </label>
          <input
            type="email"
            id="username"
            name="email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="email">Password: </label>
          <input
            type="password"
            id="email"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn pink lighten-1 z-depth-0"> Log In </button>
      </form>
      {
        err ? <p>{err}</p> : null
      }
    </div>
  );
}

export default LogIn;
