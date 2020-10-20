import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css'
import SignUp from './_components/auth/SignUp'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
        <Switch>
            <Route path='/signup' component={SignUp}/>
            <Route path='/login' component={LogIn}/>
        </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
