import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import LoginForm from './Login/LoginForm';
import SignUpForm from './SignUp/SignUpForm';
import Home from './Home/Home'
import * as serviceWorker from './serviceWorker';
import Auth from './Auth/Auth.js';
import history from './history';

const auth = new Auth();

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

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
    console.log("loggedIn render: " + localStorage.getItem('loggedIn'));
    return (
      <BrowserRouter history={history}>
        <Switch>
          <Route path="/callback" render={(props) => { handleAuthentication(props); return <Home auth={auth}/>}} />
          <Route path="/Register" component={SignUpForm} />
          <Route path="/Home" render={() => (localStorage.getItem('loggedIn') ? <Home auth={auth} /> : <Redirect to="/" />)} />
          <Route path="/" render={(props) => <LoginForm auth={auth} {...props} />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();