## Hyperledger Fabric Certificate Authority Interface

This repository is a basic Login and Registration Framework for a Hyperledger Fabric Network built using the Hyperledger Node SDK. 


#### Setup

1. Backend Server
```
npm install
cd backend
npm install
cd src
node express.js
```
2. Frontend Web Browser
Open up a new terminal
```
cd frontend
npm install
cd src
npm start
```


##### Peristant Storage 
Hyperledger Fabric CA uses local storage as its default storage mechanism. Wallets for users of the system are stored in backend/src/wallet. 

##### Network Settings 

Network settings can be found in the backend/network directory of the hlf-ca-interface repository. 
Connections.json has all the default network information of the Hyperledger Fabric network that is launched. 

