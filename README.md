# Agri-sync
Agri Sync is an advanced platform aimed at enhancing the agricultural value chain, connecting farmers, seed sellers, and other stakeholders. By integrating cutting-edge technologies, the platform improves transparency, facilitates secure transactions, and supports sustainable agricultural practices.

## Status
[![Price Prediction Service - Test](https://github.com/GIHAA/agri-sync/actions/workflows/price-prediction-service.yml/badge.svg)](https://github.com/GIHAA/agri-sync/actions/workflows/price-prediction-service.yml)
<br>
[![Reward Service - Test](https://github.com/GIHAA/agri-sync/actions/workflows/reward-service.yml/badge.svg)](https://github.com/GIHAA/agri-sync/actions/workflows/reward-service.yml)
<br>
[![User Service - Test and Deploy](https://github.com/GIHAA/agri-sync/actions/workflows/user-service.yml/badge.svg)](https://github.com/GIHAA/agri-sync/actions/workflows/user-service.yml)
<br>
[![Gateway Service - Build and Deploy](https://github.com/GIHAA/agri-sync/actions/workflows/gateway-service.yml/badge.svg)](https://github.com/GIHAA/agri-sync/actions/workflows/gateway-service.yml)
<br>
[![Chatbot Service - Test and Deploy](https://github.com/GIHAA/agri-sync/actions/workflows/chatbot-service.yml/badge.svg)](https://github.com/GIHAA/agri-sync/actions/workflows/chatbot-service.yml)
<br>
[![Hyperledger Service - Test and Deploy](https://github.com/GIHAA/agri-sync/actions/workflows/hyperledger-service.yml/badge.svg)](https://github.com/GIHAA/agri-sync/actions/workflows/hyperledger-service.yml)

## Architectural Diagram
![Frame 1](https://github.com/user-attachments/assets/44bd9744-ac31-4f6b-b80d-004f7f0b3a18)

## Componentss of the system
- Rewards system with price prediction
- Adaptive User Interfaces
- AI chatbot and data visualization
- Blockchain integration for vegetable seed transactions
- Python flask server usage
- RAG based chatbot
- Neural network-based model
- Microservice Architecture
  



Here’s a complete and detailed step-by-step guide to deploying Hyperledger Fabric network and working with the project. This guide consolidates all the commands, configurations, and troubleshooting steps mentioned while ensuring clarity and completeness.

---

### **1. Prerequisites**
Ensure the following tools are installed:
- Docker and Docker Compose
- Node.js (use `nvm` to manage Node versions if needed)
- Fabric binaries and samples
- dos2unix (to fix line-ending issues)

#### **Install `dos2unix`**
```bash
sudo apt-get install dos2unix
```

---

### **2. Setting Up the Fabric Network**

#### **Step 1: Navigate to the test-network Directory**
```bash
cd /mnt/d/Repository/Research_project_v1/fabric-samples/test-network
```

#### **Step 2: Clean Up Previous Network**
```bash
./network.sh down
```

#### **Step 3: Resolve Line Ending Issues**
Convert script files to Unix-style line endings:
```bash
dos2unix ./scripts/*.sh
```

#### **Step 4: Start the Network and Create a Channel**
```bash
./network.sh up createChannel -c seedtransectionchannel -ca
```

#### **Step 5: Deploy the Chaincode**
```bash
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl typescript
```

---

### **3. Packaging and Installing the Chaincode**

#### **Step 1: Set Environment Variables**
```bash
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
```

#### **Step 2: Package the Chaincode**
```bash
peer lifecycle chaincode package basic.tar.gz --path ../asset-transfer-basic/chaincode-typescript/ --lang node --label basic_1.0
```

#### **Step 3: Install the Chaincode**
Set peer-specific environment variables for **Org1**:
```bash
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

Repeat for **Org2**:
```bash
export CORE_PEER_LOCALMSPID=Org2MSP
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
```

---

### **4. Verifying and Invoking the Chaincode**

#### **Step 1: Query Installed Chaincodes**
```bash
peer lifecycle chaincode queryinstalled
```

#### **Step 2: Invoke Chaincode**
```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C seedtransectionchannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
```

#### **Step 3: Query the Chaincode**
Get all seeds:
```bash
peer chaincode query -C seedtransectionchannel -n basic -c '{"Args":["GetAllSeeds"]}'
```

Get seed history:
```bash
peer chaincode query -C seedtransectionchannel -n basic -c '{"Args":["GetSeedHistory","farmer2","Corn"]}'
```

---

### **5. Running the REST API**

#### **Step 1: Navigate to the API Directory**
```bash
cd /mnt/d/Repository/Research_project_v1/fabric-samples/asset-transfer-basic/rest-api-typescript
```

#### **Step 2: Set Node.js Version**
```bash
nvm use v22.11.0
```

#### **Step 3: Install Dependencies**
```bash
npm install
```

#### **Step 4: Build the API**
```bash
npm run build
```

#### **Step 5: Fix Linting Issues**
```bash
npx eslint src/ --fix
npx prettier --write src/
```

#### **Step 6: Generate Environment Variables**
```bash
npm run generateEnv
```

---

### **6. Running Redis**

#### **Step 1: Set Redis Password**
```bash
export REDIS_PASSWORD=$(uuidgen)
```

#### **Step 2: Start Redis**
```bash
docker run -p 6379:6379 --name fabric-sample-redis -d redis --maxmemory-policy noeviction --requirepass "${REDIS_PASSWORD}"
```

#### **Step 3: Restart Redis (if needed)**
```bash
docker stop fabric-sample-redis
docker rm fabric-sample-redis
npm run start:redis
```

---

### **7. Start the API in Development Mode**
```bash
npm run start:dev
```

---

### **8. Troubleshooting**

#### **Fix `successln: command not found`**
Convert scripts:
```bash
dos2unix ./scripts/createChannel.sh
```

#### **Fix Permission Issues**
```bash
chmod +x ./ccp-generate.sh
sed -i 's/\r$//' ./ccp-generate.sh
```

Run the script:
```bash
./ccp-generate.sh
```

---
