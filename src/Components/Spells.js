import React, { useEffect, useState } from 'react'
import '../App.css'
import Adivination from './Adivination'
import AvadaKedavra from './AvadaKedavra'

function Spells(props) {
  const spell = props.spellName;

  switch(spell){
    case 'Guess':
      return (
        <Adivination setPhase={props.setPhase} game_name={props.game_name} />
      )
    case 'Avada Kedavra':
      return (
        <AvadaKedavra setPhase={props.setPhase} game_name={props.game_name} />
      )
  }
}
export default Spells;
