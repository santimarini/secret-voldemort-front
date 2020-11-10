import React, { useState } from "react";
import axios from "axios";
import {Card, Button, Form} from 'react-bootstrap'

import { getToken } from "../Util/HelperFunctions";

//username and password lengths
const DATA_FORMAT = {
  min: 4,
  max: 16,
};
const ENDPOINT_G = "http://localhost:8000/newgame";


function Game(props) {
  const [gameInfo, setGameInfo] = useState({
    token: getToken(),
    name: "",
    max_players: 10,
  });
  const [error, setError] = useState("");
  const [jwtHeader] = useState({"Authorization" : `Bearer ${gameInfo.token}`});

  const updateGameInfo = (e) => {
    setGameInfo({ ...gameInfo, [e.target.name]: e.target.value });
  };

  const createGame = async (e) => {
    e.preventDefault();
    // check game name length
    if (
      gameInfo.name.length < DATA_FORMAT.min ||
      DATA_FORMAT.max < gameInfo.name.length
    ) {
      return setError(
        "Invalid game name." +
          " Please insert a new game name between " +
          DATA_FORMAT.min +
          " and " +
          DATA_FORMAT.max +
          " characters."
      );
    }
    try {
      let response = await axios.post(ENDPOINT_G, gameInfo, { headers: jwtHeader });
      alert(
        "Game created! Its name is " +
          response.data.name +
          ". Invite your friends to join!"
      );
      //redirect to join game created
      props.history.push("/game/" + response.data.name);
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.detail);
      else setError(error);
    }
  };

  return (
    <div class className="game-container">
      <Card bg="light" style={{ width: "25rem" }} id="card-form">
        <Card.Body>
          <Card.Title id="title-login">Play Game</Card.Title>
          <Form id="text-form" onSubmit={createGame}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Game name</Form.Label>
              <Form.Control
                type="text"
                id="game_name"
                name="name"
                onChange={updateGameInfo}
                required
                placeholder="Enter game name"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Max. players</Form.Label>
              <Form.Control
                type="number"
                id="max_players"
                name="max_players"
                min="5"
                max="5"
                onChange={updateGameInfo}
                required
                placeholder="Enter max. players"
              />
              {error ? <p id='error-msg'>{error}</p> : null}
            </Form.Group>
            <Button id="btn-form" type="submit">Create Game</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Game;