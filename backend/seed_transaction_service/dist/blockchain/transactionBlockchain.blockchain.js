"use strict";
// import { Gateway, Wallets } from "fabric-network";
// import { logger } from "../utils/logger";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryTransactionOnBlockchain = exports.logTransactionOnBlockchain = exports.initializeBlockchain = void 0;
// let contract: Contract;
// export const initializeBlockchain = async (): Promise<void> => {
//   const wallet = await Wallets.newFileSystemWallet("./wallet");
//   const gateway = new Gateway();
//   await gateway.connect("./connection.json", {
//     wallet,
//     identity: "appUser",
//     discovery: { enabled: true, asLocalhost: true },
//   });
//   const network = await gateway.getNetwork("mychannel");
//   contract = network.getContract("seedContract");
//   logger.info("Blockchain contract initialized");
// };
// export const logTransactionOnBlockchain = async (transaction: any): Promise<string> => {
//   try {
//     const wallet = await Wallets.newFileSystemWallet("./wallet");
//     const gateway = new Gateway();
//     await gateway.connect("./network-config.yaml", {
//       wallet,
//       identity: "appUser",
//       discovery: { enabled: true, asLocalhost: true },
//     });
//     const network = await gateway.getNetwork("mychannel");
//     const contract = network.getContract("seedContract");
//     await contract.submitTransaction(
//       "logTransaction",
//       transaction.id.toString(),
//       transaction.farmer_id.toString(),
//       transaction.seed_type,
//       transaction.quantity.toString(),
//       transaction.price_per_unit.toString(),
//       transaction.location,
//       transaction.total_price.toString()
//     );
//     console.log("Transaction logged on blockchain");
//     return "0xTransactionHash"; // Replace with actual transaction hash
//   } catch (error) {
//     console.error("Failed to log transaction on blockchain:", error);
//     throw error;
//   }
// };
// import { Gateway, Wallets } from "fabric-network";
// import { logger } from "../utils/logger";
// import { config } from "../config";
// let contract: any;
// export const initializeBlockchain = async (): Promise<void> => {
//   const wallet = await Wallets.newFileSystemWallet(config.blockchain.walletPath);
//   const gateway = new Gateway();
//   await gateway.connect(config.blockchain.connectionPath, {
//     wallet,
//     identity: config.blockchain.identity,
//     discovery: { enabled: true, asLocalhost: true },
//   });
//   const network = await gateway.getNetwork(config.blockchain.channelName);
//   contract = network.getContract(config.blockchain.contractName);
//   logger.info("Blockchain contract initialized");
// };
// export const logTransactionOnBlockchain = async (transaction: any): Promise<string> => {
//   try {
//     await contract.submitTransaction(
//       "logTransaction",
//       transaction.id.toString(),
//       transaction.farmerId.toString(),
//       transaction.seedType,
//       transaction.quantity.toString(),
//       transaction.pricePerUnit.toString(),
//       transaction.totalPrice.toString(),
//       transaction.location
//     );
//     logger.info("Transaction logged on blockchain");
//     return "0xTransactionHash"; // Replace with the actual transaction hash from the blockchain
//   } catch (error) {
//     logger.error("Failed to log transaction on blockchain", error);
//     throw error;
//   }
// };
// import { Gateway, Wallets } from "fabric-network";
// import { logger } from "../utils/logger";
// import { config } from "../config";
// import * as fs from "fs";
// import * as path from "path";
// let contract: any;
// export const initializeBlockchain = async (): Promise<void> => {
//   try {
//     const ccpPath = path.resolve(__dirname, config.blockchain.connectionPath);
//     const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
//     const wallet = await Wallets.newFileSystemWallet(config.blockchain.walletPath);
//     logger.info("Wallet loaded successfully");
//     const gateway = new Gateway();
//     await gateway.connect(ccp, {
//       wallet,
//       identity: config.blockchain.identity,
//       discovery: { enabled: true, asLocalhost: true },
//     });
//     logger.info("Connected to blockchain gateway");
//     const network = await gateway.getNetwork(config.blockchain.channelName);
//     contract = network.getContract(config.blockchain.contractName);
//     logger.info(`Connected to channel: ${config.blockchain.channelName}, contract: ${config.blockchain.contractName}`);
//   } catch (error) {
//     logger.error("Failed to initialize blockchain contract:", error);
//     throw new Error("Blockchain initialization failed. Ensure the connection profile and wallet are configured correctly.");
//   }
// };
// export const logTransactionOnBlockchain = async (transaction: {
//   id: number;
//   farmerId: number;
//   seedType: string;
//   quantity: number;
//   pricePerUnit: number;
//   totalPrice: number;
//   location: string;
// }): Promise<string> => {
//   try {
//     if (!contract) {
//       throw new Error("Blockchain contract is not initialized. Call initializeBlockchain() first.");
//     }
//     if (!transaction.id || !transaction.farmerId || !transaction.seedType) {
//       throw new Error("Invalid transaction data. Ensure all required fields are provided.");
//     }
//     const result = await contract.submitTransaction(
//       "logTransaction",
//       transaction.id.toString(),
//       transaction.farmerId.toString(),
//       transaction.seedType,
//       transaction.quantity.toString(),
//       transaction.pricePerUnit.toString(),
//       transaction.totalPrice.toString(),
//       transaction.location
//     );
//     const blockchainTxId = result.toString();
//     logger.info(`Transaction logged on blockchain successfully. Blockchain TxID: ${blockchainTxId}`);
//     return blockchainTxId;
//   } catch (error) {
//     logger.error("Failed to log transaction on blockchain:", error);
//     throw new Error("Blockchain transaction logging failed. Verify the contract and input data.");
//   }
// };
const fabric_network_1 = require("fabric-network");
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
let contract; // Holds the blockchain contract
/**
 * Initializes the connection to the blockchain network and loads the smart contract.
 */
