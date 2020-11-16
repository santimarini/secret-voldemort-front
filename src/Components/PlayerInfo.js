import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import { getToken } from '../Util/HelperFunctions';

function PlayerInfo(props) {
  const [loyaltyImg, setLoyaltyImg] = useState('');
  const [jwtHeader] = useState({ Authorization: `Bearer ${getToken()}` });
  const [playerInfo, setPlayerInfo] = useState({});

  useEffect(() => {
    async function getPlayerInfo() {
      try {
          let response = await axios.get(`http://localhost:8000/get_player?game_name=${props.game_name}`, {headers: jwtHeader});
          setPlayerInfo(response.data.player);
          if(response.data.player.loyalty == "Death Eaters"){
              setLoyaltyImg("https://res.cloudinary.com/dsmdvuj2y/image/upload/ar_1:1,b_rgb:262c35,bo_5px_solid_rgb:ff0000,c_fill,g_auto,h_639,r_max,w_514/v1605313945/death-eater_nb2g73.jpg");
          }
          else if (response.data.player.loyalty === "Fenix Order") {
              setLoyaltyImg("https://res.cloudinary.com/dsmdvuj2y/image/upload/ar_1:1,b_rgb:262c35,bo_5px_solid_rgb:ff0000,c_fill,g_auto,h_639,r_max,w_514/v1605313952/phoenix-order.jpg");
          }
      }
      catch (err) {
        alert(err);
      }
    }
    getPlayerInfo();
  }, []);


  return (
    <div>
    {playerInfo && (
        <Card style={{ "width": "18rem","position":"absolute","bottom": "0", "right":"0"}}>
        <Card.Img variant="top" src={loyaltyImg}  />
        <Card.Body>
          <Card.Title >Role: { playerInfo.rol }</Card.Title>
          <Card.Title >Loyalty: { playerInfo.loyalty }</Card.Title>
        </Card.Body>
      </Card>
    )};
    </div>
  );
}

export default PlayerInfo;
