import React, { Component } from 'react';
import { log } from '../index';
import { Link, Redirect } from "react-router-dom";
import './Home.css'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.logout = this.logout.bind(this);
    }

    logout() {
        log.signout();
        console.log("sign out should be false" + log.loggedIn);
    }

    auth_logout() {
        this.props.auth.logout();
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        console.log(isAuthenticated());
        return (
            <div className="home">
                <h1>Landing Page</h1>
                <input type="submit" className="loginButton" value="Auth_Logout" onClick={this.auth_logout.bind(this)}></input>
                <br></br>
                <Link className="signoutLink" to="/" onClick={this.logout}>Sign out</Link>
            </div>
        );
    }
}

export default Home;