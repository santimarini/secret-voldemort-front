import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../App.css";

function Profile(props) {
  const [alias, setAlias] = useState("");

  useEffect(() => {
    const user_alias = localStorage.getItem("alias");
    setAlias(user_alias);
  }, []);

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("alias")
  }

  return (
    <div>
      <h2>Welcome!</h2>
      <h4>{alias}</h4>
      <Link to="/play">
        <button className="btn pink lighten-1 z-depth-0"> Create Game </button>
      </Link>
      <Link to="/login">
      <button onClick={logout} className="btn pink lighten-1 z-depth-0 btn-logout">
        Logout
      </button>
      </Link>
    </div>
  );
}

export default Profile;
