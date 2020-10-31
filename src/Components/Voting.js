import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";

function Voting(props) {
  const [postulated, setPostulated] = useState({
    director: "",
    minister: "",
  });
  const [vote, setVote] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [voteInfo, setVoteInfo] = useState({})

  const game_name = props.game_name;
  const GET_POSTULATED = `http://localhost:8000/postulated?game_name=${game_name}`;

  useEffect(() => {
    axios
      .get(GET_POSTULATED)
      .then((response) => {
        setPostulated({
          director: response.data.post_director.username,
          minister: response.data.post_minister.username,
        });
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  const handleVote = (vote) => {
    setDisabled(true)
    setVote(vote)
    axios
      .put(`http://localhost:8000/game/${game_name}/vote?vote=${vote}`)
      .then((response) => {
        setVoteInfo(response.data)
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div>
      <h2>Time to vote!</h2>
      <h3>Postulated minister: {postulated.minister}</h3>
      <h3>Postulated director: {postulated.director}</h3>
      <h3 style={{ marginTop: "15px" }}> You accept this government? </h3>

      <button
        disabled={disabled}
        onClick={() => handleVote(true)}
        className="btn pink lighten-1 z-depth-0"
      >
        YES
      </button>
      <div class="divider" />
      <button
        disabled={disabled}
        onClick={() => handleVote(false)}
        className="btn pink lighten-1 z-depth-0"
      >
        NO
      </button>

      {Object.keys(voteInfo).map((key) => {
        switch (key) {
          case "cant_vote":
            return <p key={key}>Votes: {voteInfo[key]}</p>;
          case "vote_less":
            return <p key={key}>Remaining votes: {voteInfo[key]}</p>;
          case "status_vote":
            return <p key={key}>{voteInfo[key]}</p>;
          case "elect_min":
            return <p key={key}>Minister Elected: {voteInfo[key].username}</p>;
          case "elect_dir":
            return <p key={key}>Director Elected: {voteInfo[key].username}</p>;
        }
      })}
    </div>
  );
}

export default Voting;