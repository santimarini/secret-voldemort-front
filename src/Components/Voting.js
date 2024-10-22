import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import VotingResult from './VotingResult';
import VotingStatus from './VotingStatus';

import { getToken } from '../Util/HelperFunctions';

function Voting(props) {
  const [postulated, setPostulated] = useState({
    director: '',
    minister: '',
  });
  const [disabled, setDisabled] = useState(false);
  const [voteInfo, setVoteInfo] = useState({});
  const [endVote, setEndVote] = useState(false);
  const [win, setWin] = useState(false);
  const [voldemortElected, setVoldemortElected] = useState(false);
  const [jwtHeader] = useState({ Authorization: `Bearer ${getToken()}` });
  let interval;

  const { game_name } = props;
  const GET_POSTULATED = `http://localhost:8000/postulated?game_name=${game_name}`;

  const goToNomination = () => {
    props.setPhase(1);
  };

  const goToProclamation = () => {
    props.setPhase(3);
  };

  const goToEnd = () => {
    props.setPhase(4);
  };

  const finishImperius = async () => {
    try {
      await axios.post(
        `http://localhost:8000/finish_imperius?game_name=${game_name}`,
      );
    } catch (err) {
      console.log(err);
    }
  };

  const askForPhaseChange = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/phase?game_name=${game_name}`,
      );
      if (response.data.phase_game === 3) {
        clearInterval(interval);
        finishImperius();
        setTimeout(() => {
          setEndVote(true);
          setWin(true);
        }, 5000);
      } else if (response.data.phase_game === 1) {
        clearInterval(interval);
        finishImperius();
        goToNomination();
      } else if (response.data.phase_game === 5) {
        clearInterval(interval);
        setVoldemortElected(true);
        setTimeout(goToEnd, 8000);
      }
    } catch (err) {
      clearInterval(interval);
      alert(err);
    }
  };

  const triggerPolling = () => {
    interval = setInterval(() => {
      askForPhaseChange();
    }, 2500);
  };

  const sendVote = async (vote) => {
    setDisabled(true);
    await axios
      .put(
        `http://localhost:8000/game/${game_name}/vote?vote=${vote}`,
        {},
        { headers: jwtHeader },
      )
      .then((response) => {
        setVoteInfo(response.data);
      })
      .catch((error) => {
        alert(error);
      });
    triggerPolling();
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/get_player?game_name=${game_name}`, {
        headers: jwtHeader,
      })
      .then((response) => {
        if (!response.data.player.is_alive) {
          setDisabled(true);
          triggerPolling();
        }
      })
      .catch((error) => {
        alert(error);
      });
    axios
      .get(GET_POSTULATED)
      .then((response) => {
        setPostulated({
          director: response.data.post_director.alias,
          minister: response.data.post_minister.alias,
        });
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  return (
    <div>
      <h3 id="title-form">Time to vote!</h3>
      <h4>
        Postulated minister:
        {postulated.minister}
      </h4>
      <h4>
        Postulated director:
        {postulated.director}
      </h4>
      <h4 style={{ marginTop: '15px' }}> You accept this government? </h4>

      <div style={{ 'margin-top': '35px' }}>
        <Button
          id="btn-form"
          disabled={disabled}
          onClick={() => sendVote(true)}
        >
          YES
        </Button>
        <div className="divider" />
        <Button
          id="btn-form"
          disabled={disabled}
          onClick={() => sendVote(false)}
        >
          NO
        </Button>
      </div>

      <div style={{ 'margin-top': '30px' }}>
        {endVote ? (
          <VotingResult
            voteResults={voteInfo}
            forward={goToProclamation}
            win={win}
            gamename={game_name}
            postulated={postulated}
          />
        ) : (
          <h4>The players are voting...</h4>
        )}
      </div>
      {voldemortElected ? (
        <div style={{ 'margin-top': '15px' }}>
          <h4>Voldemort has been elected! </h4>
          <h4 style={{ color: '#1523a3' }}>Death Eaters won the game!</h4>
        </div>
      ) : null}
      <VotingStatus game_name={game_name} />
    </div>
  );
}

export default Voting;
