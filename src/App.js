import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css'

import LogIn from './Components/Auth/LogIn'
import Profile from './Components/Auth/Profile'
import SignUp from './Components/Auth/SignUp'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
        <Switch>
            <Route path='/login' component={LogIn}/>
            <Route path='/signup' component={SignUp}/>
            <Route path='/profile' component={Profile}/>
        </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
