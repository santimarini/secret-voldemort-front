import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";
import { Card } from "react-bootstrap";

function EmailConfirmed(props) {
  const [error, setError] = useState("");

  useEffect(() => {
    async function sendConfirmation() {
      try {
        await axios.get(
          `http://localhost:8000/validate/${props.match.params.token}`
        );
      } catch (error) {
        setError(error.response.data.detail);
      }
    }
    sendConfirmation();
  }, []);

  return (
    <div>
      <Card
        border="dark"
        bg="light"
        style={{ width: "50rem" }}
        id="card-profile"
      >
        <Card.Body>
          {error ? (
            <h4 id="title-form">{error}</h4>
          ) : (
            <div>
              <h4 id="title-form">
                Email confirmed! Welcome to secret voldemort.
              </h4>
              <h4 id="title-form">Now you can create or join to games.</h4>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default EmailConfirmed;
