import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { getToken } from "../Util/HelperFunctions";

function Nomination(props) {
  const [gameInfo, setGameInfo] = useState({
    game_name: "",
    minister: {},
    players: [],
  });
  const [nominationInfo] = useState({
    director: "",
  });
  const [userEmail] = useState(jwt_decode(getToken()).sub);

  const nominateDirector = async (e) => {
    nominationInfo.director = document.getElementById("candidate").value;
    try {
      await axios.put(
        `http://localhost:8000/game?game_name=${gameInfo.game_name}&dir=${nominationInfo.director}`
      );
      props.setPhase(2);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    async function onElection() {
      gameInfo.game_name = props.game_name;
      try {
        const response = await axios.post(
          `http://localhost:8000/next_turn?game_name=${gameInfo.game_name}`
        );
        setGameInfo({
          ...gameInfo,
          minister: response.data.minister,
          players: response.data.players,
        });
      } catch (error) {
        alert(error);
      }
    }
    onElection();
  }, [gameInfo, props.game_name]);

  let interval = null;

  async function askIsNominated() {
    try {
      const response = await axios.get(
        `http://localhost:8000/phase?game_name=${props.game_name}`
      );
      if (response.data.phase_game === 2) {
        clearInterval(interval);
        props.setPhase(2);
      }
    } catch (err) {
      alert(err);
    }
  }

  const triggerPolling = () => {
    interval = setInterval(() => {
      askIsNominated();
    }, 2500);
  };

  return (
    <div>
      {userEmail === gameInfo.minister.user1 ? (
        <div className className="container">
          <div className className="notification">
            You have been nominated as Minister of Magic.
          </div>
          <p>Please select a player to nominate as Director.</p>
          <select id="candidate">
            {gameInfo.players.map((player) => (
              <option value={player.id}> {player.alias} </option>
            ))}
          </select>
          <button onClick={nominateDirector}> Nominate </button>
        </div>
      ) : (
        triggerPolling()
      )}
      {userEmail !== gameInfo.minister.user1 && (
        <div>
          The nominated minister {gameInfo.minister.alias} is choosing
          director...
        </div>
      )}
    </div>
  );
}

export default Nomination;
