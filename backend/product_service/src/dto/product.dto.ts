export interface CreateProductDTO {
  seed_type: string;
  description?: string;
  location: string;
  quantity: number;
  price: number;
  status?: "Available" | "Out of Stock";
  added_by: number;
}

export interface UpdateProductDTO {
  seed_type?: string;
  description?: string;
  location?: string;
  quantity?: number;
  price?: number;
  status?: "Available" | "Out of Stock";
}
