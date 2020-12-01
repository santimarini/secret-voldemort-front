import React, { useEffect, useState } from "react";
import { Card, Button, ListGroup, Row, Col } from "react-bootstrap";
import "../App.css";
import axios from "axios";

function GameList(props) {
  const [games, setGames] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const server_uri = "http://localhost:8000/show_games";

  const joinGame = async (gamename) => {
    await axios
      .get(`http://localhost:8000/game_is_started?game_name=${gamename}`)
      .then((response) => {
        if (response.data.status === "started") {
          setError("The game already started. Please refresh.");
        } else {
          props.history.push(`/game/${gamename}`);
        }
      });
  };

  useEffect(() => {
    async function getGames() {
      setError("");
      await axios
        .get(server_uri)
        .then((response) => {
          setGames(response.data.games_list);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getGames();
  }, [refresh]);

  return (
    <div>
      <Card
        border="dark"
        bg="light"
        style={{ width: "50rem" }}
        id="card-profile"
      >
        <Card.Body>
          <Button
            onClick={() => setRefresh(!refresh)}
            id="btn-form"
            style={{ float: "right", "font-size": "11px" }}
          >
            Refresh list
          </Button>
          <Card.Title id="title-login">
            <h3 id="title-form">Current Games</h3>
            {error ? <p id="error-msg">{error}</p> : null}
          </Card.Title>
          <Card.Text>
            <ListGroup as="ul">
              {games.map((game) => (
                <ListGroup.Item key={game.name} as="li">
                  <Row>
                    <Col xs={3}>
                      <b>Game Name:</b> {game.name}
                    </Col>
                    <Col xs={3}>
                      <b>Players:</b> {game.players}
                    </Col>
                    <Col xs={3}>
                      <b>Max. Players:</b> {game.max_players}
                    </Col>
                    <Col xs={3}>
                      <Button onClick={() => joinGame(game.name)} id="btn-form">
                        Join
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default GameList;
