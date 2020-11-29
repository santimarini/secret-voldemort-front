import React, {useState, useEffect} from 'react'
import "../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";

import jwt_decode from "jwt-decode";
import { getToken } from "../Util/HelperFunctions";

function Imperius(props) {
  const [minister, setMinister] = useState("");
  const [userEmail, setUserEmail] = useState(jwt_decode(getToken()).sub);
  const [players, setPlayers] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [isPolling, setIsPolling] = useState(false)
  let interval;

  function goToNomination(){
    props.setPhase(1)
  }
  
  const throwImperius = async () => {
    const playerTarget = document.getElementById("candidate").value;
    await axios
      .post(
        `http://localhost:8000/imperius?game_name=${props.game_name}&new_min_id=${playerTarget}`
      )
      .then(() => {
        setDisabled(true);
        triggerPolling();
      })
      .catch((error) => {
        alert(error);
      });
  };

  async function getElected() {
    await axios
      .get(`http://localhost:8000/dirmin_elect?game_name=${props.game_name}`)
      .then((response) => {
        setMinister(response.data.elect_min.user1);
      })
      .catch((error) => {
        alert(error);
      });
  }

  async function getPlayers() {
    await axios
      .get(`http://localhost:8000/list_imperius?game_name=${props.game_name}`)
      .then((response) => {
        setPlayers(response.data.players_spellbinding);
      })
      .catch((error) => {
        alert(error);
      });
  }

  async function askImperiusStatus() {
    try {
      const response = await axios.get(
        `http://localhost:8000/phase?game_name=${props.game_name}`
      );
      if (response.data.phase_game === 1) {
        clearInterval(interval);
        setTimeout(goToNomination, 5000);
      }
    } catch (err) {
      alert(err);
    }
  }

  useEffect(() => {
    setUserEmail(jwt_decode(getToken()).sub)
    getElected();
    if(userEmail === minister) {
      getPlayers()
    }
  }, [minister, userEmail]);

  const triggerPolling = () => {
    setIsPolling(true);
    interval = setInterval(() => {
      askImperiusStatus();
    }, 2500);
  };

  return (
    <div>
      {userEmail === minister && (
        <div>
          <h4 id="title-form">Imperius!</h4>
          <h5>Now, choose a player to become Minister of Magic:</h5>
          <div style={{ "margin-top": "35px" }}>
            <select id="candidate">
              {players.map((player) => {
                return <option value={player.id}> {player.alias} </option>;
              })}
            </select>
            <Button
              disabled={disabled}
              style={{ "margin-left": "20px" }}
              onClick={throwImperius}
              id="btn-form"
            >
              CHOOSE MINISTER
            </Button>
          </div>
        </div>
      )}

      {minister !== "" &&
        !isPolling &&
        userEmail !== minister &&
        triggerPolling()}
      {userEmail !== minister && (
        <div>
          <h4 id="title-form">
            The minister is throwing 'Imperius' to another player...
          </h4>
        </div>
      )}
    </div>
  );
}

export default Imperius;