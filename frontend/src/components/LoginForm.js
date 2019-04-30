import React, { Component } from 'react';
import $ from 'jquery';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_username: "",
      login_password: "",
      regis_username: "",
      regis_password: "",
      admin_id: "",
      admin_pw: "",
      login_success: "",
      regis_success: "",
      enroll_success: ""
    };

    this.onChange = this.onChange.bind(this);
    this.handleUserLoginChange = this.handleUserLoginChange.bind(this);
    this.handleUserRegisChange = this.handleUserRegisChange.bind(this);
    this.handlePasswordLoginChange = this.handlePasswordLoginChange.bind(this);
    this.handlePasswordRegisChange = this.handlePasswordRegisChange.bind(this);
    this.handleAdminIdChange = this.handleAdminIdChange.bind(this);
    this.handleAdminPwChange = this.handleAdminPwChange.bind(this);
    this.callLogin = this.callLogin.bind(this);
    this.callEnrollAdmin = this.callEnrollAdmin.bind(this);
    this.callRegister = this.callRegister.bind(this);

  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleUserLoginChange = event => {
    event.preventDefault()
    this.setState({ login_username: event.target.value });
  }

  handlePasswordLoginChange = event => {
    event.preventDefault()
    this.setState({ login_password: event.target.value });
  }

  handleUserRegisChange = event => {
    event.preventDefault()
    this.setState({ regis_username: event.target.value });
  }

  handlePasswordRegisChange = event => {
    event.preventDefault()
    this.setState({ regis_password: event.target.value });
  }

  handleAdminIdChange = event => {
    event.preventDefault()
    this.setState({ admin_id: event.target.value });
  }

  handleAdminPwChange = event => {
    event.preventDefault()
    this.setState({ admin_pw: event.target.value });
  }

  callLogin() {
    if (this.state.login_password && this.state.login_username) {
      const loginData = {
        username: this.state.login_username,
        password: this.state.login_password
      }
      $.ajax({
        url: 'http://localhost:4000/login',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        crossDomain: true,
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: {
          username: this.state.login_username,
          password: this.state.login_password
        },
        success: (data) => {
          if (data.message === "OK") {
            this.setState({ login_success: true });
            console.log('success');
          } else {
            this.setState({ login_success: false });
            console.log('failure');
          }
        }
      });
    } else {
      alert("Please fill in login form fields.")
    }
  }

  callRegister() {
    if (this.state.regis_password && this.state.regis_username) {
      const regisData = {
        username: this.state.regis_username,
        password: this.state.regis_password
      }
      $.ajax({
        url: 'http://localhost:4000/register',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        crossDomain: true,
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: {
          username: this.state.regis_username,
          password: this.state.regis_password
        },
        success: (data) => {
          if (data.message === "OK") {
            this.setState({ regis_success: true });
            console.log('success');
          } else {
            this.setState({ regis_success: false });
            console.log('failure');
          }
        }
      });
    } else {
      alert("Please fill in register form fields.")
    }
  }

  callEnrollAdmin() {
    if (this.state.admin_id && this.state.admin_pw) {
      const adminData = {
        id: this.state.admin_id,
        pw: this.state.admin_pw
      }
      console.log(JSON.stringify(adminData))
      $.ajax({
        url: 'http://localhost:4000/enroll',
        context: document.body,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        crossDomain: true,
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: {
          id: this.state.admin_id,
          pw: this.state.admin_pw
        },
        success: (data) => {
          if (data.message === "OK") {
            this.setState({ enroll_success: true });
            console.log('success');
          } else {
            this.setState({ enroll_success: false });
            console.log('failure');
          }
        }
      });
    }
    else {
      alert("Please fill in admin form fields.")
    }
  }

  render() {
    return (
      <div className="interface">
        <div className="loginForm">
          <input type="text" className="loginFormField" placeholder="Username" onChange={this.handleUserLoginChange} />
          <input type="password" className="loginFormField" placeholder="Password" onChange={this.handlePasswordLoginChange} />
          <input type="submit" value="Login" onClick={this.callLogin}></input>
        </div>
        <div className="registerUserForm">
          <input type="text" className="regFormField" placeholder="Username" onChange={this.handleUserRegisChange} />
          <input type="password" className="regFormField" placeholder="Password" onChange={this.handlePasswordRegisChange} />
          <input type="submit" value="Register" onClick={this.callRegister}></input>
        </div>
        <div className="enrollAdminForm">
          <input type="text" className="adFormField" placeholder="Admin ID" onChange={this.handleAdminIdChange} />
          <input type="password" className="adFormField" placeholder="Admin Password" onChange={this.handleAdminPwChange} />
          <input type="submit" value="Enroll" onClick={this.callEnrollAdmin}></input>
        </div>
      </div>
    );
  }
}

export default LoginForm;