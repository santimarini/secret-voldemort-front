import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';

function Voting(props) {
  const [postulated, setPostulated] = useState({
    director: '',
    minister: '',
  });
  const [disabled, setDisabled] = useState(false);
  const [voteInfo, setVoteInfo] = useState({});
  let interval;

  const { game_name } = props;
  const GET_POSTULATED = `http://localhost:8000/postulated?game_name=${game_name}`;

  useEffect(() => {
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

  const askForPhaseChange = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/phase?game_name=${game_name}`,
      );
      if (response.data.phase_game === 3) {
        clearInterval(interval);
        props.setPhase(3);
      } else if (response.data.phase_game === 1) {
        clearInterval(interval);
        props.setPhase(1);
      }
    } catch (err) {
      clearInterval(interval);
      alert(err);
    }
  };

  const sendVote = async (vote) => {
    setDisabled(true);
    await axios
      .put(`http://localhost:8000/game/${game_name}/vote?vote=${vote}`)
      .then((response) => {
        setVoteInfo(response.data);
      })
      .catch((error) => {
        alert(error);
      });
    interval = setInterval(() => {
      askForPhaseChange();
    }, 2500);
  };

  return (
    <div>
      <h2>Time to vote!</h2>
      <h3>
        Postulated minister:
        {postulated.minister}
      </h3>
      <h3>
        Postulated director:
        {postulated.director}
      </h3>
      <h3 style={{ marginTop: '15px' }}> You accept this government? </h3>

      <button
        disabled={disabled}
        onClick={() => sendVote(true)}
        className="btn pink lighten-1 z-depth-0"
      >
        YES
      </button>
      <div className="divider" />
      <button
        disabled={disabled}
        onClick={() => sendVote(false)}
        className="btn pink lighten-1 z-depth-0"
      >
        NO
      </button>

      {Object.keys(voteInfo).map((key) => {
        switch (key) {
          case 'cant_vote':
            return (
              <p key={key}>
                Votes:
                {voteInfo[key]}
              </p>
            );
          case 'vote_less':
            return (
              <p key={key}>
                Remaining votes:
                {voteInfo[key]}
              </p>
            );
          case 'status_vote':
            return <p key={key}>{voteInfo[key]}</p>;
          case 'elect_min':
            return (
              <p key={key}>
                Minister Elected:
                {voteInfo[key].alias}
              </p>
            );
          case 'elect_dir':
            return (
              <p key={key}>
                Director Elected:
                {voteInfo[key].alias}
              </p>
            );
          default: return null;
        }
      })}
    </div>
  );
}

export default Voting;
