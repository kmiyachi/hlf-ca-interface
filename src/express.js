
const express = require('express')
const app = express()
const port = 3000

let Fabric_CA_Client = require('fabric-ca-client');

let path = require('path');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
let store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:'+store_path);
const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const caURL = ccp.certificateAuthorities['ca.example.com'].url;
const ca = new Fabric_CA_Client(caURL);
// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);
const gateway = new Gateway();
const server = require('./server.js')




app.use('/', server);


app.listen(port, () => console.log(`Example app listening on port ${port}!`))