import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import LoginForm from './Login/LoginForm';
import SignUpForm from './SignUp/SignUpForm';
import Home from './Home/Home'
import * as serviceWorker from './serviceWorker';

export const log = {
  loggedIn: false,
  authenticate() {
    this.loggedIn = true;
    localStorage.setItem('loggedIn', this.loggedIn);
  },
  signout() {
    this.loggedIn = false;
    localStorage.setItem('loggedIn', this.loggedIn);
  }
}

export default class App extends React.Component {
  render() {
    console.log("loggedIn render: " + log.loggedIn);
    return (
      <BrowserRouter>
        <Switch>
          <Route  path="/Register" component={SignUpForm} />
          <Route  path="/Home" render={() => (log.loggedIn ? <Home /> : <Redirect to="/" />)} />
          <Route  path="/" component={LoginForm} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();