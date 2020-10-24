import React, { useEffect, useState } from "react";
import axios from "axios";

function GameLobby(props) {
   const [username, setUsername] = useState("")
   const [gameInfo, setGameInfo] = useState({
       gamename: "",
       max_players: "",
       players: []
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
            gamename: response.data.gamename,
            max_players: response.data.max_players,
            players: response.data.players
        })
      })
      .catch((error) => {
        if (error.response.status === 404) alert(error.response.data.detail);
        else alert(error);
        props.history.push("/profile")
      });
  }, []);

  return (
      <div>
      <h1>Username: {username} </h1>
      <h1>Game name: {gameInfo.gamename} </h1>
      <h1>Max players: {gameInfo.max_players} </h1>
      </div>
  );
}

export default GameLobby;
