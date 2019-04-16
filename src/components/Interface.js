import React, { Component } from 'react';
import FabricCAClient from "fabric-ca-client";

class App extends Component {
  constructor(props){
    super(props);
      let fabric_ca_client = new FabricCAClient();
      this.state = {
        f_ca_client: fabric_ca_client,
        admin_user: ""
      };

      this.register = this.register.bind(this);
      this.revoke = this.revoke.bind(this);
      this.enroll = this.enroll.bind(this);
      this.reenroll = this.reenroll.bind(this);
  }

  register(user, secret, org, r){
    f_ca_client.register({enrollmentID: user, enrollmentSecret: secret, affiliation: org, role: r}, admin_user);
  }

  revoke(user, key, hex, text){
    f_ca_client.revoke({enrollmentID: user, aki: key, serial: hex, reason: text});
  }

  enroll(user, secret, signing){
    f_ca_client.enroll({enrollmentID: user, enrollmentSecret: secret, csr: signing});
  }

  reenroll(signing){
    f_ca_client.reenroll({csr: signing});
  }

  render() {
    return (
      <div>Hello</div>
    );
  }
}

export default Interface;