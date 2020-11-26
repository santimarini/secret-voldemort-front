import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';


function VotingStatus(props) {
    const [players, setPlayers] = useState([]);
    const [isAsking, setIsAsking] = useState(false);
    var interval = null;
    const [votingEnded, setVotingEnded] = useState(false);
    
    async function getPlayers() {
        await axios
            .get(`http://localhost:8000/get_players?game_name=${props.game_name}`)
            .then((response) => {
              setPlayers(response.data.players_list);
            })
            .catch((error) => {
                 alert(error);
            });     
     }


    function triggerPolling() {
        setIsAsking(true);
        interval = setInterval(() => {
            getPlayers();
              players.filter((p) =>{return p.is_alive})
              let alivePlayers = 0;
              let totalVotes = 0;
            
              for(var i = 0; i < players.length; ++i){
                  if (players[i].vote !== null)
                      totalVotes +=1
              }
              if (totalVotes === players.length && players.length != 0){
                  clearInterval(interval);
                  setVotingEnded(true);
              }
              else {
                  setVotingEnded(false);
              }
        }, 2500);
    }

    return(
    <div>
     <Card
          border="dark"
          bg="light"
         style={{ width: "25rem", "bottom":"0px" }}
          id="card-profile"

     >
         <Card.Body>
             <div>
              {!votingEnded && 
              <div>
                  <h2 id="title-form" style={{ "margin-bottom": "20px" }}>
                    {" "}
                    Voting Status{" "}
                  </h2>
                  <ul class="list-group">
                    {players.map((player) => (
                        <li class="list-group-item"> {player.alias} {!player.vote ? ": voting..." : "vote"  }</li>
                    ))}
                  </ul>
                   <h6 id="title-form" style={{ "margin-top": "30px" }}>
                     {" "}
                     Waiting for votes ...
                   </h6>
              </div>
              }
              {votingEnded && 
            <div>
               <h2 id="title-form" style={{ "margin-bottom": "20px" }}>
                 {" "}
                 Voting Result {" "}
               </h2>

               <ul class="list-group">
                {players.map((player) => (
                    <li class="list-group-item">  <div> {player.alias} {": "} {player.vote? "yes": "no"} </div> </li>
                ))}
              </ul>
              </div>
             }
             {!isAsking && triggerPolling()}
             </div>
        </Card.Body>
    </Card>
    </div>

    );



}

export default VotingStatus;
