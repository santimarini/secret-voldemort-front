import Axios from "axios";
import React, { useEffect, useState } from "react";
import {Button} from 'react-bootstrap'
import axios from 'axios'

import '../App.css';

function VotingResult(props) {

  return (
    <div>
      {
          props.win ? (
            <div>
              <h4>Minister elected: {props.postulated.minister}</h4>
              <h4>Director elected: {props.postulated.director}</h4>
              <Button id='btn-form' onClick={props.forward}>Go to next phase!</Button>
              </div>
          ) : (
            <div>
              <h5>There was no consensus, the election marker advances one place.</h5>
              <Button id='btn-form' onClick={props.backwards}>Start new round</Button>
            </div>
          )
      }
    </div>
  );
}

export default VotingResult;