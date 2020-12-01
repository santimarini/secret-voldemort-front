import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Image } from 'react-bootstrap';
import { getToken } from '../../Util/HelperFunctions';

import '../../App.css';
import ChangeAlias from './ChangeAlias';
import ChangePass from './ChangePass';
import UploadPhoto from './UploadPhoto';

function Profile() {
  const [alias, setAlias] = useState('');
  const [jwtHeader] = useState({ Authorization: `Bearer ${getToken()}` });
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    async function getProfileInfo() {
      const userAlias = localStorage.getItem('alias');
      setAlias(userAlias);
      await axios
        .get('http://localhost:8000/user_image', { headers: jwtHeader })
        .then((response) => {
          setUserImage(response.data);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            setUserImage('https://i.imgur.com/xjdz6j8.jpeg');
          }
        });
    }
    getProfileInfo();
  }, []);

  return (
    <div>
      <Card
        border="dark"
        bg="light"
        style={{ width: '50rem' }}
        id="card-profile"
      >
        <Card.Body>
          <Card.Title id="title-login">
            <h3 id="title-form">Profile Information</h3>
          </Card.Title>
          <Card.Text>
            <h5>
              Alias:
              {alias}
            </h5>
          </Card.Text>
          {userImage && (
            <Image
              height="160px"
              width="160px"
              src={userImage.toString()}
              roundedCircle
            />
          )}
        </Card.Body>
        <ChangeAlias />
        <ChangePass />
        <UploadPhoto />
      </Card>
    </div>
  );
}

export default Profile;
