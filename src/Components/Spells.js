import React, { useEffect, useState } from 'react'
import '../App.css'
import axios from 'axios'

import jwt_decode from 'jwt-decode';
import { getToken } from '../Util/HelperFunctions';

function Spells(props) {
  const spell = props.spellName;
  const [minister, setMinister] = useState('')
  const [userEmail] = useState(jwt_decode(getToken()).sub);

  useEffect(() => {
    async function getElected(){
      await axios
      .get(`http://localhost:8000/dirmin_elect?game_name=${props.game_name}`)
      .then((response) => {
        setMinister(response.data.elect_min.user1)
      })
      .catch((error) => {
        alert(error);
      });
    }
    getElected()
  }, [])

  return (
    <div>
      {spell === "Guess" && userEmail === minister && (
        <div>
          <h4 id="title-form">Adivination!</h4>
          <h5>These are the 3 top cards of the deck:</h5>
        </div>
      )}
      {spell === "Guess" && userEmail !== minister && (
        <h4 id="title-form">The minister throw 'Adivination' and is guessing...</h4>
      )
      }
      
    </div>
  );
}

export default Spells;

/*const [timeLeft, setTimeLeft] = useState(30)

    const createCountdown = () => {
      setInterval(function () {
        if(timeLeft === 0) {
            console.log("finished")
        } else {
            setTimeLeft(timeleft => timeleft - 1)
        }
      }, 1000);
    };*/

/*
{spell === "Guess" && userEmail !== minister && (
        <h4 id="title-form">The minister throw 'Adivination' and is guessing...</h4>
      )
      }
*/