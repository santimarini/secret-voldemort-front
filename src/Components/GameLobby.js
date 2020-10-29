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
       creator: ''
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

  const startGame = async () => {
    try {
      let response = await axios.post(
        "http://localhost:8000/start?game_name=" + gameInfo.gamename
      );
    } catch (err) {
      alert(err.data);
    }
    setStarted(true);
  };

  return (
    <div>
      {started ? (
        <InGame game_name={join_input.game_name} />
      ) : (
        <div>
          <h2>Username: {username} </h2>
          <h2>Game name: {gameInfo.gamename} </h2>
          <h2>Max players: {gameInfo.max_players} </h2>

          {join_input.email === gameInfo.creator ? (
            <button
              onClick={() => startGame()}
              className="btn pink lighten-1 z-depth-0"
            >
              Start Game
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default GameLobby;
