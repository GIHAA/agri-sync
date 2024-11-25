// import db from "./db";

// /**
//  * Inserts a seed transaction using the stored procedure.
//  */
// export const insertSeedTransaction = async (data: {
//   farmerId: number;
//   seedType: string;
//   quantity: number;
//   pricePerUnit: number;
//   location: string;
// }) => {
//   const query = "SELECT create_seed_transaction($1, $2, $3, $4, $5) AS transaction_id";
//   const values = [data.farmerId, data.seedType, data.quantity, data.pricePerUnit, data.location];
//   const result = await db.query(query, values);
//   return result.rows[0].transaction_id;
// };

// /**
//  * Updates the blockchain transaction ID and status for a seed transaction.
//  */
// export const updateBlockchainTransactionId = async (transactionId: number, blockchainTxId: string) => {
//   const query = `
//     UPDATE seed_transactions
//     SET blockchain_tx_id = $1, status = 'Completed'
//     WHERE id = $2
//     RETURNING *;
//   `;
//   const result = await db.query(query, [blockchainTxId, transactionId]);
//   return result.rows[0];
// };

// /**
//  * Fetches a seed transaction by ID.
//  */
// export const getSeedTransactionById = async (transactionId: number) => {
//   const query = "SELECT * FROM seed_transactions WHERE id = $1";
//   const result = await db.query(query, [transactionId]);
//   return result.rows[0];
// };

// /**
//  * Fetches all seed transactions.
//  */
// export const getAllSeedTransactions = async () => {
//   const query = "SELECT * FROM seed_transactions ORDER BY created_at DESC";
//   const result = await db.query(query);
//   return result.rows;
// };

// /**
//  * Fetch farmer details by QR code hash.
//  */
// export const getFarmerDetails = async (qrCodeHash: string) => {
//   const query = "SELECT id, name, location FROM users WHERE qr_code_hash = $1";
//   const result = await db.query(query, [qrCodeHash]);
//   if (!result.rows.length) throw new Error("Farmer not found");
//   return result.rows[0];
// };

import db from "./db";
import { ITransactionRepository } from "../interface/seedTransactionRepository.interface";

export class TransactionRepository implements ITransactionRepository {
  async createOrUpdateSeedTransaction(data: {
    farmerId: number;
    seedType: string;
    quantity: number;
    pricePerUnit: number;
    location: string;
    blockchainTxId?: string | null;
  }): Promise<any> {
    try {
      const query = `
        SELECT * FROM create_and_update_seed_transaction($1, $2, $3, $4, $5, $6)
      `;
      const values = [
        data.farmerId,
        data.seedType,
        data.quantity,
        data.pricePerUnit,
        data.location,
        data.blockchainTxId || null,
      ];

      const result = await db.query(query, values);

      if (!result.rows.length) {
        throw new Error("Transaction creation or update failed.");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error in createOrUpdateSeedTransaction:", error);
      throw error;
    }
  }

  async updateBlockchainTransactionId(transactionId: number, blockchainTxId: string): Promise<any> {
    const query = `
      UPDATE seed_transactions
      SET blockchain_tx_id = $1, status = 'Completed', updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    try {
      const result = await db.query(query, [blockchainTxId, transactionId]);
      if (result.rows.length === 0) {
        throw new Error(`Transaction with ID ${transactionId} not found.`);
      }
      return result.rows[0];
    } catch (error) {
      console.error(`Error updating blockchain transaction ID for transaction ${transactionId}:`, error);
      throw error;
    }
  }

  async getSeedTransactionById(transactionId: number): Promise<any> {
    const query = "SELECT * FROM seed_transactions WHERE id = $1";
    try {
      const result = await db.query(query, [transactionId]);
      if (result.rows.length === 0) {
        throw new Error(`Transaction with ID ${transactionId} not found.`);
      }
      return result.rows[0];
    } catch (error) {
      console.error(`Error fetching transaction with ID ${transactionId}:`, error);
      throw error;
    }
  }

  async getAllSeedTransactions(): Promise<any[]> {
    const query = "SELECT * FROM seed_transactions ORDER BY created_at DESC";
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error fetching all seed transactions:", error);
      throw error;
    }
  }

  // async getFarmerDetails(qrCodeHash: string): Promise<any> {
  //   const query = "SELECT id, name, location FROM users WHERE qr_code_hash = $1";
  //   const result = await db.query(query, [qrCodeHash]);
  //   if (!result.rows.length) throw new Error("Farmer not found");
  //   return result.rows[0];
  // }
}
