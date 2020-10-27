import React, { useState, useEffect } from 'react'
import axios from 'axios'


function Nomination(props) {

    const [gameInfo, setGameInfo] = useState({
    game_name: '', 
    minister: ''
  })  
  useEffect(() => {
      async function onElection() {
        gameInfo.game_name = props.game_name
        try {     
          let response = await axios.post(`http://localhost:8000/new_turn?game_name=${gameInfo.game_name}`)
          setGameInfo({ minister: "santi" })
          console.log(response.data)
        }
        catch (error) {
          alert(error)
        }
      }   
        onElection()  
    }, []);  
  
    if (localStorage.getItem("email") === gameInfo.minister.user1){
    return(
        <div class className="container">
            <div class className="notification">
                You have been elected as Minister of Magic.
            </div>
            <div className="selection-request">
                <p>Please select a player to nominate as Director.</p>
            </div>
            <div class className="select">
            <select name="players" id="players" multiple size=<var>minister.length</var>>
                <option value="pedro"> { gameInfo.minister } </option>
                <option value="pedro"> { gameInfo.minister } </option>
            </select>
            </div>
            <div class className="select-button">
            <button className="btn pink lighten-1 z-depth-0"> 
                Elect director
            </button>
            </div>
        </div>


    )   
  }
  else {
    return(
        "El ministro está nominando director..."
    )   

  }
}

export default Nomination;
