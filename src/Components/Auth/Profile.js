import React, { useEffect, useState, setState } from "react";
import axios from 'axios';
import { Card, Image } from 'react-bootstrap';
import UploadPhoto from './UploadPhoto';
import { getToken } from '../../Util/HelperFunctions';

import "../../App.css";


function Profile() {
  const [alias, setAlias] = useState("");
  const [jwtHeader] = useState({ Authorization: `Bearer ${getToken()}` });
  const [userImage, setUserImage] = useState('');
  const [previewSource, setPreviewSource] = useState('');

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
      };
    };  


  useEffect(() => {
    async function getProfileInfo() {
      const user_alias = localStorage.getItem("alias");
      setAlias(user_alias);
      await axios.get('http://localhost:8000/user_image', {headers: jwtHeader})
        .then(response=> {
              setUserImage(response.data);
          })
        .catch (err => {
            if(err.response.status == 401){
              setUserImage('https://i.imgur.com/xjdz6j8.jpeg');
            }
            else {
              alert(err);

            }
        })
    }
    getProfileInfo();
    console.log(userImage)
  }, []);
       
console.log(userImage)
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
          {userImage &&
            <Image 
            height="160px" 
            width="160px" 
            src={userImage.toString()} 
            roundedCircle
            />
          } 
        </Card.Body>
        <UploadPhoto/>
      </Card>
    </div>
  );
}

export default Profile;
