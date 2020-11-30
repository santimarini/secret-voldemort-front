import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import axios from "axios";

import { getEmail } from "../Util/HelperFunctions";
import "../App.css";

function Board(props) {
  const [players, setPlayers] = useState([]);
  const [minister, setMinister] = useState({email: ""});
  const [info, setInfo] = useState({});
  const [thereIsChaos, setThereIsChaos] = useState(false);
  let intervalPlayers;
  let intervalInfo;

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


  async function getElected() {
    await axios
      .get(`http://localhost:8000/postulated?game_name=${props.game_name}`)
      .then((response) => {
          minister.email = response.data.post_minister.user1;
      })
      .catch((error) => {
        alert(error);
      });
  }

  async function getInfo() {
    getElected();

    await axios
      .get(`http://localhost:8000/game_state?game_name=${props.game_name}`)
      .then(async (response) => {
        setInfo(response.data);
        if (response.data.election_marker === 3) {
            clearInterval(intervalInfo);
            setThereIsChaos(true);
            console.log("minister is: " + minister.email)
            setTimeout(async () => {
                if(minister.email === getEmail()) {
                    await axios
                        .get(`http://localhost:8000/chaos?game_name=${props.game_name}`)
                }
                console.log("pasaron 6 seg")
                triggerPollingInfo();
            }, 5000);
        } else {
            setThereIsChaos(false);
        }
      })
      .catch((error) => {
        alert(error);
      });
  }

  useEffect(() => {
    triggerPollingPlayers();
    triggerPollingInfo();
  }, []);

  const triggerPollingPlayers = () => {
    intervalPlayers = setInterval(() => {
      getPlayers();
    }, 5000);
  };

  const triggerPollingInfo = () => {
    intervalInfo = setInterval(() => {
      getInfo();
    }, 5000);
  };

  return (
    <div>
      <Card
        border="dark"
        bg="light"
        style={{ width: "50rem" }}
        id="card-profile"
      >
        <Card.Body>
          <Row>
            <Col>
              <h5 style={{ color: "#cf2121" }}>
                Fenix Order: {info.num_fenix_orders} Proclamations
              </h5>
            </Col>
            <Col>
              <h5 style={{ color: "#1523a3" }}>
                Death Eaters: {info.num_death_eaters} Proclamations
              </h5>
            </Col>
          </Row>
          <Row style={{ "margin-top": "10px" }}>
        	{thereIsChaos &&
              <Col xs={12}>
	            <h4 style={{ color: "#cf2121" }}> There is chaos! </h4>
              </Col>
	        }
            <Col xs={12}>
              <h5 id="title-form"> Elect Marker: {info.election_marker}</h5>
            </Col>
            <Col xs={12}>
              <h5 id="title-form">
                Remaining cards in deck: {info.num_proclamations_avilables}
              </h5>
            </Col>
            <Col xs={12}>
              <h5 id="title-form">
                Cards discarted: {info.num_proclamations_discarted}
              </h5>
            </Col>
          </Row>
          <Row style={{ "margin-top": "10px" }}>
            <Col>
              <h4>Alive players</h4>
              {players.map((player) => {
                if (player.is_alive) {
                  return <h5>{player.alias}</h5>;
                }
              })}
            </Col>
            <Col>
              <h4>Dead players</h4>
              {players.map((player) => {
                if (!player.is_alive) {
                  return <h5>{player.alias}</h5>;
                }
              })}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Board;
