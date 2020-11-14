import React, { useEffect, useState } from 'react'
import '../App.css'
import Adivination from './Adivination'

function Spells(props) {
  const spell = props.spellName;

  switch(spell){
    case 'Guess':
      return (
        <Adivination setPhase={props.setPhase} game_name={props.game_name} />
      )
    default:
      return <p>Avada kedabra</p>
  }
}
export default Spells;
