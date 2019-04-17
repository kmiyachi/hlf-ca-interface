import React, { Component } from 'react';
import Fabric_CA_Client from 'fabric-ca-client';
import { FileSystemWallet, Gateway, X509WalletMixin } from 'fabric-network';
import fs from 'fs';
import path from 'path';

class Interface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ccpPath: path.resolve(__dirname, '..', '..', 'network', 'connection.json'),
      ccpJSON: fs.readFileSync(ccpPath, 'utf8'),
      ccp: JSON.parse(ccpJSON)
    };

    this.register = this.register.bind(this);
    this.revoke = this.revoke.bind(this);
    this.enroll = this.enroll.bind(this);
    this.reenroll = this.reenroll.bind(this);
    this.enrollAdmin = this.enrollAdmin.bind(this);
    this.regUser = this.regUser.bind(this);
  }

  async enrollAdmin() {
    try {

      // Create a new CA client for interacting with the CA.
      const caURL = this.state.ccp.certificateAuthorities['ca.example.com'].url;
      const ca = new Fabric_CA_Client(caURL);

      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = new FileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the admin user.
      const adminExists = await wallet.exists('admin');
      if (adminExists) {
        console.log('An identity for the admin user "admin" already exists in the wallet');
        return;
      }

      // Enroll the admin user, and import the new identity into the wallet.
      const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
      const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
      wallet.import('admin', identity);
      console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
      console.error(`Failed to enroll admin user "admin": ${error}`);
      process.exit(1);
    }
  }

  async regUser(username) {
    try {

      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = new FileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const userExists = await wallet.exists(username);
      if (userExists) {
        console.log('An identity for the user "' + username + '" already exists in the wallet');
        return;
      }

      // Check to see if we've already enrolled the admin user.
      const adminExists = await wallet.exists('admin');
      if (!adminExists) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        console.log('Run the enrollAdmin.js application before retrying');
        return;
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(this.state.ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

      // Get the CA client object from the gateway for interacting with the CA.
      const ca = gateway.getClient().getCertificateAuthority();
      const adminIdentity = gateway.getCurrentIdentity();

      // Register the user, enroll the user, and import the new identity into the wallet.
      const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client' }, adminIdentity);
      const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
      const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
      wallet.import(username, userIdentity);
      console.log('Successfully registered and enrolled admin user "' + username + '" and imported it into the wallet');

    } catch (error) {
      console.error(`Failed to register user "user1": ${error}`);
      process.exit(1);
    }
  }

  register(user, secret, org, r) {
    //f_ca_client.register({ enrollmentID: user, enrollmentSecret: secret, affiliation: org, role: r }, admin_user);
  }

  revoke(user, key, hex, text) {
    //f_ca_client.revoke({ enrollmentID: user, aki: key, serial: hex, reason: text });
  }

  enroll(user, secret, signing) {
    //f_ca_client.enroll({ enrollmentID: user, enrollmentSecret: secret, csr: signing });
  }

  reenroll(signing) {
    //f_ca_client.reenroll({ csr: signing });
  }

  render() {
    return (
      <div>Hello</div>
    );
  }
}

export default Interface;