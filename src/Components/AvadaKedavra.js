import React, { useEffect, useState } from 'react'
import "../App.css";
import axios from "axios";
import {Button} from 'react-bootstrap'

import jwt_decode from "jwt-decode";
import { getToken } from "../Util/HelperFunctions";

function AvadaKedavra(props) {
    const [minister, setMinister] = useState("");
    const [userEmail] = useState(jwt_decode(getToken()).sub);
    const [players, setPlayers] = useState([])
    const [killed, setKilled] = useState(false)
    const [result, setResult] = useState({})
    let interval;

    function goToNomination() {
      props.setPhase(1)
    }

    function goToEnd() {
      props.setPhase(4)
    }

    useEffect(() => {
      async function getElected() {
        await axios
          .get(
            `http://localhost:8000/dirmin_elect?game_name=${props.game_name}`
          )
          .then((response) => {
            setMinister(response.data.elect_min.user1);
          })
          .catch((error) => {
            alert(error);
          });
      }
      async function getPlayers(){
        await axios
        .get(
          `http://localhost:8000/get_players?game_name=${props.game_name}`
        )
        .then((response) => {
          setPlayers(response.data.players_list);
        })
        .catch((error) => {
          alert(error);
        });
      }
      getElected();
      getPlayers();
    }, []);

    const killPlayer = async () => {
      const playerTarget = document.getElementById("candidate").value;
      await axios
        .get(
          `http://localhost:8000/avada_kedavra?game_name=${props.game_name}&victim=${playerTarget}`
        )
      triggerPolling()
    };

    const triggerPolling = () => {
      interval = setInterval(() => {
        askKillStatus();
      }, 2500);
    };

    async function askKillStatus() {
      try {
        const response = await axios.get(
          `http://localhost:8000/phase?game_name=${props.game_name}`,
        );
        if (response.data.phase_game === 5) {
          clearInterval(interval);
          setTimeout(goToEnd, 10000);
        } else if(response.data.phase_game === 1) {
          clearInterval(interval)
          setKilled(true)
          setResult(response.data.player_murdered)
          setTimeout(goToNomination, 10000);
        }
      } catch (err) {
        alert(err);
      }
    }

    return (
      <div>
        {userEmail === minister && (
          <div>
            <h4 id="title-form">Avada Kedavra!</h4>
            <h5>Now, choose a player to kill:</h5>
            <div style={{ "margin-top": "35px" }}>
              <select id="candidate">
                {players.map((player) => {
                  if (player.is_alive && player.user1 !== userEmail) {
                    return <option value={player.id}> {player.alias} </option>;
                  }
                })}
              </select>
              <Button
                style={{ "margin-left": "20px", "background-color": "#e33030" }}
                onClick={killPlayer}
              >
                KILL
              </Button>
            </div>
          </div>
        )}
        {userEmail !== minister && triggerPolling()}
        {userEmail !== minister && (
          <div>
            <h4 id="title-form">
              The minister is throwing 'Avada Kedavra' to another player...
            </h4>
          </div>
        )}
        {killed && (
          <h4
            id="title-form"
            style={{ color: "#e01b25", "margin-top": "20px" }}
          >
            {result.alias} was killed.
          </h4>
        )}
      </div>
    );
}

export default AvadaKedavra;