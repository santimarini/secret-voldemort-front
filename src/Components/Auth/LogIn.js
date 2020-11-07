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
  const updateUserInfo = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // send to the back the request when user accepts the form
  const sendUserInfo = async (e) => {
    e.preventDefault();

    var bodyFormData = new FormData();
    bodyFormData.append('username', userInfo.email);
    bodyFormData.append('password', userInfo.password);
    try {
        let response = await axios.post(server_uri, bodyFormData);
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("alias", response.data.alias);
        props.history.push("/profile");
    }
    catch(error) {
      //set error message
      if (error.response.status === 404)
        setErr(error.response.data.detail);
      else
        setErr(error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={sendUserInfo} className="white">
        <h2 className="grey-text text-darken-3">Login for play!</h2>
        <div className="input-field">
          <label htmlFor="text">Email: </label>
          <input
            type="email"
            id="username"
            name="email"
            onChange={updateUserInfo}
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="email">Password: </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={updateUserInfo}
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

