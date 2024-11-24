import { CreateProductDTO } from "../dto/product.dto";

export const validateProductDTO = (data: any): CreateProductDTO => {
  if (!data.seed_type || !data.location || !data.quantity || !data.price || !data.added_by) {
    throw new Error("Invalid product data");
  }
  return data;
};
