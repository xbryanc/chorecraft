import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";

import Navbar from './Navbar';
import Root from './pages/Root';
import '../css/app.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Quests from './pages/Quests';
import Profile from './pages/Profile';
import Market from './pages/Market';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      userInfo: {},
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Root} /> } />
          <Route exact path="/parent/login" render={(props) => <Login {...props} isParent={true} /> } />
          <Route exact path="/child/login" render={(props) => <Login {...props} isParent={false} /> } />
          <Route exact path="/parent/signup" component={Signup} /> } />
          <Route exact path="/quests" render={(props) => <Quests {...props} userInfo={this.state.userInfo} updateUserInfo={this.getUserInfo} /> } />
          <Route exact path="/market" render={(props) => <Market {...props} userInfo={this.state.userInfo} updateUserInfo={this.getUserInfo} /> } />
          <Route exact path="/profile" render={(props) => <Profile {...props} userInfo={this.state.userInfo} updateUserInfo={this.getUserInfo} /> } />
        </Switch>
      </div>
    );
  }

  getUserInfo = () => {
    fetch('/api/whoami')
    .then(res => res.json())
    .then(res => {
      this.setState({
        userInfo: res,
      });
    })
  }

}

export default App;
