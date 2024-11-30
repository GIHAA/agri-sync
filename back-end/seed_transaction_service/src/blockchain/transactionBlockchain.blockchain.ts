
import { Pool, PoolClient } from 'pg'; 
import { Gateway, Wallets, Contract, Wallet } from 'fabric-network';  
import * as fs from 'fs'; 
import path from 'path'; 
import yaml from 'js-yaml'; 
import { logger } from '../utils/logger'; 
import { config } from "../config";
//import { addIdentityToWallet } from './addIdentityToWallet';

const pool = new Pool({
    connectionString: config.db.connectionString,
    ...(config.db.connectionString
        ? {}
        : {
            user: config.db.user,
            host: config.db.host,
            database: config.db.name,
            password: config.db.password,
            port: config.db.port,
            max: config.db.pool.max || 10,
            min: config.db.pool.min || 2,
            idleTimeoutMillis: config.db.pool.idle || 10000,
        }),
});
let contract: Contract | null = null;

interface SeedTransaction {
    farmerId: number;
    seedType: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    location: string;
}



async function getIdentityFromWallet(wallet: Wallet): Promise<string> {
    const identities = await wallet.list();
    console.log(identities);
    if (identities.length === 0) {
        throw new Error('No identities found in wallet.');
    }

    // Use environment variable for preferred identity, fallback to the first one
    const preferredIdentity = process.env.FABRIC_IDENTITY || identities[0];
    if (!identities.includes(preferredIdentity)) {
        throw new Error(`Preferred identity "${preferredIdentity}" not found in wallet.`);
    }

    return preferredIdentity;
}


export async function initializeBlockchain(): Promise<void> {
    try {

     //   await addIdentityToWallet();
        const ccpPath = path.resolve(__dirname, '../config/connection-profile.json');
        console.log('CCP Path:', ccpPath);
        let ccp;

        // Load the Fabric connection profile (either JSON or YAML format)
        if (ccpPath.endsWith('.json')) {
            ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        } else if (ccpPath.endsWith('.yaml') || ccpPath.endsWith('.yml')) {
            ccp = yaml.load(fs.readFileSync(ccpPath, 'utf8'));
        } else {
            throw new Error('Unsupported connection profile format. Use JSON or YAML.');
        }

        // Set up wallet and gateway for Hyperledger Fabric
        const walletPath = path.resolve(__dirname, '../../wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // // Dynamically get the first identity in the wallet (or handle accordingly)
        // const identities = await wallet.list();
        // if (identities.length === 0) {
        //     throw new Error('No identities found in wallet.');
        // }

        const identityName = await getIdentityFromWallet(wallet);
        const identity = await wallet.get(identityName);
        if (!identity) {
            throw new Error(`Identity "${identityName}" not found in wallet.`);
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: identityName,
            discovery: { enabled: true, asLocalhost: true },
        });

        const network = await gateway.getNetwork('seedtransactions-channel');
        contract = network.getContract('seedContract');
    } catch (error) {
        logger.error('Failed to initialize blockchain:', error);
        throw error;
    }
}


// Function to log transaction on the blockchain
export async function logTransactionOnBlockchain(data: {
    id: number;
    farmerId: number;
    seedType: string;
    quantity: number;
    totalPrice: number;
    location: string;
}): Promise<string> {
    try {
        if (!contract) {
            throw new Error('Blockchain contract is not initialized.');
        }

        const result = await contract.submitTransaction(
            'createSeedTransaction',
            data.id.toString(),
            data.farmerId.toString(),
            data.seedType,
            data.quantity.toString(),
            data.totalPrice.toString(),
            data.location
        );

        const blockchainTxId = result.toString();
        logger.info(`Blockchain transaction submitted with ID: ${blockchainTxId}`);

        return blockchainTxId;
    } catch (error) {
        logger.error('Error logging transaction on blockchain:', error);
        throw error;
    }
}

