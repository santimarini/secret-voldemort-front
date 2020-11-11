import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import {Button} from 'react-bootstrap'

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
      <h3 id="title-form">Time to vote!</h3>
      <h4>Postulated minister: {postulated.minister}</h4>
      <h4>Postulated director: {postulated.director}</h4>
      <h4 style={{ marginTop: "15px" }}> You accept this government? </h4>

      <div style={{'margin-top': '35px'}}>
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

      <div style={{'margin-top': '30px'}}>
      {Object.keys(voteInfo).map((key) => {
        switch (key) {
          case "cant_vote":
            return (
              <h5 key={key}>
                Votes:
                {voteInfo[key]}
              </h5>
            );
          case "vote_less":
            return (
              <h5 key={key}>
                Remaining votes:
                {voteInfo[key]}
              </h5>
            );
          case "status_vote":
            return <h5 key={key}>{voteInfo[key]}</h5>;
          case "elect_min":
            return (
              <h5 key={key}>
                Minister Elected: {voteInfo[key].alias}
              </h5>
            );
          case "elect_dir":
            return (
              <h5 key={key}>
                Director Elected: {voteInfo[key].alias}
              </h5>
            );
          default:
            return null;
        }
      })}
      </div>
    </div>
  );
}

export default Voting;
