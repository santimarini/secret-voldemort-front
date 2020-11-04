import React, { useState } from 'react'
import axios from 'axios'

//username and password lengths
const DATA_FORMAT = {
  min: 4,
  max: 16
}
const ENDPOINT_G = 'http://0.0.0.0:8000/newgame'

function Game(props) {

  const [gameInfo, setGameInfo  ] = useState({
    email: '',
    name: '',
    max_players: 10
  })

  const handleChange = (e) => {
    setGameInfo({...gameInfo, [e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    gameInfo.email = localStorage.getItem("email")
    console.log(gameInfo)
    // check game name length
    if (gameInfo.name.length < DATA_FORMAT.min ||
     DATA_FORMAT.max < gameInfo.name.length)
      return(alert("Invalid game name." + 
        " Please insert a new game name between " + DATA_FORMAT.min + 
        " and " + DATA_FORMAT.max + " characters."))
    
    try {
      let response = await axios.post(ENDPOINT_G, gameInfo)
      alert("Game created! Its name is " + response.data.name + 
        ". Invite your friends to join!")
      //redirect to join game created
      props.history.push('/game/' + response.data.name)
    }
    catch (error) {
      if (error.response.status === 401)
        alert(error.response.data.detail)
      else
        alert(error)
    } 
  }

  return (
    <div class className="game-container">
      <form onSubmit={handleSubmit} className="white">
        <h3 className="grey-text text-darken-3">Play game</h3>
        <div className="input-field">
          <label htmlFor="text">Game Name:</label>
          <input type="text" id="game_name" name="name" 
            onChange={handleChange} required/>
        </div>
        <div className="input-field">
          <label htmlFor="number">Max. Players::</label>
          <input type="number" id="max_players" name="max_players" 
            min="5" max="5" onChange={handleChange} required/>
        </div>
        <div className="input-field">
          <button className="btn pink lighten-1 z-depth-0"> Create Game </button>
        </div>
      </form>
    </div>
  );
}

export default Game;
