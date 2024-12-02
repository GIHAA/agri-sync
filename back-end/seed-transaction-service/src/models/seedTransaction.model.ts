export interface SeedTransaction {
  id: number;
  farmerId: number;
  seedType: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  location: string;
  status: string;
  blockchainTxId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
