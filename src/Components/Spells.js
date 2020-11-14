import React, { useEffect, useState } from 'react'
import '../App.css'
import axios from 'axios'

import jwt_decode from 'jwt-decode';
import { getToken } from '../Util/HelperFunctions';
import Adivination from './Adivination'

function Spells(props) {
  const spell = props.spellName;

  switch(spell){
    case 'Guess':
      return (
        <Adivination setPhase={props.setPhase} game_name={props.game_name} />
      )
    default:
      return <p>pepega</p>
  }
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
await axios.post(
          `http://localhost:8000/phase?game_name=${props.game_name}&phase=${1}`
        );
*/