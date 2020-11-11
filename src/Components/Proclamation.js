import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Button } from 'react-bootstrap'

import { getToken } from '../Util/HelperFunctions';

function Proclamation(props) {
  const [gameInfo, setGameInfo] = useState({
    game_name: props.game_name,
    cards: [],
    disc_card: 0,
    minister: '',
    director: '',
  });
  const [minDiscarded, setMinDiscarded] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [userEmail] = useState(jwtDecode(getToken()).sub);

  let interval = null;

  async function askIsProclaimed() {
    try {
      const response = await axios.get(
        `http://localhost:8000/phase?game_name=${gameInfo.game_name}`,
      );
      if (response.data.phase_game === 4) {
        // director proclaim
        const dirResponse = await axios.get(
          `http://localhost:8000/cards/draw_two_cards?game_name=${gameInfo.game_name}`,
        );
        setGameInfo({ ...gameInfo, cards: dirResponse.data.cards_list });
        setMinDiscarded(true);
      } else if (response.data.phase_game === 5) {
        clearInterval(interval);
        props.setPhase(4);
      } else if (response.data.phase_game === 1) {
        props.setPhase(1);
      }
    } catch (err) {
      alert(err);
    }
  }

  const triggerPolling = () => {
    interval = setInterval(() => {
      askIsProclaimed();
    }, 2500);
  };

  const discardCard = async () => {
    try {
      if (userEmail === gameInfo.minister.user1) {
        gameInfo.disc_card = document.getElementById('min_discarded').value;
        await axios.put(
          `http://localhost:8000/cards/discard_min?card_id=${gameInfo.disc_card}&game_name=${gameInfo.game_name}`,
        );
        setDisabled(true);
        triggerPolling();
      } else if (userEmail === gameInfo.director.user1) {
        gameInfo.disc_card = document.getElementById('dir_discarded').value;
        const remainingCard = gameInfo.cards.filter(
          (card) => card.id !== gameInfo.disc_card,
        );
        await axios.put(
          `http://localhost:8000/cards/discard_dir?card_id=${gameInfo.disc_card}&game_name=${gameInfo.game_name}`,
        );
        setDisabled(true);
        await axios.put(
          `http://localhost:8000/cards/proclaim?card_id=${remainingCard[0].id}&game_name=${gameInfo.game_name}`,
        );
      }
    } catch (err) {
      alert(err);
    }
  };

  // on component mount
  useEffect(() => {
    async function getTurnInfo() {
      try {
        gameInfo.game_name = props.game_name;
        const choosedResponse = await axios.get(
          `http://localhost:8000/dirmin_elect?game_name=${gameInfo.game_name}`,
        );
        gameInfo.minister = choosedResponse.data.elect_min;
        gameInfo.director = choosedResponse.data.elect_dir;
        if (userEmail === gameInfo.minister.user1) {
          const minResponse = await axios.get(
            `http://localhost:8000/cards/draw_three_cards?game_name=${gameInfo.game_name}`,
          );
          setGameInfo({ ...gameInfo, cards: minResponse.data.cards_list });
        } else if (userEmail === gameInfo.director.user1) {
          const dirResponse = await axios.get(
            `http://localhost:8000/cards/draw_two_cards?game_name=${gameInfo.game_name}`,
          );
          setGameInfo({ ...gameInfo, cards: dirResponse.data.cards_list });
        }
      } catch (err) {
        alert(err);
      }
    }
    getTurnInfo();
  }, []);

  return (
    <div className className="container">
      {userEmail === gameInfo.minister.user1 && (
        <div className className="notification">
          <h4 id="title-form">You have to proclaim.</h4>
          <h5>Please choose a card to discard.</h5>
          <div style={{ "margin-top": "35px" }}>
            <select id="min_discarded">
              {gameInfo.cards.map((card) => (
                  <option value={card.id}>
                  {' '}
                  {card.loyalty}
                  {' '}
                </option>
              ))}
            </select>
          <Button onClick={discardCard} disabled={disabled}
           style={{ "margin-left": "20px" }}
           id="btn-form"
           >
            {' '}
            Discard
            {' '}
          </Button>
         </div> 
       </div>
      )}
      {minDiscarded && userEmail === gameInfo.director.user1 && (
        <div>
          <h4 id="title-form">You have to proclaim.</h4>
          <h5>Please choose a card to discard.</h5>
          <div style={{ "margin-top": "35px" }}>
            <select id="dir_discarded">
              {gameInfo.cards.map((card) => (
                <option value={card.id}>
                  {' '}
                  {card.loyalty}
                  {' '}
                </option>
              ))}
            </select>
            <Button onClick={discardCard} disabled={disabled}
             style={{ "margin-left": "20px" }}
             id="btn-form"
             >
              {' '}
              Discard
              {' '}
            </Button>
          </div>
        </div>
      )}
      {!minDiscarded
        && userEmail === gameInfo.director.user1
        && triggerPolling()}
      {!minDiscarded && userEmail === gameInfo.director.user1 && (
        <h4 id="title-form">
          The minister
          {' '}
          {gameInfo.minister.alias}
          {' '}
          is proclaiming.
        </h4>
      )}
      {userEmail !== gameInfo.minister.user1
        && userEmail !== gameInfo.director.user1 && (
         <h4 id="title-form">
            The minister
            {' '}
            {gameInfo.minister.alias}
            {' '}
            together with the director
            {' '}
            {gameInfo.director.alias}
            {' '}
            are proclaiming.
          </h4>
      )}
    </div>
  );
}

export default Proclamation;
