import express from "express";
import {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../services/product.service";
import { validateProductDTO } from "../utils/requestValidator";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const productData = validateProductDTO(req.body);
    const product = await createProduct(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await getProductById(Number(req.params.id));
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = await updateProduct(Number(req.params.id), req.body);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteProduct(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
