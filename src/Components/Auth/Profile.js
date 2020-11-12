import React, { useEffect, useState } from "react";
import { Card, Image } from 'react-bootstrap';

import "../../App.css";
import ChangePass from './ChangePass'

function Profile() {
  const [alias, setAlias] = useState("");

  useEffect(() => {
    const user_alias = localStorage.getItem("alias");
    setAlias(user_alias);
  }, []);

  return (
    <div>
      <Card
        border="dark"
        bg="light"
        style={{ width: "50rem" }}
        id="card-profile"
      >
        <Card.Body>
          <Card.Title id="title-login">
            <h3 id="title-form">Profile Information</h3>
          </Card.Title>
          <Card.Text>
            <h5>Username: {alias}</h5>
          </Card.Text>
          <Image
            height="160px"
            width="160px"
            src="https://i.imgur.com/xjdz6j8.jpeg"
            roundedCircle
          />
        </Card.Body>

        <ChangePass />
      </Card>
    </div>
  );
}

export default Profile;
