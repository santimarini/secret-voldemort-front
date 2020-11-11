import React, { useEffect, useState } from "react";
import { Button, Card } from 'react-bootstrap';

import axios from "axios";
import jwt_decode from "jwt-decode";

import InGame from './InGame';
import { getToken } from '../Util/HelperFunctions';

function GameLobby(props) {
   const [started, setStarted] = useState(false);
   const [alias, setAlias] = useState("");
   //decode token to get user email
   const [userEmail] = useState(jwt_decode(getToken()).sub);
   const [gameInfo, setGameInfo] = useState({
       gamename: "",
       max_players: "",
       players: [],
       creator: jwt_decode(getToken()).sub
   });
  const [jwtHeader] = useState({"Authorization" : `Bearer ${getToken()}`})
  const join_input = {
    game_name: props.match.params.gamename,
    email: jwt_decode(getToken()).sub,
  };
  const [err, setErr] = useState('');
  const [players, setPlayers] = useState([]);
  const [isCreatorPolling, setIsCreatorPolling] = useState(false);
  const [isPlayerPolling, setIsPlayerPolling] = useState(false);
  const server_uri = `http://localhost:8000/game/${join_input.game_name}`;

  useEffect(() => {
    async function joinGame() {
      await axios
        .get(server_uri, { headers: jwtHeader })
        .then((response) => {
          setAlias(response.data.alias)
          setGameInfo({
              gamename: response.data.game_name,
              max_players: response.data.max_players,
              players: response.data.players,
              creator: response.data.creator
          })
        })
        .catch((error) => {
          if (error.response.status === 300) alert(error.response.data.detail);
          else alert(error);
          props.history.push("/profile")
        });
    }
  joinGame();
  }, [jwtHeader, server_uri, props.history]);


  var playerInterval = null
  var creatorInterval = null;


  async function askIsStarted() {
      setIsPlayerPolling(true);
      try {
        let response = await axios.get(`http://localhost:8000/phase?game_name=${join_input.game_name}`)
        if (response.data.phase_game !== 0){
          setStarted(true)
          clearInterval(playerInterval);
        }
        setPlayers(response.data.players_list);
      }
      catch (err) {
        alert(err.response.data.detail);
      }
  }

  async function startGame() {
    try {
      let response = await axios.post(
        `http://localhost:8000/start?game_name=${join_input.game_name}`
      );
      alert(response.data);
      setStarted(true);
      clearInterval(creatorInterval);
    } catch (err) {
      clearInterval(creatorInterval);
      alert(err);
    }
  };
  const triggerPolling = () => {
    playerInterval = setInterval(function() {
      askIsStarted();
    }, 2500)
  }

  async function updateList() {
    setIsCreatorPolling(true);
    creatorInterval = setInterval(async function(){
        try {
          let response = await axios.get(`http://localhost:8000/get_players?game_name=${join_input.game_name}`)
        setPlayers(response.data.players_list);
        }
        catch (err){
            alert(err)
         }
    }, 2500)
  }


  return (
    <div>
      <Card
        border="dark"
        bg="light"
        style={{ width: "50rem" }}
        id="card-profile"
      >
      <Card.Body>
      {!started &&
      <div>
        <h2 id="title-form" style={{'margin-bottom': '20px'}}> Game Lobby </h2>
        <h4>Alias: {alias} </h4>
        <h4>Game Name: {gameInfo.gamename} </h4>
        <h4>Max players: {gameInfo.max_players} </h4>
        <ul class="list-group">
          {players.map((player) => (
            <li class="list-group-item"> {player.alias} </li>
          ))}
        </ul>

      </div>
      }
      {userEmail === gameInfo.creator && (isCreatorPolling || !updateList()) && (
        <div>
        {!started && (<div>
            <h6 id="title-form" style={{ "margin-top": "30px" }}> Waiting for players...</h6>
            <Button
              style={{'margin-top': '20px'}}
              id="btn-form"
              onClick={() => startGame()}>
              Start Game
            </Button>
          </div>)}
        </div>)}
      {userEmail !== gameInfo.creator && (isPlayerPolling || !triggerPolling()) && (
        <div>
          <h6 id="title-form" style={{ "margin-top": "30px" }}> Waiting for players...</h6>
        </div>
      )}
        
      {started && <InGame game_name={gameInfo.gamename}/>}
      </Card.Body>
      </Card>
    </div>
  );
}

export default GameLobby;
