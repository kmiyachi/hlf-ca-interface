import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

export const log = {
    loggedIn : false,
    authenticate(){
      this.loggedIn = true;
      localStorage.setItem('loggedIn', this.loggedIn);
    },
    signout(){
      this.loggedIn = false;
      localStorage.setItem('loggedIn', this.loggedIn);
    }
  }

  export default class App extends React.Component{
    render() {
      console.log(localStorage.getItem('loggedIn'));
      return (
        <BrowserRouter>
          <Switch>
          <Route  path="/"  component={Login}/>
          <Route  path="/Register"  component = {SignUpForm}/>
          <Route  path="/LandingPage" render={() => ( localStorage.getItem('loggedIn') ? <LandingPage/> : <Redirect to="/"/>)}/>
          </Switch>
        </BrowserRouter>
      );
    }    
  }

ReactDOM.render(<App />, document.getElementById('root'));
