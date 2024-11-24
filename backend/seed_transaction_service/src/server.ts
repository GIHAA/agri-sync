import app from "./expressApp";
import { initializeBlockchain } from "./blockchain/transactionBlockchain.blockchain";
import { config } from "./config";

/**
 * Start the server.
 */
const startServer = async () => {
  try {
    // Initialize blockchain connection
    await initializeBlockchain();
    console.log("Blockchain initialized successfully");

    // Start the Express server
    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Run the server
startServer();
