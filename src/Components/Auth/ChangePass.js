import React, { useState } from 'react';
import {
  Card, Accordion, Button, Form,
} from 'react-bootstrap';
import axios from 'axios';

import { getToken } from '../../Util/HelperFunctions';

function ChangePass() {
  const [passInfo, setPassInfo] = useState({
    actual_pass: '',
    new_pass: '',
    confirm_new_pass: '',
  });
  const [jwtHeader] = useState({ Authorization: `Bearer ${getToken()}` });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const serverURI = `http://localhost:8000/change_password?old_password=${passInfo.actual_pass}&`
    + `new_password=${passInfo.new_pass}&confirm_new_password=${passInfo.confirm_new_pass}`;

  const handleChange = (e) => {
    setPassInfo({ ...passInfo, [e.target.name]: e.target.value });
  };

  const changePassword = async (e) => {
    e.preventDefault();
    await axios
      .post(serverURI, {}, { headers: jwtHeader })
      .then((response) => {
        setError('');
        setSuccess(response.data);
      })
      .catch((error) => {
        setSuccess('');
        setError(error.response.data.detail);
      });
  };

  return (
    <Accordion defaultActiveKey="1">
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Change Password
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form id="text-form" onSubmit={changePassword}>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Your old password</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="actual_pass"
                  type="password"
                  placeholder="Enter old password"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Your new password</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="new_pass"
                  type="password"
                  placeholder="Enter new password"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Repeat your new password</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="confirm_new_pass"
                  type="password"
                  placeholder="Enter new password again"
                />
              </Form.Group>

              <Button id="btn-form" type="submit">
                Change
              </Button>

              {success && (
                <h6 style={{ 'margin-top': '-30px', color: '#008000' }}>
                  {' '}
                  <center>
                    {' '}
                    {success}
                    {' '}
                  </center>
                  {' '}
                </h6>
              )}
              {error && (
                <h6 style={{ 'margin-top': '-30px', color: '#FF0000' }}>
                  <center>
                    {' '}
                    {error}
                    {' '}
                  </center>
                  {' '}
                </h6>
              )}
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default ChangePass;
