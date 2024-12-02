import { equal } from "assert";
import { TransactionRepository } from "../repository/transaction.repository";
//import { logTransactionOnBlockchain } from "../blockchain/transactionBlockchain.blockchain";

const transactionRepository = new TransactionRepository();

export const createSeedTransaction = async (data: {
  farmerId: number;
  seedType: string;
  quantity: number;
  pricePerUnit: number;
  location: string;
  blockchainTxId: string | null;
}) => {
  try {

    let status = "In Progress";
    let blockchainTxId = data.blockchainTxId;


    if (!blockchainTxId || blockchainTxId === '') {

      blockchainTxId = await initiateBlockchainTransaction(data);

      status = "Pending";
    } else {
      status = "Completed";
    }

    const transactionId = await transactionRepository.createOrUpdateSeedTransaction({
      ...data,
      blockchainTxId: blockchainTxId,
    });

    return {
      transactionId,
      status,
      blockchainTxId,
      message: `Transaction is ${status}`,
    };
  } catch (error) {
    console.error("Error creating seed transaction:", error);
    throw error;
  }
};


const initiateBlockchainTransaction = async (data: {
  farmerId: number;
  seedType: string;
  quantity: number;
  pricePerUnit: number;
  location: string;
}) => {
  try {

    console.log("Initiating blockchain transaction...");


    const simulatedTxId = "Pending for real-blockchain-tx-id-updated";

    // Return the simulated blockchain transaction ID
    return simulatedTxId;
  } catch (error) {
    console.error("Error initiating blockchain transaction:", error);
    throw error;
  }
};


export const getTransactionById = async (transactionId: number) => {
  try {
    return await transactionRepository.getSeedTransactionById(transactionId);
  } catch (error) {
    console.error(`Error fetching transaction with ID ${transactionId}:`, error);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    return await transactionRepository.getAllSeedTransactions();
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    throw error;
  }
};
