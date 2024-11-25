"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransactionDTO = void 0;
const validateTransactionDTO = (data) => {
    const { farmerId, seedType, quantity, pricePerUnit, location } = data;
    if (!farmerId || typeof farmerId !== "number") {
        throw new Error("Invalid or missing 'farmerId'. It must be a number.");
    }
    if (!seedType || typeof seedType !== "string") {
        throw new Error("Invalid or missing 'seedType'. It must be a string.");
    }
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
        throw new Error("Invalid or missing 'quantity'. It must be a positive number.");
    }
    if (!pricePerUnit || typeof pricePerUnit !== "number" || pricePerUnit <= 0) {
        throw new Error("Invalid or missing 'pricePerUnit'. It must be a positive number.");
    }
    if (!location || typeof location !== "string") {
        throw new Error("Invalid or missing 'location'. It must be a string.");
    }
    return {
        farmerId,
        seedType,
        quantity,
        pricePerUnit,
        location,
    };
};
exports.validateTransactionDTO = validateTransactionDTO;
