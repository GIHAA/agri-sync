export interface ITransactionRepository {
  insertSeedTransaction(data: {
    farmerId: number;
    seedType: string;
    quantity: number;
    pricePerUnit: number;
    location: string;
  }): Promise<number>;

  updateBlockchainTransactionId(transactionId: number, blockchainTxId: string): Promise<any>;

  getSeedTransactionById(transactionId: number): Promise<any>;

  getAllSeedTransactions(): Promise<any[]>;

  getFarmerDetails(qrCodeHash: string): Promise<any>;
}
