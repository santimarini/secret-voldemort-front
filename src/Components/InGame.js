import React, { useState } from 'react';
import { Button, Card  } from 'react-bootstrap';
import Nomination from './Nomination';
import Voting from './Voting';
import Proclamation from './Proclamation';
import Profile from './Auth/Profile';
import PlayerInfo from './PlayerInfo';
import Spells from './Spells'

function InGame(props) {
  const [gameInfo] = useState({
    game_name: props.game_name,
  });

  const [phaseCount, setPhaseCount] = useState(props.phase);
  const [profile, setProfile] = useState(false);
  const [spellName, setSpellName] = useState('')

  function setPhase(value) {
    setPhaseCount(value);
  }
  
  function setSpell(value) {
    setSpellName(value)
  }
  
    return (
    <div>
        {phaseCount === 1 &&
            <div>
                <Card
                  border="dark"
                  bg="light"
                  style={{ width: "50rem" }}
                  id="card-profile"
                >
                <Card.Body>
                    <Nomination setPhase={setPhase} game_name={gameInfo.game_name}/>
                </Card.Body>
                </Card>
            </div>
        }
        {phaseCount === 2 &&
            <div>
               <Card
                  border="dark"
                  bg="light"
                  style={{ width: "50rem" }}
                  id="card-profile"
                >
               <Card.Body>
                   <Voting setPhase={setPhase} game_name={gameInfo.game_name} />
               </Card.Body>
               </Card>
            </div>
        }
        {phaseCount === 3 &&
            <div>
              <Card
                  border="dark"
                  bg="light"
                  style={{ width: "50rem" }}
                  id="card-profile"
                >
              <Card.Body>
                  <Proclamation setSpell={setSpell} setPhase={setPhase} game_name={gameInfo.game_name} />
              </Card.Body>
              </Card>
            </div>
        }
        {phaseCount === 4 ? 
            <div>
              { !profile ? (
                <div>
                 <Card
                     border="dark"
                     bg="light"
                      style={{ width: "50rem" }}
                     id="card-profile"
                 >
                  <Card.Body>

                  <h3> Game ended. </h3>
                  <div>
                      <Button id="btn-form" style={{"margin-top":"25px"}} onClick={() => setProfile(true)}> Go to profile </Button>
                  </div>
                </Card.Body>
                 </Card>
                </div>
              ) : <Profile />}
            </div>
            : <PlayerInfo game_name={gameInfo.game_name}/>}
        {phaseCount === 5 &&
           <div>
             <Card
                 border="dark"
                 bg="light"
                  style={{ width: "50rem" }}
                 id="card-profile"
             >
              <Card.Body>
                <Spells
                  spellName={spellName}
                  setPhase={setPhase}
                  game_name={gameInfo.game_name}
                /> 
              </Card.Body>
             </Card>
           </div>
         }
</div>
    );
}

export default InGame;
