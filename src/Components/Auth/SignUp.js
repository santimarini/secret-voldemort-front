import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Form } from 'react-bootstrap';

// alias and password lengths
const DATA_FORMAT = {
  min: 4,
  max: 16,
};
const ENDPOINT_SU = 'http://localhost:8000/signup';

function SignUp() {
  const [userInfo, setUserInfo] = useState({
    alias: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [checkEmail, setCheckEmail] = useState(false);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    // check userInfo length
    try {
      if (userInfo.alias.length < DATA_FORMAT.min
       || DATA_FORMAT.max < userInfo.alias.length) { throw Error('alias'); }
      if (userInfo.password.length < DATA_FORMAT.min
       || DATA_FORMAT.max < userInfo.password.length) { throw Error('password'); }
      // if all ok, send post request to backend
      try {
        await axios.post(ENDPOINT_SU, userInfo);
        setCheckEmail(true);
        await axios.post(`http://localhost:8000/send_email?user_email=${userInfo.email}`);
      } catch (error) {
        setCheckEmail(false);
        if (error.response.status === 404) {
          setEmailError('Email entered is already registered. Please enter another email.');
        } else { alert(error); }
      }
    } catch (err) {
      setCheckEmail(false);
      setError(`Invalid ${err.message}. Please insert a ${err.message} between ${DATA_FORMAT.min} to ${DATA_FORMAT.max} characters.`);
    }
  };

  return (
    <div className className="container">
      <Card bg="light" style={{ width: '25rem' }} id="card-form">
        <Card.Body>
          <Card.Title id="title-login">Sign up for play!</Card.Title>
          <Form id="text-form" onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Alias</Form.Label>
              <Form.Control
                type="text"
                id="alias"
                name="alias"
                onChange={handleChange}
                required
                placeholder="Enter your alias"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
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
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </Form.Group>
            {error ? <p id="error-msg">{error}</p> : null}
            {emailError ? <p id="error-msg">{emailError}</p> : null}
            {checkEmail && <p>Email confirmation was sent! Check your inbox before play.</p>}
            <Button id="btn-form" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SignUp;
