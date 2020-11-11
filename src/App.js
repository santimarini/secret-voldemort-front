import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthRoute from './ProtectedRoutes/AuthRoute';
import NoLogged from './ProtectedRoutes/NoLogged';

import LogIn from './Components/Auth/LogIn';
import Profile from './Components/Auth/Profile';
import SignUp from './Components/Auth/SignUp';
import Game from './Components/Game';
import GameLobby from './Components/GameLobby';
import Navbar from './Components/Navbar';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="navbar">
          <Navbar />
        <div className="logo-image"><img src={require("./Images/rsz_logo.png")}/></div>
        </div>

        <div className="App">
          <AuthRoute exact path="/login" component={LogIn} />
          <AuthRoute exact path="/signup" component={SignUp} />
          <NoLogged path="/profile" component={Profile} />
          <NoLogged path="/play" component={Game} />
          <NoLogged path="/game/:gamename" component={GameLobby} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
