import React, { useState, useEffect } from 'react'
import axios from 'axios'


function Nomination(props) {

    const [gameInfo, setGameInfo] = useState({
      game_name: '',
      minister: {},
      players: [],
    })
    const [nominationInfo] = useState({
        director: ''
    })


    const handleSubmit = async (e) => {
        nominationInfo.director = document.getElementById("candidate").value
        try {
            await axios.put(`http://localhost:8000/game?game_name=${gameInfo.game_name}&dir=${nominationInfo.director}`)
            props.handleCount(2)
        }
        catch (err) {
            alert(err)
        }
    }
 

    useEffect(() => {
        async function onElection() {
          gameInfo.game_name = props.game_name
          try {     
              let response = await axios.post(`http://localhost:8000/next_turn?game_name=${gameInfo.game_name}`)
              setGameInfo({...gameInfo, minister: response.data.minister,
                  players: response.data.players })
          }
          catch (error) {
              alert(error)
          }
        }   
        onElection()  
    }, []);  


    var interval = null

    async function askIsNominated() {
        try {
            let response = await axios.get(`http://localhost:8000/phase?game_name=${props.game_name}`)
            if (response.data.phase_game === 2) {
                clearInterval(interval)
                props.handleCount(2)
            }
        }
        catch (err) {
            alert(err)
        }
    }
    
    const triggerPolling = () => {
      interval = setInterval(function () {
        askIsNominated();
      }, 2500);
    };

  
    return(
        <div>
        {localStorage.getItem("email") === gameInfo.minister.user1 ? (
            <div class className="container">
                <div class className="notification">
                    You have been nominated as Minister of Magic.
                </div>
                <p>Please select a player to nominate as Director.</p>
                <select id="candidate">
                    { gameInfo.players.map((player) => <option value={player.id}> { player.username } </option>) }
                </select>
                <button onClick={handleSubmit}> Nominate </button>
            </div>
        ) : triggerPolling()}
          {localStorage.getItem("email") !== gameInfo.minister.user1 &&
              <div>
                  The nominated minister {gameInfo.minister.username} is choosing director...
              </div>
          }
       
      </div>)
}

export default Nomination;
