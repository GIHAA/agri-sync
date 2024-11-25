import { TransactionRepository } from "../repository/transaction.repository";
import { logTransactionOnBlockchain } from "../blockchain/transactionBlockchain.blockchain";

const transactionRepository = new TransactionRepository();

export const createSeedTransaction = async (data: {
  farmerId: number;
  seedType: string;
  quantity: number;
  pricePerUnit: number;
  location: string;
}) => {
  try {
    const transaction = await transactionRepository.createOrUpdateSeedTransaction({
      ...data,
      blockchainTxId: null, 
    });

    const totalPrice = data.quantity * data.pricePerUnit;

    const blockchainTxId = await logTransactionOnBlockchain({
      id: transaction.id,
      ...data,
      totalPrice,
    });

    const updatedTransaction = await transactionRepository.updateBlockchainTransactionId(
      transaction.id,
      blockchainTxId
    );

    return updatedTransaction;
  } catch (error) {
    console.error("Error creating seed transaction:", error);
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
