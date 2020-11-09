import React, { useState } from 'react';

import Nomination from './Nomination';
import Voting from './Voting';
import Proclamation from './Proclamation';
import Profile from './Auth/Profile';

function InGame(props) {
  const [gameInfo] = useState({
    game_name: props.game_name,
  });

  const [phaseCount, setPhaseCount] = useState(1);
  const [profile, setProfile] = useState(false);

  function setPhase(value) {
    setPhaseCount(value);
  }

  switch (phaseCount) {
    case 1:
      return (
        <div className className="nomination">
          <Nomination
            setPhase={setPhase}
            game_name={gameInfo.game_name}
          />
        </div>
      );
    case 2:
      return (
        <div>
          <Voting setPhase={setPhase} game_name={gameInfo.game_name} />
        </div>
      );
    case 3:
      return (
        <div>
          <Proclamation setPhase={setPhase} game_name={gameInfo.game_name} />
        </div>
      );
    case 4:
      return (
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
      );
    default:
      return <div>Something went wrong.</div>;
  }
}

export default InGame;
