import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../../Util/HelperFunctions';
import { Accordion,  Button, Card, Form } from 'react-bootstrap';

function ChangeAlias() {
    const [alias, setAlias] = useState({ value: ''} );
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [jwtHeader] = useState({ Authorization: `Bearer ${getToken()}` });


    const handleChange = (e) => {
        setAlias({...alias, [e.target.name]: e.target.value }); 
    }; 

    const changeAlias = async (e) => {
        e.preventDefault();
        try {
            let response = await axios.post(`http://localhost:8000/change_alias?alias=${alias.value}`, {} ,{headers: jwtHeader});
            localStorage.setItem("alias", alias.value);
            setSuccessMsg("Alias updated successfully!");
            setTimeout(() => { window.location.href = '/profile' }, 2000);

        }
        catch (err) {
            console.log(err.response);
            if (err.response.status === 401){
                setErrMsg(err.response.data.detail);
            }
            else {
                alert(err);
            }
        }
    };


    return (
    <Accordion defaultActiveKey="1">
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Change Alias 
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form id="text-form" onSubmit={changeAlias}>
              <Form.Group >
                <Form.Label>Your new alias:</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="value"
                  type="text"
                  placeholder="Enter new alias"
                />
              </Form.Group>
              <Button id="btn-form" type="submit">
                Change
              </Button>
              {successMsg && <h6 style={{"margin-top":"-30px", "color":"#008000"}}> <center> {successMsg} </center></h6>}
              {errMsg && !successMsg && <h6 style={{"margin-top":"-30px", "color":"#FF0000"}}> <center> {errMsg} </center></h6>}
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    );
}
export default ChangeAlias;
