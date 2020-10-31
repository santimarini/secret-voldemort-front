import React, { useEffect, useState } from "react";
import axios from "axios";

import InGame from './InGame'

function GameLobby(props) {
   const [started, setStarted] = useState(false)
   const [username, setUsername] = useState("")
   const [gameInfo, setGameInfo] = useState({
       gamename: "",
       max_players: "",
       players: [],
       creator: localStorage.getItem("email")
   })
  const join_input = {
    game_name: props.match.params.gamename,
    email: localStorage.getItem("email"),
  };


  const server_uri = `http://localhost:8000/game/${join_input.game_name}?email=${join_input.email}`;


  useEffect(() => {
    axios
      .post(server_uri)
      .then((response) => {
        setUsername(response.data.username)
        setGameInfo({
            gamename: response.data.game_name,
            max_players: response.data.max_players,
            players: response.data.players,
            creator: response.data.creator
        })
      })
      .catch((error) => {
        if (error.response.status === 404) alert(error.response.data.detail);
        else alert(error);
        props.history.push("/profile")
      });
  }, []);


  var interval = null

  async function askIsStarted() {
      try {
        let response = await axios.get(`http://localhost:8000/game/is_started?game_name=${gameInfo.gamename}`)
        if (response.data === true){
          clearInterval(interval)
          setStarted(true)
        }
      }
      catch (err) {
        alert(err)
      }
  }


  async function startGame() {
    try {
      let response = await axios.post(
        `http://localhost:8000/start?game_name=${join_input.game_name}`
      );
      alert(response.data)
      setStarted(true)
    } catch (err) {
      clearInterval(interval)
      alert(err);
    }
  };

  return (
    <div>
      {!started &&
      <div>
        <h2>Username: {username} </h2>
        <h2>Game name: {gameInfo.gamename} </h2>
        <h2>Max players: {gameInfo.max_players} </h2>
     </div>
      }
      {localStorage.getItem("email") === gameInfo.creator ? (
        <div>
        {!started && <div>
            <button
              onClick={() => startGame()}
              className="btn pink lighten-1 z-depth-0">
              Start Game
            </button>
          </div>}
      </div>) : interval = setInterval(function() {
        askIsStarted();
        }, 6000)}
      {started && <InGame game_name={gameInfo.gamename}/>}
    </div>
  );
}

export default GameLobby;
