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

    logout(){
        log.signout();
        console.log("sign out should be false"+log.loggedIn);
    }

    render() {
        console.log(log.loggedIn);
        return (
            <div className="home">
                <h1>Landing Page</h1>
                {/* <h2>Welcome, {}</h2> */}
                <Link className="signoutLink" to="/" onClick={this.logout}>Sign out</Link>
            </div>
        );
    }
}

export default Home;