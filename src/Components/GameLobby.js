import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";

import axios from "axios";
import jwt_decode from "jwt-decode";

import InGame from "./InGame";
import { getToken } from "../Util/HelperFunctions";

function GameLobby(props) {
  const [started, setStarted] = useState(false);
  const [alias, setAlias] = useState("");
  //decode token to get user email
  const [userEmail] = useState(jwt_decode(getToken()).sub);
  const [gameInfo, setGameInfo] = useState({
    gamename: "",
    max_players: "",
    players: [],
    creator: jwt_decode(getToken()).sub,
  });
  const [jwtHeader] = useState({ Authorization: `Bearer ${getToken()}` });
  const join_input = {
    game_name: props.match.params.gamename,
    email: jwt_decode(getToken()).sub,
  };
  const [err, setErr] = useState("");
  const [players, setPlayers] = useState([]);
  const [isCreatorPolling, setIsCreatorPolling] = useState(false);
  const [isPlayerPolling, setIsPlayerPolling] = useState(false);
  const [returnToGame, setReturnToGame] = useState(false);
  const [phaseGame, setPhaseGame] = useState("");
  const [msjError, setMsjError] = useState("");
  const server_uri = `http://localhost:8000/game/${join_input.game_name}`;
  var playerInterval = null; //interval for players
  var creatorInterval = null; //interval for creator

  useEffect(() => {
    async function joinGame() {
      await axios
        .get(server_uri, { headers: jwtHeader })
        .then((response) => {
          setAlias(response.data.alias);
          setGameInfo({
            gamename: response.data.game_name,
            max_players: response.data.max_players,
            players: response.data.players,
            creator: response.data.creator,
          });
          if (response.data.phase_game !== 0) {
            setPhaseGame(response.data.phase_game);
            setReturnToGame(true);
            setStarted(true);
          } else {
            setPhaseGame(0);
          }
        })
        .catch((error) => {
          props.history.push("/profile");
        });
    }
    joinGame();
  }, [jwtHeader, server_uri, props.history]);

  async function askIsStarted() {
    setIsPlayerPolling(true);
    try {
      let response = await axios.get(
        `http://localhost:8000/phase?game_name=${join_input.game_name}`
      );
      if (response.data.phase_game !== 0 && 
        response.data.phase_game !== 5) {
        setStarted(true);
        clearInterval(playerInterval);
      }
      if(response.data.phase_game === 5){
        window.location.href = '/games';
      }
      setPlayers(response.data.players_list);
    } catch (err) {
      alert(err.response.data.detail);
    }
  }

  async function startGame() {
    try {
      let response = await axios.post(
        `http://localhost:8000/start?game_name=${join_input.game_name}`
      );
      setStarted(true);
      clearInterval(creatorInterval);
    } catch (err) {
      clearInterval(creatorInterval);
      setMsjError(err.response.data.detail);
    }
  }
  async function exitGame() {
    try {
      let response = await axios.get(
        `http://localhost:8000/exit_game?game_name=${join_input.game_name}`,
        { headers: jwtHeader }
      );
      window.location.href = "/games";
    } catch (err) {
      alert(err);
    }
  }

  const triggerPolling = () => {
    playerInterval = setInterval(function () {
      askIsStarted();
    }, 2500);
  };

  async function updateList() {
    setIsCreatorPolling(true);
    creatorInterval = setInterval(async function () {
      try {
        let response = await axios.get(
          `http://localhost:8000/get_players?game_name=${join_input.game_name}`
        );
        setPlayers(response.data.players_list);
      } catch (err) {
        alert(err);
      }
    }, 2500);
  }

  return (
    <div>
      {!started && phaseGame === 0 && (
        <Card
          border="dark"
          bg="light"
          style={{ width: "50rem" }}
          id="card-profile"
        >
          <Card.Body>
            <div>
              <h2 id="title-form" style={{ "margin-bottom": "20px" }}>
                {" "}
                Game Lobby{" "}
              </h2>
              <h4>Alias: {alias} </h4>
              <h4>Game Name: {gameInfo.gamename} </h4>
              <h4>Max players: {gameInfo.max_players} </h4>
              <ul class="list-group">
                {players.map((player) => (
                  <li class="list-group-item"> {player.alias} </li>
                ))}
              </ul>
              <h6 id="title-form" style={{ "margin-top": "30px" }}>
                {" "}
                Waiting for players...
              </h6>
              {userEmail === gameInfo.creator &&
              (isCreatorPolling || !updateList()) ? (
                <div>
                  {!started && (
                    <div>
                      <Button
                        style={{ "margin-top": "20px" }}
                        id="btn-form"
                        onClick={() => startGame()}
                      >
                        Start Game
                      </Button>
                      <Button
                        style={{
                          "margin-top": "20px",
                          "margin-left": "10px",
                          "background-color": "#8B0000",
                        }}
                        onClick={() => exitGame()}
                      >
                        Exit Game
                      </Button>
                      {msjError && (
                        <h5 id="title-form" style={{ "margin-top": "15px" }}>
                          {msjError}
                        </h5>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Button
                    style={{
                      "margin-top": "20px",
                      "margin-left": "10px",
                      "background-color": "#8B0000",
                    }}
                    onClick={() => exitGame()}
                  >
                    Exit Game
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      )}

      {userEmail !== gameInfo.creator && (isPlayerPolling || !triggerPolling())}
      {started && !returnToGame && (
        <InGame phase={1} game_name={join_input.game_name} />
      )}
      {returnToGame && (
        <InGame phase={phaseGame} game_name={join_input.game_name} />
      )}
    </div>
  );
}

export default GameLobby;
