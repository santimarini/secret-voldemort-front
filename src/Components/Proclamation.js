import React, { useState, useEffect } from "react";
import axios from "axios";

function Proclamation(props) {
  const [gameInfo, setGameInfo] = useState({
    game_name: props.game_name,
    cards: [],
    disc_card: 0,
    minister: "",
    director: "",
  });
  const [minDiscarded, setMinDiscarded] = useState(false);
  const [disabled, setDisabled] = useState(false);


  const handleSubmit = async (e) => {
    try {
      if (localStorage.getItem("email") === gameInfo.minister) {
        gameInfo.disc_card = document.getElementById("min_discarded").value;
        let response = await axios.put(
          `http://localhost:8000/cards/discard_min?card_id=${gameInfo.disc_card}&game_name=${gameInfo.game_name}`
        );
        setDisabled(true);
        triggerPolling();
      } else if (localStorage.getItem("email") === gameInfo.director) {
        gameInfo.disc_card = document.getElementById("dir_discarded").value;
        let remaining_c = gameInfo.cards.filter(
          (card) => card.id != gameInfo.disc_card
        );
        await axios.put(
          `http://localhost:8000/cards/discard_dir?card_id=${gameInfo.disc_card}&game_name=${gameInfo.game_name}`
        );
        setDisabled(true);
        await axios.put(
          `http://localhost:8000/cards/proclaim?card_id=${remaining_c[0].id}&game_name=${gameInfo.game_name}`
        );
      }
    } catch (err) {
      alert(err);
    }
  };


  // on component mount
  useEffect(() => {
    async function getInfo() {
      try {
        gameInfo.game_name = props.game_name;
        let choosed_response = await axios.get(
          `http://localhost:8000/dirmin_elect?game_name=${gameInfo.game_name}`
        );
        gameInfo.minister = choosed_response.data.elect_min;
        gameInfo.director = choosed_response.data.elect_dir;
        if (localStorage.getItem("email") === gameInfo.minister) {
          let min_response = await axios.get(
            `http://localhost:8000/cards/draw_min?game_name=${gameInfo.game_name}`
          );
          setGameInfo({ ...gameInfo, cards: min_response.data.cards_list });
        } else if (localStorage.getItem("email") === gameInfo.director) {
          let dir_response = await axios.get(
            `http://localhost:8000/cards/draw_dir?game_name=${gameInfo.game_name}`
          );
          setGameInfo({ ...gameInfo, cards: dir_response.data.cards_list });
        }
      } catch (err) {
        alert(err);
      }
    }
    getInfo();
  }, []);

      
  async function askIsProclaimed() {
    try {
      let response = await axios.get(
        `http://localhost:8000/phase?game_name=${gameInfo.game_name}`
      );
      if (response.data.phase_game === 4) {
        // director proclaim
        let dir_response = await axios.get(
          `http://localhost:8000/cards/draw_dir?game_name=${gameInfo.game_name}`
        );
        setGameInfo({ ...gameInfo, cards: dir_response.data.cards_list });
        setMinDiscarded(true);
      } else if (response.data.phase_game === 5) {
        clearInterval(interval);
        props.handleCount(4);
      } else if (response.data.phase_game === 1) {
        props.handleCount(1);
      }
    } catch (err) {
      alert(err);
    }
  }

  
  const triggerPolling = () => {
    interval = setInterval(function () {
      askIsProclaimed();
    }, 2500);
  };

  var interval = null;

    
  return (
    <div class className="container">
      {localStorage.getItem("email") === gameInfo.minister && (
        <div class className="notification">
          <h3>You have to proclaim.</h3>
          <p>Please choose a card to discard.</p>
          <select id="min_discarded">
            {gameInfo.cards.map((card) => (
              <option value={card.id}> {card.loyalty} </option>
            ))}
          </select>
          <button onClick={handleSubmit} disabled={disabled}>
            {" "}
            Discard{" "}
          </button>
        </div>
      )}
      {minDiscarded && localStorage.getItem("email") === gameInfo.director && (
        <div>
          <h3>You have to proclaim.</h3>
          <p>Please choose a card to discard.</p>
          <select id="dir_discarded">
            {gameInfo.cards.map((card) => (
              <option value={card.id}> {card.loyalty} </option>
            ))}
          </select>
          <button onClick={handleSubmit} disabled={disabled}>
            {" "}
            Discard{" "}
          </button>
        </div>
      )}
      {!minDiscarded &&
        localStorage.getItem("email") === gameInfo.director &&
        triggerPolling()}
      {!minDiscarded && localStorage.getItem("email") === gameInfo.director && (
        <div>The minister {gameInfo.minister} is proclaiming.</div>
      )}
      {localStorage.getItem("email") !== gameInfo.minister &&
        localStorage.getItem("email") !== gameInfo.director && (
          <div>
            The minister {gameInfo.minister} together with the director{" "}
            {gameInfo.director} are proclaiming.
          </div>
        )}
    </div>
  );
}

export default Proclamation;
