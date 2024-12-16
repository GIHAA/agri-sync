

import * as grpc from '@grpc/grpc-js';
import { connect, Contract, hash, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';

const channelName = envOrDefault('CHANNEL_NAME', 'seedtransectionchannel');
const chaincodeName = envOrDefault('CHAINCODE_NAME', 'basic');
const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto materials.
const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve(__dirname, '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));

// Path to user private key directory.
const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

// Path to user certificate directory.
const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));

// Path to peer tls certificate.
const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Gateway peer SSL host name override.
const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

const utf8Decoder = new TextDecoder();
const SeedId = `Seed${String(Date.now())}`;

async function main(): Promise<void> {
    displayInputParameters();

    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        hash: hash.sha256,
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });

    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        const contract = network.getContract(chaincodeName);

        // Initialize a set of Seed data on the ledger using the chaincode 'InitLedger' function.
        await initLedger(contract);

        // Return all the current Seeds on the ledger.
        await getAllSeeds(contract);

        // Create a new Seed on the ledger.
        await createSeed(contract);

        // Update an existing Seed asynchronously.
        await transferSeedAsync(contract);

        // Get the Seed details by SeedID.
        await readSeedByID(contract);

        // Update an Seed which does not exist.
        // await updateNonExistentSeed(contract)
    } finally {
        gateway.close();
        client.close();
    }
}

main().catch((error: unknown) => {
    console.error('******** FAILED to run the application:', error);
    process.exitCode = 1;
});

async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(): Promise<Identity> {
    const certPath = await getFirstDirFileName(certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    const file = files[0];
    if (!file) {
        throw new Error(`No files in directory: ${dirPath}`);
    }
    return path.join(dirPath, file);
}

async function newSigner(): Promise<Signer> {
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
async function initLedger(contract: Contract): Promise<void> {
    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of Seeds on the ledger');

    await contract.submitTransaction('InitLedger');

    console.log('*** Transaction committed successfully');
}

/**
 * Evaluate a transaction to query ledger state.
 */
async function getAllSeeds(contract: Contract): Promise<void> {
    console.log('\n--> Evaluate Transaction: GetAllSeeds, function returns all the current Seeds on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAllSeeds');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 */
async function createSeed(contract: Contract): Promise<void> {
    console.log('\n--> Submit Transaction: CreateSeed, creates new Seed with SeedType, quantity, pricePerUnit, location');


    const SeedType = 'Wheat';
    const quantity = 100;
    const pricePerUnit = 15;
    const location = 'Farm7';

    await contract.submitTransaction(
        'CreateSeed',
        SeedId,
        SeedType,
        quantity.toString(),
        pricePerUnit.toString(),
        location
    );

    console.log('*** Transaction committed successfully');
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 */
async function transferSeedAsync(contract: Contract): Promise<void> {
    console.log('\n--> Async Submit Transaction: TransferSeed, updates existing Seed owner');

    const farmerId = 'farmer3';
    const newFarmerId = 'farmer4';
    const SeedType = 'Rice';

    const commit = await contract.submitAsync('TransferSeedOwner', {
        arguments: [farmerId, newFarmerId, SeedType],
    });

    const oldOwner = utf8Decoder.decode(commit.getResult());
    console.log(`*** Successfully submitted transaction to transfer ownership from ${oldOwner} to ${newFarmerId}`);
    console.log('*** Waiting for transaction commit');


    const status = await commit.getStatus();
    if (!status.successful) {
        throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${String(status.code)}`);
    }

    console.log('*** Transaction committed successfully');
}


async function readSeedByID(contract: Contract): Promise<void> {
    console.log('\n--> Evaluate Transaction: ReadSeed, function returns Seed attributes');

    const resultBytes = await contract.evaluateTransaction('ReadSeed', "farmer2", "Corn");

    const resultJson = utf8Decoder.decode(resultBytes);
    const result: unknown = JSON.parse(resultJson);
    console.log('*** Result:', result);
}


/**
 * submitTransaction() will throw an error containing details of any error responses from the smart contract.
 */
// async function updateNonExistentSeed(contract: Contract): Promise<void> {
//     console.log('\n--> Submit Transaction: UpdateSeed farmer2, Seed70 does not exist and should return an error');

//     try {
//         // Try updating a non-existent seed (this should throw an error)
//         await contract.submitTransaction(
//             'UpdateSeed',      // Smart contract function to call
//             'farmer2-Corn',          // Non-existent seed ID
//             'blue',            // Seed color
//             '5',               // Quantity
//             '300',          // Owner
//             'Tomoko'              // Price per unit
//         );
//         console.log('******** FAILED to return an error');
//     } catch (error) {
//         console.log('*** Successfully caught the error: \n', error);
//     }
// }

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
function displayInputParameters(): void {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certDirectoryPath: ${certDirectoryPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}
