import React, { useState, useEffect } from 'react'
import axios from 'axios'


function Nomination(props) {

    const [gameInfo, setGameInfo] = useState({
    game_name: '', 
    minister: '',
    players: [],
  })
    const [nominationInfo, setNominationInfo] = useState({
    director: ''
})

    const handleSubmit = async (e) => {
        nominationInfo.director = document.getElementById("candidate").value
        try{
            console.log(nominationInfo.director)
            let response = await axios.put(`http://localhost:8000/game?game_name=${gameInfo.game_name}&dir=${nominationInfo.director}`)
        }
        catch (err) {
            alert(err)
        }
  }
 
  useEffect(() => {
      async function onElection() {
        gameInfo.game_name = props.game_name
        try {     
          let response = await axios.post(`http://localhost:8000/new_turn?game_name=${gameInfo.game_name}`)
          setGameInfo({...gameInfo, minister: response.data.minister,
            players: response.data.players })
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
                You have been nominated as Minister of Magic.
            </div>
            <p>Please select a player to nominate as Director.</p>
            <select id="candidate" size=<var>gameInfo.players.length</var>>
                { gameInfo.players.map((player) => <option value={player.id}> { player.username } </option>) }
            </select>
            <button onClick={handleSubmit}> Nominate </button>
            
        </div>
    )   
  }
  else {
    return(
        <div>
        "The nominated minister" ${gameInfo.minister.username}"is choosing director..."
        </div>
    )   

  }
}

export default Nomination;
    
