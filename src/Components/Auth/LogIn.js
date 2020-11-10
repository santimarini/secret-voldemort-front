import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';

const server_uri = 'http://localhost:8000/token';

function LogIn(props) {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  const [err, setErr] = useState('');

  // get all user inputs
  const updateUserInfo = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // send to the back the request when user accepts the form
  const sendUserInfo = async (e) => {
    e.preventDefault();

    const bodyFormData = new FormData();
    bodyFormData.append('username', userInfo.email);
    bodyFormData.append('password', userInfo.password);
    try {
      const response = await axios.post(server_uri, bodyFormData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('alias', response.data.alias);
      window.location.href = '/';
    } catch (error) {
      // set error message
      if (error.response.status === 404) { setErr(error.response.data.detail); } else { setErr(error); }
    }
  };

  return (
    <div className="container">
      <Card bg="light" style={{ width: '25rem' }} id="card-form">
        <Card.Body>
          <Card.Title id="title-login">Login for play!</Card.Title>
          <Form id="text-form" onSubmit={sendUserInfo}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                id="username"
                name="email"
                onChange={updateUserInfo}
                required
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                name="password"
                onChange={updateUserInfo}
                required
                placeholder="Password"
              />
              {err ? <p id="error-msg">{err}</p> : null}
            </Form.Group>
            <Button id="btn-form" type="submit">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LogIn;
