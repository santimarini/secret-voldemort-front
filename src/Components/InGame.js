import React, { useState } from "react";

import Nomination from "./Nomination";
import Voting from "./Voting";
import Proclamation from "./Proclamation";

function InGame(props) {
  const [gameInfo, setGameInfo] = useState({
    game_name: props.game_name,
  });

  const [phaseCount, setPhaseCount] = useState(1);

  function handleCount(value) {
    setPhaseCount(value);
  }

  switch (phaseCount) {
    case 1:
      return (
        <div class className="nomination">
          <Nomination
            handleCount={handleCount}
            game_name={gameInfo.game_name}
          />
        </div>
      );
    case 2:
      return (
        <div>
          <Voting handleCount={handleCount} game_name={gameInfo.game_name} />
        </div>
      );
    case 3:
      return (
        <div>
          <Proclamation game_name={gameInfo.game_name}/>
        </div>
      );
    default:
      return <div>hola</div>;
  }
}

export default InGame;
