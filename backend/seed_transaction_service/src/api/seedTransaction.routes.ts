
import express from "express";
import {
  createSeedTransaction,
  getTransactionById,
  getTransactions
} from "../services/seedTransaction.service";

const router = express.Router();

// Create a new seed transaction
router.post("/", async (req, res, next) => {
  try {
    const transaction = await createSeedTransaction(req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
});

// Get a seed transaction by ID
router.get("/:id", async (req, res, next) => {
  try {
    const transaction = await getTransactionById(Number(req.params.id));
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
});

// Get all seed transactions
router.get("/", async (req, res, next) => {
  try {
    const transactions = await getTransactions();
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
});


export default router;
