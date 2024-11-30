import app from "./expressApp";
//import { initializeBlockchain } from "./blockchain/transactionBlockchain.blockchain";
import { config } from "./config";


export const startServer = async () => {
  try {
    //await initializeBlockchain();
   // console.log("Blockchain initialized successfully");

    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};
startServer(); 