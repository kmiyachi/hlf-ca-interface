import React, { Component } from 'react';
import { log } from '../index';
import { Link, Redirect } from "react-router-dom";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.logout = this.logout.bind(this);
    }

    logout(){
        log.signout();
    }

    render() {
        console.log(log.loggedIn);
        return (
            <div>
                <h1>Landing Page</h1>
                <Link className="signoutLink" to="/" onClick={this.logout}>Sign out</Link>
            </div>
        );
    }
}

export default Home;