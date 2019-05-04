#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

CHAINCODE_NAME=fabcar
CHAINCODE_VERSION=1.0
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
LANGUAGE=${1:-"node"}
CC_SRC_PATH=github.com/fabcar/go
if [ "$LANGUAGE" = "node" -o "$LANGUAGE" = "NODE" ]; then
    cd $DIR
    cd ../chaincode/node
    yarn
    yarn run clean
    yarn run build
	CC_SRC_PATH=/opt/gopath/src/github.com/fabcar/node
fi

# clean the keystore
rm -rf ./hfc-key-store

cd $DIR

# launch network; create channel and join peer to channel
cd ../basic-network
./start.sh

# Now launch the CLI container in order to install, instantiate chaincode
# and prime the ledger with our 10 cars
docker-compose -f ./docker-compose.yml up -d cli

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n "$CHAINCODE_NAME" -v "$CHAINCODE_VERSION" -p "$CC_SRC_PATH" -l "$LANGUAGE"
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n "$CHAINCODE_NAME" -l "$LANGUAGE" -v "$CHAINCODE_VERSION" -c '{"function":"init","Args":["'$CHAINCODE_VERSION'"]}' -P "OR ('Org1MSP.member','Org2MSP.member')" --collections-config $CC_SRC_PATH/collections_config.json

CONTAINER_NAME="dev-peer0.org1.example.com-${CHAINCODE_NAME}"

CID=$(docker ps -q -f status=running -f name=^/${CONTAINER_NAME})

while [ ! "${CID}" ]; do
    CID=$(docker ps -q -f status=running -f name=^/${CONTAINER_NAME})
    echo "$CONTAINER_NAME not found";
    sleep 3;
done;

sleep 3;

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n "$CHAINCODE_NAME" -c '{"function":"initLedger","Args":[""]}'

printf "\nTotal setup execution time : $(($(date +%s) - starttime)) secs ...\n\n\n"