const initializeBlockchain = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Resolve the connection profile path
        const ccpPath = path.resolve(__dirname, "../../", config_1.config.blockchain.connectionPath);
        let ccp;
        // Support both JSON and YAML connection profiles
        if (ccpPath.endsWith(".json")) {
            ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
        }
        else if (ccpPath.endsWith(".yaml") || ccpPath.endsWith(".yml")) {
            ccp = yaml.load(fs.readFileSync(ccpPath, "utf8"));
        }
        else {
            throw new Error("Unsupported connection profile format. Use JSON or YAML.");
        }
        // Load the wallet containing identities
        const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(config_1.config.blockchain.walletPath);
        logger_1.logger.info("Wallet loaded successfully");
        // Check if the specified identity exists in the wallet
        const identity = yield wallet.get(config_1.config.blockchain.identity);
        if (!identity) {
            throw new Error(`Identity "${config_1.config.blockchain.identity}" not found in wallet. Ensure it is enrolled.`);
        }
        // Connect to the gateway
        const gateway = new fabric_network_1.Gateway();
        yield gateway.connect(ccp, {
            wallet,
            identity: config_1.config.blockchain.identity,
            discovery: { enabled: true, asLocalhost: process.env.LOCAL_NETWORK === "true" },
        });
        logger_1.logger.info("Connected to blockchain gateway");
        // Connect to the network and contract
        const network = yield gateway.getNetwork(config_1.config.blockchain.channelName);
        contract = network.getContract(config_1.config.blockchain.contractName);
        logger_1.logger.info(`Connected to channel: ${config_1.config.blockchain.channelName}, contract: ${config_1.config.blockchain.contractName}`);
    }
    catch (error) {
        logger_1.logger.error("Failed to initialize blockchain contract:", error);
        throw new Error("Blockchain initialization failed. Ensure the connection profile and wallet are configured correctly.");
    }
});
exports.initializeBlockchain = initializeBlockchain;
/**
 * Logs a seed transaction to the blockchain.
 *
 * @param transaction - The seed transaction details.
 * @returns The blockchain transaction ID.
 */
const logTransactionOnBlockchain = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the contract is initialized
        if (!contract) {
            throw new Error("Blockchain contract is not initialized. Call initializeBlockchain() first.");
        }
        // Validate transaction data
        if (!transaction.id || !transaction.farmerId || !transaction.seedType) {
            throw new Error("Invalid transaction data. Ensure all required fields are provided.");
        }
        logger_1.logger.info("Submitting transaction to blockchain...");
        // Submit the transaction to the blockchain
        const result = yield contract.submitTransaction("logTransaction", transaction.id.toString(), transaction.farmerId.toString(), transaction.seedType, transaction.quantity.toString(), transaction.pricePerUnit.toString(), transaction.totalPrice.toString(), transaction.location);
        // Log success and return the blockchain transaction ID
        const blockchainTxId = result.toString();
        logger_1.logger.info(`Transaction logged on blockchain successfully. Blockchain TxID: ${blockchainTxId}`);
        return blockchainTxId;
    }
    catch (error) {
        logger_1.logger.error("Failed to log transaction on blockchain:", error);
        throw new Error("Blockchain transaction logging failed. Verify the contract and input data.");
    }
});
exports.logTransactionOnBlockchain = logTransactionOnBlockchain;
/**
 * Retrieves the current state of a transaction from the blockchain.
 *
 * @param transactionId - The ID of the transaction to query.
 * @returns The transaction details stored on the blockchain.
 */
const queryTransactionOnBlockchain = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the contract is initialized
        if (!contract) {
            throw new Error("Blockchain contract is not initialized. Call initializeBlockchain() first.");
        }
        logger_1.logger.info(`Querying transaction with ID: ${transactionId}`);
        // Query the blockchain for the transaction details
        const result = yield contract.evaluateTransaction("queryTransaction", transactionId);
        logger_1.logger.info(`Transaction retrieved from blockchain: ${result.toString()}`);
        return JSON.parse(result.toString());
    }
    catch (error) {
        logger_1.logger.error("Failed to query transaction on blockchain:", error);
        throw new Error(`Blockchain query failed for transaction ID ${transactionId}.`);
    }
});
exports.queryTransactionOnBlockchain = queryTransactionOnBlockchain;
