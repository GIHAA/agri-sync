import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 

// Load environment variables
dotenv.config();

import transactionRoutes from "./api/seedTransaction.routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";

const app = express();

app.use(cors()); 


// const corsOptions = {
//   origin: "http://localhost:",
//   methods: ["GET", "POST"], 
//   allowedHeaders: ["Content-Type", "Authorization"], 
// };
// app.use(cors(corsOptions)); 

app.use(express.json());
app.use(httpLogger);

// Define your routes
app.use("/seed-transactions", transactionRoutes);

// Handle errors
app.use(HandleErrorWithLogger);

export default app;
