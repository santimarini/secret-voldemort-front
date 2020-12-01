import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Button } from "react-bootstrap";

import { getToken } from "../Util/HelperFunctions";

function Nomination(props) {
  const [gameInfo, setGameInfo] = useState({
    game_name: "",
    players: [],
  });
  const [minister, setMinister] = useState({});
  const [nominationInfo] = useState({
    director: "",
  });
  const [userEmail] = useState(jwt_decode(getToken()).sub);
  const [isPolling, setIsPolling] = useState(false);
  let interval = null;

  const nominateDirector = async () => {
    nominationInfo.director = document.getElementById("candidate").value;
    try {
      await axios.put(
        `http://localhost:8000/game?game_name=${gameInfo.game_name}&dir=${nominationInfo.director}`
      );
      clearInterval(interval);
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
          `http://localhost:8000/set_minister?game_name=${gameInfo.game_name}`
        );
        setMinister(response.data.minister);
      } catch (error) {
        alert(error);
      }

      try {
        const response = await axios.post(
          `http://localhost:8000/next_turn?game_name=${gameInfo.game_name}`
        );
        setGameInfo({
          ...gameInfo,
          players: response.data.players,
        });
      } catch (error) {
        alert(error);
      }
    }

    onElection();
  }, []);

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
    setIsPolling(true);
    interval = setInterval(() => {
      askIsNominated();
    }, 2500);
  };

  return (
    <div>
      {Object.keys(minister).length !== 0 && userEmail === minister.user1 && (
        <div className className="container">
          <h4 id="title-form">You have been nominated as Minister of Magic.</h4>
          <h5>Please select a player to nominate as Director.</h5>
          <div style={{ "margin-top": "35px" }}>
            <select id="candidate">
              {gameInfo.players.map((player) => (
                <option value={player.id}> {player.alias} </option>
              ))}
            </select>
            <Button
              style={{ "margin-left": "20px" }}
              id="btn-form"
              onClick={nominateDirector}
            >
              Nominate
            </Button>
          </div>
        </div>
      )}
      {Object.keys(minister).length !== 0 &&
        userEmail !== minister.user1 &&
        !isPolling &&
        triggerPolling()}
      {userEmail !== minister.user1 && (
        <h4 id="title-form">
          The nominated minister {minister.alias} is choosing director...
        </h4>
      )}
    </div>
  );
}

export default Nomination;
