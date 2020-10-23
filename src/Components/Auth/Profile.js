import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import "../../App.css";

function Profile() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const user_email = localStorage.getItem("email");
    setEmail(user_email);
  }, []);

  return (
    <div>
      <h2>Welcome!</h2>
      <h4>{email}</h4>
      <Link to="/play">
        <button className="btn pink lighten-1 z-depth-0"> Create Game </button>
      </Link>
      <div className="divider"></div>
      <button className="btn pink lighten-1 z-depth-0"> Join Game </button>
    </div>
  );
}

export default Profile;
