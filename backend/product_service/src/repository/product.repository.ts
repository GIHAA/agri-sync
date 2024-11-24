import { PrismaClient } from "@prisma/client";
import { CreateProductDTO, UpdateProductDTO } from "../dto/product.dto";

const prisma = new PrismaClient();

export const createProductInDB = async (data: CreateProductDTO) => {
  return await prisma.product.create({ data });
};

export const getAllProductsFromDB = async () => {
  return await prisma.product.findMany();
};

export const getProductByIdFromDB = async (id: number) => {
  return await prisma.product.findUnique({ where: { id } });
};

export const updateProductInDB = async (id: number, data: UpdateProductDTO) => {
  return await prisma.product.update({ where: { id }, data });
};

export const deleteProductFromDB = async (id: number) => {
  return await prisma.product.delete({ where: { id } });
};