// Function to create seed transaction in both PostgreSQL and Fabric
export async function createSeedTransactionPostgresAndFabric(transaction: SeedTransaction): Promise<void> {
    let client: PoolClient | null = null;

    try {
        client = await pool.connect(); 

        const res = await client.query(`
            SELECT * FROM create_and_update_seed_transaction($1, $2, $3, $4, $5, $6);
        `, [
            transaction.farmerId,
            transaction.seedType,
            transaction.quantity,
            transaction.pricePerUnit,
            transaction.location,
            '' 
        ]);

        const insertedTransaction = res.rows[0];
        logger.info(`PostgreSQL transaction inserted with ID: ${insertedTransaction.transaction_id}`);

        if (contract === null) {
            throw new Error('Blockchain contract is not initialized.');
        }

        const blockchainTxId = await logTransactionOnBlockchain({
            id: insertedTransaction.transaction_id,
            farmerId: transaction.farmerId,
            seedType: transaction.seedType,
            quantity: transaction.quantity,
            totalPrice: transaction.quantity * transaction.pricePerUnit,
            location: transaction.location
        });

        await client.query(`
            UPDATE seed_transactions
            SET blockchain_tx_id = $1, status = 'Completed', updated_at = NOW()
            WHERE id = $2;
        `, [blockchainTxId, insertedTransaction.transaction_id]);

        logger.info('PostgreSQL transaction updated with blockchain Tx ID.');
    } catch (error) {
        logger.error('Error in creating and updating seed transaction:', error);
        throw error;
    } finally {
        if (client) {
            client.release();  
        }
    }
}




// import { Pool } from 'pg'; 
// import { Gateway, Wallets, Contract, Wallet } from 'fabric-network';  
// import { config } from "../config";
// import * as fs from 'fs';
// import * as path from 'path';


// const seedTransaction: SeedTransaction = {
//     farmerId: 12345,
//     seedType: "Wheat",
//     quantity: 1000,
//     pricePerUnit: 10,
//     totalPrice: 10000,  // totalPrice = quantity * pricePerUnit
//     location: "Farming Zone A",
// };


// const pool = new Pool({
//     connectionString: config.db.connectionString || 'postgresql://username:password@localhost:5432/testdb',
//     ...(config.db.connectionString
//         ? {}
//         : {
//             user: config.db.user,
//             host: config.db.host,
//             database: config.db.name,
//             password: config.db.password,
//             port: config.db.port,
//             max: config.db.pool.max || 10,
//             min: config.db.pool.min || 2,
//             idleTimeoutMillis: config.db.pool.idle || 10000,
//         }),
// });


// interface SeedTransaction {
//     farmerId: number;
//     seedType: string;
//     quantity: number;
//     pricePerUnit: number;
//     totalPrice: number;
//     location: string;
// }


// let contract: Contract | null = null;


// async function createGateway() {
//     try {
     
//         const ccpPath = path.resolve(__dirname, '..', 'fabric-network', 'connection-profile-network.json');
    
//         const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));


//         const wallet = await Wallets.newFileSystemWallet('./wallet'); 

       
//         const gateway = await Gateway.createGateway({
//             wallet,
//             identity: 'admin', 
//             discovery: { enabled: true, asLocalhost: true },
//             identityContext: 'Admin',
//         });


//         const network = await gateway.getNetwork('mychannel');
//         contract = network.getContract('mychaincode'); 

//         console.log("Successfully connected to the Fabric network.");
//     } catch (error) {
//         console.error(`Error creating gateway: ${error}`);
//     }
// }


// async function insertSeedTransaction() {
//     const client: PoolClient = await pool.connect();
//     try {
//         const query = `INSERT INTO seed_transactions(farmer_id, seed_type, quantity, price_per_unit, total_price, location) 
//                        VALUES($1, $2, $3, $4, $5, $6) RETURNING id`;
//         const values = [
//             seedTransaction.farmerId,
//             seedTransaction.seedType,
//             seedTransaction.quantity,
//             seedTransaction.pricePerUnit,
//             seedTransaction.totalPrice,
//             seedTransaction.location
//         ];

//         const result = await client.query(query, values);
//         console.log(`Inserted transaction with ID: ${result.rows[0].id}`);
//     } catch (err) {
//         console.error(`Error inserting data into PostgreSQL: ${err}`);
//     } finally {
//         client.release();
//     }
// }


// export async function logTransactionOnBlockchain() {
//     if (contract) {
//         try {
//             const response = await contract.submitTransaction('createSeedTransaction', 
//                 seedTransaction.farmerId.toString(),
//                 seedTransaction.seedType,
//                 seedTransaction.quantity.toString(),
//                 seedTransaction.pricePerUnit.toString(),
//                 seedTransaction.totalPrice.toString(),
//                 seedTransaction.location
//             );
//             console.log(`Transaction successfully submitted: ${response.toString()}`);
//         } catch (error) {
//             console.error(`Error submitting transaction: ${error}`);
//         }
//     } else {
//         console.log("Contract is not initialized.");
//     }
// }


// async function main() {

//     await createGateway();


//     await insertSeedTransaction();


//     await logTransactionOnBlockchain();
// }

// main().catch(err => console.error("Error in main function: ", err));

