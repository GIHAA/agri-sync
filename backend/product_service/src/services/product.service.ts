import {
  createProductInDB,
  getAllProductsFromDB,
  getProductByIdFromDB,
  updateProductInDB,
  deleteProductFromDB,
} from "../repository/product.repository";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";

export const createProduct = async (data: CreateProductDTO) => {
  return await createProductInDB(data);
};

export const getAllProducts = async () => {
  return await getAllProductsFromDB();
};

export const getProductById = async (id: number) => {
  const product = await getProductByIdFromDB(id);
  if (!product) throw new Error("Product not found");
  return product;
};

export const updateProduct = async (id: number, data: UpdateProductDTO) => {
  return await updateProductInDB(id, data);
};

export const deleteProduct = async (id: number) => {
  return await deleteProductFromDB(id);
};
