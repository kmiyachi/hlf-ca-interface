import React, { Component } from 'react';
import $ from 'jquery';
import './LoginForm.css'
import { log } from '../index';
import { Link, Redirect } from "react-router-dom";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.username = "";
    this.password = "";
    this.login_error = false;
    this.missing_info = false;
    this.state = {
      login_success: "",
    };

    this.onChange = this.onChange.bind(this);
    this.handleUserLoginChange = this.handleUserLoginChange.bind(this);
    this.handlePasswordLoginChange = this.handlePasswordLoginChange.bind(this);
    this.callLogin = this.callLogin.bind(this);
    this.redirectAfterLogin = this.redirectAfterLogin.bind(this);
  }
  
  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  componentDidMount() {
    const { renewSession } = this.props.auth;

    if (localStorage.getItem('loggedIn') === 'true') {
      renewSession();
    }
  }

  auth_login() {
    this.props.auth.login();
  }

  auth_logout() {
    this.props.auth.logout();
  }

  handleUserLoginChange = event => {
    event.preventDefault()
    this.username = event.target.value;
  }

  handlePasswordLoginChange = event => {
    event.preventDefault()
    this.password = event.target.value;
  }

  callLogin() {
    if (this.password && this.username) {
      this.missing_info = false;
      $.ajax({
        url: 'http://localhost:4000/login',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        crossDomain: true,
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: {
          username: this.username,
          password: this.password
        },
        success: (data) => {
          if (data.message === "OK") {
            console.log('success');
            log.authenticate();
            console.log("logging in... " + localStorage.getItem('loggedIn'));
            this.login_error = false;
            this.setState({ login_success: true });
          } else {
            this.login_error = true;
            this.setState({ login_success: false });
            console.log('failure');
          }
        }
      });
    } else {
      this.missing_info = true;
      this.setState({ login_success: false });
    }
  }

  redirectAfterLogin = () => {
    if (this.state.login_success) {
      console.log("redirect: " + localStorage.getItem('loggedIn') + " " + this.state.login_success);
      return (
        <Redirect to='/Home' />
      );
    }
  }

  render() {
    console.log("rendering")
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="interface">
        {this.redirectAfterLogin()}
        <div className="loginForm">
          <input type="text" className="loginFormField" placeholder="Username" onChange={this.handleUserLoginChange} />
          <br></br>
          <input type="password" className="loginFormField" placeholder="Password" onChange={this.handlePasswordLoginChange} />
          {this.login_error && !this.missing_info ?
            <div className="error_msg">Either your username or password is incorrect.</div>
            : null
          }
          {this.missing_info ?
            <div className="error_msg">Please complete empty fields.</div>
            : null
          }
          <div>
            <input type="submit" className="loginButton" value="Login" onClick={this.callLogin}></input>
            <br></br>
            {!isAuthenticated() && (<input type="submit" className="loginButton" value="Auth_Login" onClick={this.auth_login.bind(this)}></input>)}
            {isAuthenticated() && (<input type="submit" className="loginButton" value="Auth_Logout" onClick={this.auth_logout.bind(this)}></input>)}
          </div>
        </div>
        <div className="registerDiv">
          <Link className="regLink" to="/Register">Don't have an account? Sign Up</Link>
        </div>
      </div>
    );
  }
}

export default LoginForm;