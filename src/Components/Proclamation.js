import React, { useState, useEffect } from 'react'
import axios from 'axios'


function Proclamation(props) {

    const [gameInfo, setGameInfo] = useState({
        game_name: props.game_name,
        cards: [],
        disc_card: '',
    })

    const handleSubmit = async (e) => {
        gameInfo.disc_card = document.getElementById("discarded").value
        try {
            let response = await axios.put(`http://localhost:8000/cards/proclaim?card_id=${gameInfo.disc_card}&game_name=${gameInfo.game_name}`)
        }
        catch (err){
            alert(err)
        }
        return("hola")


    }

    useEffect(() => {
        async function onProclamation() {
             gameInfo.game_name = props.game_name
              try {
              let response = await axios.get(`http://localhost:8000/cards/draw?game_name=${gameInfo.game_name}`)
              setGameInfo({...gameInfo, cards: response.data.cards_list })
            }
            catch (error) {
              alert(error)
            }
          }
            onProclamation()
        }, []);







    return(
            <div class className="container">
                <div class className="notification">
                    <h3>You have to proclaim.</h3>
                </div>
                <p>Please choose a card to discard.</p>
                <select id="discarded" size=<var>gameInfo.players.length</var>>
                    { gameInfo.cards.map((card) => <option value={card.id}> { card.loyalty } </option>) }
                </select>
                <button onClick={handleSubmit}> Discard </button>

            </div>
        )




}

export default Proclamation;
