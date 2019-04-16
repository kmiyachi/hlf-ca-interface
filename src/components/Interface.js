import React, { Component } from 'react';
import FabricCAClient from "fabric-ca-client";

class App extends Component {
  constructor(props){
      let fClient = new FabricCAClient();
      this.state = {};

      this.register = this.register.bind(this);
      this.revoke = this.revoke.bind(this);
      this.enroll = this.enroll.bind(this);
      this.reenroll = this.reenroll.bind(this);
  }

  register(){

  }

  revoke(){

  }

  enroll(){

  }

  reenroll(){

  }

  render() {
    return (
      <div>Hello</div>
    );
  }
}

export default App;