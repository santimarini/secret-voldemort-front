import React, { useState } from "react";
import axios from "axios";

const server_uri = "sv";
const DATA_FORMAT = {
  min: 4,
  max: 16
}

function LogIn() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  // get all user inputs
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // send to the back the request when user accepts the form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      userInfo.password.length < DATA_FORMAT.min ||
      DATA_FORMAT.max < userInfo.password.length
    ) {
      return alert(
        "Invalid password. \nPlease insert a correct one between " +
          DATA_FORMAT.min +
          " and " +
          DATA_FORMAT.max +
          " characters."
      );
    }

    axios({
      method: "post",
      url: server_uri,
      data: userInfo,
    });
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
    </div>
  );
}

export default LogIn;
