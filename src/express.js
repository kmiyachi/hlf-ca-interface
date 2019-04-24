
const express = require('express')
const app = express()
const port = 3000

let Fabric_CA_Client = require('fabric-ca-client');

let path = require('path');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
let store_path = path.join(__dirname, 'hfc-key-store');
console.log(' Store path:'+store_path);
const ccpPath = path.resolve(__dirname, '..', 'network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);
const caURL = ccp.certificateAuthorities['ca.example.com'].url;
const ca = new Fabric_CA_Client(caURL);
// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);
const gateway = new Gateway();
// const server = require('./server.js');

var enrollAdmin = async function () {
    // Initialize Wallet Path
    // Setup any other variable / directory structure that we need
    // Enroll the Admin User
    try {
        //const wallet = new FileSystemWallet(walletPath);
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
        return;

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

var register = async function (username, password) {
    try {

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
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: false } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();
        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, enrollmentSecret: password, role: 'client' }, adminIdentity);
        console.log(secret);
        const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: password });
        const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import(username, userIdentity);
        console.log('Successfully registered and enrolled admin user "' + username + '" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user ${username}: ${error}`);
        process.exit(1);
    }
}

var login = async function (username, password) {
    // Checks wallet to determine if a user is registered in the HF Network
    // Renders a new page if credentials check out
    console.log('Logging In...');
    try {
        const userExists = await wallet.exists(username);
        if (userExists) {
            console.log('Log in');
            let user_path = path.join('./wallet', username, 'nice.json');
            console.log(user_path);
            let json = require('./wallet/Danny/nice.json'); //(with path)
            console.log(json);
            if (password === json.enrollmentSecret) {
                console.log('Login Successful!');
            }
            else {
                console.log('Password is Incorrect');
            }
        }
        else {
            console.log('User does not exist');
        }
    }catch (error) {
        console.error(`Failed to login user ${username}: ${error}`);
        process.exit(1);
    }
}

app.use('/register', function(req, res){
    var username = req.params.username;
    var password = req.params.password;
    register(username, password);
});

app.use('/enroll', function(req, res){
    enrollAdmin();
});

app.use('/login', function(req, res){
    var username = req.params.username;
    var password = req.params.password;
    login(username, password);
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))