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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.getTransactionById = exports.createSeedTransaction = void 0;
const transaction_repository_1 = require("../repository/transaction.repository");
const transactionBlockchain_blockchain_1 = require("../blockchain/transactionBlockchain.blockchain");
const transactionRepository = new transaction_repository_1.TransactionRepository();
const createSeedTransaction = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transactionRepository.createOrUpdateSeedTransaction(Object.assign(Object.assign({}, data), { blockchainTxId: null }));
        const totalPrice = data.quantity * data.pricePerUnit;
        const blockchainTxId = yield (0, transactionBlockchain_blockchain_1.logTransactionOnBlockchain)(Object.assign(Object.assign({ id: transaction.id }, data), { totalPrice }));
        const updatedTransaction = yield transactionRepository.updateBlockchainTransactionId(transaction.id, blockchainTxId);
        return updatedTransaction;
    }
    catch (error) {
        console.error("Error creating seed transaction:", error);
        throw error;
    }
});
exports.createSeedTransaction = createSeedTransaction;
const getTransactionById = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield transactionRepository.getSeedTransactionById(transactionId);
    }
    catch (error) {
        console.error(`Error fetching transaction with ID ${transactionId}:`, error);
        throw error;
    }
});
exports.getTransactionById = getTransactionById;
const getTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield transactionRepository.getAllSeedTransactions();
    }
    catch (error) {
        console.error("Error fetching all transactions:", error);
        throw error;
    }
});
exports.getTransactions = getTransactions;
