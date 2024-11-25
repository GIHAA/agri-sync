"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const expressApp_1 = __importDefault(require("./expressApp"));
const transactionBlockchain_blockchain_1 = require("./blockchain/transactionBlockchain.blockchain");
const config_1 = require("./config");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Initialize blockchain connection
        yield (0, transactionBlockchain_blockchain_1.initializeBlockchain)();
        console.log("Blockchain initialized successfully");
        // Start the Express server
        expressApp_1.default.listen(config_1.config.server.port, () => {
            console.log(`Server running on port ${config_1.config.server.port}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1); // Exit the process with failure
    }
});
exports.startServer = startServer;
(0, exports.startServer)();
