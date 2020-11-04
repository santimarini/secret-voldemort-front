import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css'

import AuthRoute from './ProtectedRoutes/AuthRoute'
import NoLogged from './ProtectedRoutes/NoLogged'

import LogIn from './Components/Auth/LogIn'
import Profile from './Components/Auth/Profile'
import SignUp from './Components/Auth/SignUp'
import Game from './Components/Game'
import GameLobby from './Components/GameLobby'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
        <Switch>
            <AuthRoute exact path='/login' component={LogIn}/>
            <AuthRoute exact path='/signup' component={SignUp}/>
            <NoLogged path='/profile' component={Profile}/>
            <NoLogged path='/play' component={Game}/>
            <NoLogged path='/game/:gamename' component={GameLobby}/>
        </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
