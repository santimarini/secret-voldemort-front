import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';

import jwtDecode from 'jwt-decode';
import { getToken } from '../Util/HelperFunctions';

function Adivination(props) {
  const [minister, setMinister] = useState('');
  const [cardList, setCardList] = useState([]);
  const [userEmail] = useState(jwtDecode(getToken()).sub);
  const [seconds, setSeconds] = useState(20);
  const [isPolling, setIsPolling] = useState(false);
  let interval;

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
    async function getTopCards() {
      try {
        const response = await axios.get(
          `http://localhost:8000/cards/draw_three_cards?game_name=${props.game_name}`,
        );
        setCardList(response.data.cards_list);
        setTimeout(() => {
          axios.post(
            `http://localhost:8000/phase?game_name=${
              props.game_name
            }&phase=${1}`,
          );
        }, 20000);
        setInterval(() => {
          if (seconds <= 0) {
            setSeconds(0);
          } else {
            setSeconds((seconds) => seconds - 1);
          }
        }, 1000);
      } catch (error) {
        alert(error);
      }
    }
    getElected();
    getTopCards();
  }, []);

  async function askSpellEnd() {
    try {
      const response = await axios.get(
        `http://localhost:8000/phase?game_name=${props.game_name}`,
      );
      if (response.data.phase_game === 1) {
        clearInterval(interval);
        props.setPhase(1);
      }
    } catch (err) {
      alert(err);
    }
  }

  const triggerPolling = () => {
    setIsPolling(true);
    interval = setInterval(() => {
      askSpellEnd();
    }, 2500);
  };

  return (
    <div>
      {!isPolling && userEmail === minister && triggerPolling()}
      {userEmail === minister && (
        <div>
          <h4 id="title-form">Adivination!</h4>
          <h5>These are the 3 top cards of the deck:</h5>
          {cardList.map((card) => {
            {
              if (card.loyalty === 'Fenix Order') {
                return (
                  <h5
                    style={{ color: '#f52525' }}
                    id="title-form"
                    key={card.loyalty}
                  >
                    {card.loyalty}
                  </h5>
                );
              }
              return (
                <h5
                  style={{ color: '#1b2dd1' }}
                  id="title-form"
                  key={card.loyalty}
                >
                  {card.loyalty}
                </h5>
              );
            }
          })}
        </div>
      )}
      {minister !== ''
        && !isPolling
        && userEmail !== minister
        && triggerPolling()}
      {userEmail !== minister && (
        <h4 id="title-form">
          The minister throw 'Adivination' and is guessing...
        </h4>
      )}
      <h4 id="title-form">{seconds}</h4>
    </div>
  );
}

export default Adivination;
