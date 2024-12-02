import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import transactionRoutes from "./api/seedTransaction.routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";

const app = express();


app.use(express.json());
app.use(httpLogger);
app.use("/seed-transactions", transactionRoutes);

app.use(HandleErrorWithLogger);


export default app;
