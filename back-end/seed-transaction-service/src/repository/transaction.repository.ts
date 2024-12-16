// import db from "./db";
// import { ITransactionRepository } from "../interface/seedTransactionRepository.interface";

// export class TransactionRepository implements ITransactionRepository {
//   async createOrUpdateSeedTransaction(data: {
//     farmerId: number;
//     seedType: string;
//     quantity: number;
//     pricePerUnit: number;
//     location: string;
//     blockchainTxId?: string | null;
//   }): Promise<any> {
//     try {
//       const query = `
//         SELECT * FROM create_and_update_seed_transaction($1, $2, $3, $4, $5, $6)
//       `;
//       const values = [
//         data.farmerId,
//         data.seedType,
//         data.quantity,
//         data.pricePerUnit,
//         data.location,
//         data.blockchainTxId || null,
//       ];

//       const result = await db.query(query, values);

//       if (!result.rows.length) {
//         throw new Error("Transaction creation or update failed.");
//       }

//       return result.rows[0];
//     } catch (error) {
//       console.error("Error in createOrUpdateSeedTransaction:", error);
//       throw error;
//     }
//   }

//   async updateBlockchainTransactionId(transactionId: number, blockchainTxId: string): Promise<any> {
//     const query = `
//       UPDATE seed_transactions
//       SET blockchain_tx_id = $1, status = 'Completed', updated_at = NOW()
//       WHERE id = $2
//       RETURNING *;
//     `;
//     try {
//       const result = await db.query(query, [blockchainTxId, transactionId]);
//       if (result.rows.length === 0) {
//         throw new Error(`Transaction with ID ${transactionId} not found.`);
//       }
//       return result.rows[0];
//     } catch (error) {
//       console.error(`Error updating blockchain transaction ID for transaction ${transactionId}:`, error);
//       throw error;
//     }
//   }

//   async getSeedTransactionById(transactionId: number): Promise<any> {
//     const query = "SELECT * FROM seed_transactions WHERE id = $1";
//     try {
//       const result = await db.query(query, [transactionId]);
//       if (result.rows.length === 0) {
//         throw new Error(`Transaction with ID ${transactionId} not found.`);
//       }
//       return result.rows[0];
//     } catch (error) {
//       console.error(`Error fetching transaction with ID ${transactionId}:`, error);
//       throw error;
//     }
//   }

//   async getAllSeedTransactions(): Promise<any[]> {
//     const query = "SELECT * FROM seed_transactions ORDER BY created_at DESC";
//     try {
//       const result = await db.query(query);
//       return result.rows;
//     } catch (error) {
//       console.error("Error fetching all seed transactions:", error);
//       throw error;
//     }
//   }

//   // async getFarmerDetails(qrCodeHash: string): Promise<any> {
//   //   const query = "SELECT id, name, location FROM users WHERE qr_code_hash = $1";
//   //   const result = await db.query(query, [qrCodeHash]);
//   //   if (!result.rows.length) throw new Error("Farmer not found");
//   //   return result.rows[0];
//   // }
// }

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
      // Direct INSERT query
      const query = `
        INSERT INTO seed_transactions (
          farmer_id, 
          seed_type, 
          quantity, 
          price_per_unit, 
          location, 
          blockchain_tx_id, 
          status, 
          created_at, 
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id;
      `;

      // Set the values to be inserted into the query
      const values = [
        data.farmerId,
        data.seedType,
        data.quantity,
        data.pricePerUnit,
        data.location,
        data.blockchainTxId || null, // If no blockchainTxId is provided, set it as null
      ];

      // Execute the query and get the result
      const result = await db.query(query, values);

      // Check if the insert was successful
      if (!result.rows.length) {
        throw new Error("Transaction creation failed.");
      }

      // Return the inserted transaction ID
      return result.rows[0].id; // Return the ID of the inserted row
    } catch (error) {
      console.error("Error in createOrUpdateSeedTransaction:", error);
      throw error;
    }
  }


  async updateBlockchainTransactionId(transactionId: number, blockchainTxId: string): Promise<any> {
    try {
      const query = `
        UPDATE seed_transactions
        SET blockchain_tx_id = $1, status = 'Completed', updated_at = NOW()
        WHERE id = $2
        RETURNING *;
      `;
      const values = [blockchainTxId, transactionId];

      const result = await db.query(query, values);
      if (!result.rows.length) {
        throw new Error("Failed to update blockchain transaction ID.");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error in updateBlockchainTransactionId:", error);
      throw error;
    }
  }

  // Method to fetch a seed transaction by its ID
  async getSeedTransactionById(transactionId: number): Promise<any> {
    try {
      const query = `SELECT * FROM seed_transactions WHERE id = $1`;
      const result = await db.query(query, [transactionId]);

      if (!result.rows.length) {
        throw new Error("Transaction not found.");
      }

      return result.rows[0];
    } catch (error) {
      console.error(`Error fetching transaction with ID ${transactionId}:`, error);
      throw error;
    }
  }

  // Method to get all seed transactions
  async getAllSeedTransactions(): Promise<any[]> {
    try {
      const query = `SELECT * FROM seed_transactions`;
      const result = await db.query(query);

      return result.rows;
    } catch (error) {
      console.error("Error fetching all seed transactions:", error);
      throw error;
    }
  }
}
