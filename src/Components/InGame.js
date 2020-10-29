import React, { useState } from 'react'
import axios from 'axios'

import Nomination from "./Nomination"
import Voting from "./Voting"


function InGame(props) {
    const [gameInfo, setGameInfo] = useState({
        game_name: props.game_name,
      })

    const [phaseCount, setPhaseCount] = useState(1)

    function handleCount(value){
        setPhaseCount(value)
    }


    switch(phaseCount) {
        case 1: return (<div class className="nomination">
                                     <Nomination handleCount={handleCount} game_name={gameInfo.game_name}/>
                                 </div>)
        case 2: return(<div>
                        <Voting />
                        </div>)
        default: return(<div>
                            hola
                        </div>
                        )
    }
    
}

export default InGame;
