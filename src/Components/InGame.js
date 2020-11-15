import React, { useState } from 'react';
import { Card  } from 'react-bootstrap';
import Nomination from './Nomination';
import Voting from './Voting';
import Proclamation from './Proclamation';
import Profile from './Auth/Profile';
import PlayerInfo from './PlayerInfo';

function InGame(props) {
  const [gameInfo] = useState({
    game_name: props.game_name,
  });

  const [phaseCount, setPhaseCount] = useState(1);
  const [profile, setProfile] = useState(false);

  function setPhase(value) {
    setPhaseCount(value);
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
                  <Proclamation setPhase={setPhase} game_name={gameInfo.game_name} />
              </Card.Body>
              </Card>
            </div>
        }
        {phaseCount === 4 ? 
            <div>
              { !profile ? (
                <div>
                  <h3> Game ended. </h3>
                  <div>
                    <button onClick={() => setProfile(true)}> Go to profile </button>
                  </div>
                </div>
              ) : <Profile />}
            </div>
            : <PlayerInfo game_name={gameInfo.game_name}/>}
    </div>
    );
}

export default InGame;
