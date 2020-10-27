import React, { useState } from 'react'
import axios from 'axios'

import Nomination from "./Nomination"


function InGame(props) {
    const [gameInfo, setGameInfo] = useState({
        game_name: props.game_name,
      })


    return (
        <div class className="nomination">
            <Nomination game_name={gameInfo.game_name}/>
        </div>

    )


}

export default InGame;

