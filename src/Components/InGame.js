import React, { useState } from 'react';

import Nomination from './Nomination';
import Voting from './Voting';
import Proclamation from './Proclamation';
import Profile from './Auth/Profile';
import Spells from './Spells'

function InGame(props) {
  const [gameInfo] = useState({
    game_name: props.game_name,
  });

  const [phaseCount, setPhaseCount] = useState(1);
  const [profile, setProfile] = useState(false);
  const [spellName, setSpellName] = useState('')

  function setPhase(value) {
    setPhaseCount(value);
  }

  function setSpell(value) {
    setSpellName(value)
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
          <Proclamation
            setSpell={setSpell}
            setPhase={setPhase}
            game_name={gameInfo.game_name}
          />
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
    case 5:
      return (
        <div>
          <Spells
            spellName={spellName}
            setPhase={setPhase}
            game_name={gameInfo.game_name}
          />
        </div>
      );
    default:
      return <div>Something went wrong.</div>;
  }
}

export default InGame;
