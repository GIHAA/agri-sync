export interface CreateTransactionDTO {
  farmerId: number;
  seedType: string;
  quantity: number;
  pricePerUnit: number;
  location: string;
}

export interface TransactionResponseDTO {
  id: number;
  farmerId: number;
  seedType: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  location: string;
  blockchainTxId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
