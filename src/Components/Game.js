import React, { useState } from 'react'
import axios from 'axios'

//username and password lengths
const DATA_FORMAT = {
  min: 4,
  max: 16
}
const ENDPOINT_G = 'http://0.0.0.0:8000/newgame'

function Game() {

  const [gameInfo, setGameInfo  ] = useState({
    email: '',
    name: '',
    max_players: 10
  })

  const handleChange = (e) => {
    setGameInfo({...gameInfo, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    var u_email = localStorage.getItem("email")
    gameInfo.email = u_email
    console.log(gameInfo)
    // check game name length
    if (gameInfo.name.length < DATA_FORMAT.min ||
     DATA_FORMAT.max < gameInfo.name.length)
      return(alert("Invalid game name." + 
        " Please insert a new game name between " + DATA_FORMAT.min + 
        " and " + DATA_FORMAT.max + " characters."))
    
    try {
      let response = axios.post(ENDPOINT_G, gameInfo)
      alert("Game created! Its name is " + gameInfo.name + 
        ". Invite your friends to join!")
    }
    catch(err) {
      alert(err)
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
          <input type="number" id="max_players" name="max_players" min="5" max="10" 
            onChange={handleChange} required/>
        </div>
        <div className="input-field">
          <button className="btn pink lighten-1 z-depth-0"> Sign Up </button>
        </div>
      </form>
    </div>
  );
}

export default Game;
