import express from "express";
import transactionRoutes from "./api/seedTransaction.routes";
import { errorHandler } from "./utils/error/errorHandler";

const app = express();
app.use(express.json());
app.use("/seed-transactions", transactionRoutes);
app.use(errorHandler);

export default app;
