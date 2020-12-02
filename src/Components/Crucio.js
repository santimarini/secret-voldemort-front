import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button } from 'react-bootstrap';

import jwtDecode from 'jwt-decode';
import { getToken } from '../Util/HelperFunctions';

function Crucio(props) {
  const [minister, setMinister] = useState('');
  const [userEmail, setUserEmail] = useState(jwtDecode(getToken()).sub);
  const [players, setPlayers] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [loyalty, setLoyalty] = useState({});
  const [isPolling, setIsPolling] = useState(false);
  let interval;

  function goToNomination() {
    props.setPhase(1);
  }

  async function askCrucioStatus() {
    try {
      const response = await axios.get(
        `http://localhost:8000/phase?game_name=${props.game_name}`,
      );
      if (response.data.phase_game === 1) {
        clearInterval(interval);
        setTimeout(goToNomination, 5000);
      }
    } catch (err) {
      alert(err);
    }
  }

  const triggerPolling = () => {
    setIsPolling(true);
    interval = setInterval(() => {
      askCrucioStatus();
    }, 2500);
  };

  const getLoyalty = async () => {
    const playerTarget = document.getElementById('candidate').value;
    await axios
      .get(
        `http://localhost:8000/crucio?game_name=${props.game_name}&victim=${playerTarget}`,
      )
      .then((response) => {
        setDisabled(true);
        setLoyalty(response.data);
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
      .get(`http://localhost:8000/list_of_crucio?game_name=${props.game_name}`)
      .then((response) => {
        setPlayers(response.data.list_players);
      })
      .catch((error) => {
        alert(error);
      });
  }

  useEffect(() => {
    setUserEmail(jwtDecode(getToken()).sub);
    getElected();
    if (userEmail === minister) {
      getPlayers();
    }
  }, [minister, userEmail]);

  return (
    <div>
      {userEmail === minister && (
        <div>
          <h4 id="title-form">Crucio!</h4>
          <h5>Now, choose a player to reveal loyalty:</h5>
          <div style={{ 'margin-top': '35px' }}>
            <select id="candidate">
              {players.map((player) => (
                <option value={player.id}>
                  {' '}
                  {player.alias}
                  {' '}
                </option>
              ))}
            </select>
            <Button
              disabled={disabled}
              style={{ 'margin-left': '20px' }}
              onClick={getLoyalty}
              id="btn-form"
            >
              GET LOYALTY
            </Button>

            {Object.keys(loyalty).length > 0
              && loyalty.loyalty === 'Fenix Order' && (
                <h4 id="title-form" style={{ 'margin-top': '20px' }}>
                  Player:
                  {' '}
                  <b>{loyalty.alias}</b>
                  {' '}
                  Loyalty:
                  {' '}
                  <b style={{ color: '#cf2121' }}>{loyalty.loyalty}</b>
                </h4>
            )}
            {Object.keys(loyalty).length > 0
              && loyalty.loyalty === 'Death Eaters' && (
                <h4 id="title-form" style={{ 'margin-top': '20px' }}>
                  Player:
                  {' '}
                  <b>{loyalty.alias}</b>
                  {' '}
                  Loyalty:
                  {' '}
                  <b style={{ color: '#1523a3' }}>{loyalty.loyalty}</b>
                </h4>
            )}
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
            The minister is throwing 'Crucio' to another player...
          </h4>
        </div>
      )}
    </div>
  );
}

export default Crucio;
