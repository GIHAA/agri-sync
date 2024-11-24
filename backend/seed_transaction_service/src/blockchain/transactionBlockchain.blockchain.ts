// import { Gateway, Wallets } from "fabric-network";
// import { logger } from "../utils/logger";


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


import { Gateway, Wallets } from "fabric-network";
import { logger } from "../utils/logger";
import { config } from "../config";
import * as fs from "fs";
import * as path from "path";

let contract: any;

export const initializeBlockchain = async (): Promise<void> => {
  try {
    const ccpPath = path.resolve(__dirname, config.blockchain.connectionPath);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const wallet = await Wallets.newFileSystemWallet(config.blockchain.walletPath);
    logger.info("Wallet loaded successfully");

    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: config.blockchain.identity,
      discovery: { enabled: true, asLocalhost: true },
    });
    logger.info("Connected to blockchain gateway");

    const network = await gateway.getNetwork(config.blockchain.channelName);
    contract = network.getContract(config.blockchain.contractName);
    logger.info(`Connected to channel: ${config.blockchain.channelName}, contract: ${config.blockchain.contractName}`);
  } catch (error) {
    logger.error("Failed to initialize blockchain contract:", error);
    throw new Error("Blockchain initialization failed. Ensure the connection profile and wallet are configured correctly.");
  }
};


export const logTransactionOnBlockchain = async (transaction: {
  id: number;
  farmerId: number;
  seedType: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  location: string;
}): Promise<string> => {
  try {
    if (!contract) {
      throw new Error("Blockchain contract is not initialized. Call initializeBlockchain() first.");
    }

    if (!transaction.id || !transaction.farmerId || !transaction.seedType) {
      throw new Error("Invalid transaction data. Ensure all required fields are provided.");
    }

    const result = await contract.submitTransaction(
      "logTransaction",
      transaction.id.toString(),
      transaction.farmerId.toString(),
      transaction.seedType,
      transaction.quantity.toString(),
      transaction.pricePerUnit.toString(),
      transaction.totalPrice.toString(),
      transaction.location
    );

    const blockchainTxId = result.toString();
    logger.info(`Transaction logged on blockchain successfully. Blockchain TxID: ${blockchainTxId}`);
    return blockchainTxId;
  } catch (error) {
    logger.error("Failed to log transaction on blockchain:", error);
    throw new Error("Blockchain transaction logging failed. Verify the contract and input data.");
  }
};
