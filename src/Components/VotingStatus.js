import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';

function VotingStatus(props) {
  const [players] = useState({ info: [] });
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [votingEnded, setVotingEnded] = useState(false);
  let interval = null;

  async function getPlayers() {
    await axios
      .get(`http://localhost:8000/get_players?game_name=${props.game_name}`)
      .then((response) => {
        players.info = response.data.players_list;
      })
      .catch((error) => {
        alert(error);
      });
  }

  function triggerPolling() {
    interval = setInterval(() => {
      getPlayers();
      const alivePlayers = players.info.filter((p) => p.is_alive === true);
      setAlivePlayers(alivePlayers);
      if (
        alivePlayers.filter((p) => p.vote !== null).length
        === alivePlayers.length
        && alivePlayers.length !== 0
      ) {
        clearInterval(interval);
        setVotingEnded(true);
      } else {
        setVotingEnded(false);
      }
    }, 3000);
  }

  useEffect(() => {
    triggerPolling();
  }, [votingEnded]);

  return (
    <div>
      <Card
        border="dark"
        bg="light"
        style={{ width: '25rem', bottom: '0px' }}
        id="card-profile"
      >
        <Card.Body>
          <div>
            {!votingEnded && (
              <div>
                <h2 id="title-form" style={{ 'margin-bottom': '20px' }}>
                  {' '}
                  Voting Status
                  {' '}
                </h2>
                <ul className="list-group">
                  {alivePlayers.map((player) => (
                    <li className="list-group-item">
                      {' '}
                      {player.alias}
                      {' '}
                      {player.vote === null ? ': voting...' : 'vote'}
                    </li>
                  ))}
                </ul>
                <h6 id="title-form" style={{ 'margin-top': '30px' }}>
                  {' '}
                  Waiting for votes ...
                </h6>
              </div>
            )}
            {votingEnded && (
              <div>
                <h2 id="title-form" style={{ 'margin-bottom': '20px' }}>
                  {' '}
                  Voting Result
                  {' '}
                </h2>

                <ul className="list-group">
                  {alivePlayers.map((player) => (
                    <li className="list-group-item">
                      {' '}
                      <div>
                        {' '}
                        {player.alias}
                        {' '}
                        {': '}
                        {' '}
                        {player.vote ? 'yes' : 'no'}
                        {' '}
                      </div>
                      {' '}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default VotingStatus;
