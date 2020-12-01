import React from 'react';
import { Button } from 'react-bootstrap';

import '../App.css';

function VotingResult(props) {
  return (
    <div>
      {props.win ? (
        <div>
          <h4>
            Minister elected:
            {props.postulated.minister}
          </h4>
          <h4>
            Director elected:
            {props.postulated.director}
          </h4>
          <Button id="btn-form" onClick={props.forward}>
            Go to next phase!
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default VotingResult;
