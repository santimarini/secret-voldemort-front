import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button } from 'react-bootstrap';

import jwtDecode from 'jwt-decode';
import { getToken } from '../Util/HelperFunctions';

function AvadaKedavra(props) {
  const [minister, setMinister] = useState('');
  const [userEmail] = useState(jwtDecode(getToken()).sub);
  const [players, setPlayers] = useState([]);
  const [killed, setKilled] = useState(false);
  const [win, setWin] = useState(false);
  const [result, setResult] = useState({});
  const [isPolling, setIsPolling] = useState(false);
  const [disabled, setDisabled] = useState(false);

  let interval;

  function goToNomination() {
    props.setPhase(1);
  }

  function goToEnd() {
    props.setPhase(4);
  }

  useEffect(() => {
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
        .get(`http://localhost:8000/get_players?game_name=${props.game_name}`)
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

  async function askKillStatus() {
    try {
      const response = await axios.get(
        `http://localhost:8000/phase?game_name=${props.game_name}`,
      );
      if (response.data.phase_game === 5) {
        clearInterval(interval);
        setWin(true);
        setResult(response.data.player_murdered);
        setTimeout(goToEnd, 10000);
      } else if (response.data.phase_game === 1) {
        clearInterval(interval);
        setKilled(true);
        setResult(response.data.player_murdered);
        setTimeout(goToNomination, 10000);
      }
    } catch (err) {
      alert(err);
    }
  }

  const triggerPolling = () => {
    setIsPolling(true);
    interval = setInterval(() => {
      askKillStatus();
    }, 2500);
  };

  const killPlayer = async () => {
    const playerTarget = document.getElementById('candidate').value;
    try {
      await axios.get(
        `http://localhost:8000/avada_kedavra?game_name=${props.game_name}&victim=${playerTarget}`,
      );
      setDisabled(true);
      triggerPolling();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      {userEmail === minister && (
        <div>
          <h4 id="title-form">Avada Kedavra!</h4>
          <h5>Now, choose a player to kill:</h5>
          <div style={{ 'margin-top': '35px' }}>
            <select id="candidate">
              {players.map((player) => {
                if (player.is_alive && player.user1 !== userEmail) {
                  return (
                    <option value={player.id}>
                      {' '}
                      {player.alias}
                      {' '}
                    </option>
                  );
                }
              })}
            </select>
            <Button
              disabled={disabled}
              style={{ 'margin-left': '20px', 'background-color': '#e33030' }}
              onClick={killPlayer}
            >
              KILL
            </Button>
          </div>
        </div>
      )}
      {minister !== ''
        && !isPolling
        && userEmail !== minister
        && triggerPolling()}
      {userEmail !== minister && (
        <div>
          <h4 id="title-form">
            The minister is throwing 'Avada Kedavra' to another player...
          </h4>
        </div>
      )}
      {killed && (
        <h4 style={{ 'margin-top': '15px', color: '#e33030' }}>
          {result.alias}
          {' '}
          was killed.
        </h4>
      )}
      {win && (
        <div>
          <h4 style={{ 'margin-top': '15px', color: '#e33030' }}>
            {result.alias}
            {' '}
            was Voldemort and is dead.
          </h4>
          <h4 id="title-form">The Fenix Order won the game!</h4>
        </div>
      )}
    </div>
  );
}

export default AvadaKedavra;
