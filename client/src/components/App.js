import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";

import Navbar from './Navbar';
import Root from './pages/Root';
import '../css/app.css';
import Login from './pages/Login';
import Signup from './pages/Signup';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Root} /> } />
          <Route exact path="/parent/login" render={(props) => <Login {...props} isParent={true} /> } />
          <Route exact path="/child/login" render={(props) => <Login {...props} isParent={false} /> } />
          <Route exact path="/parent/signup" component={Signup} /> } />
        </Switch>
      </div>
    );
  }
}

export default App;
