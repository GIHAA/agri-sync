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
const express_1 = __importDefault(require("express"));
const seedTransaction_service_1 = require("../services/seedTransaction.service");
const router = express_1.default.Router();
// Create a new seed transaction
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield (0, seedTransaction_service_1.createSeedTransaction)(req.body);
        res.status(201).json({ success: true, data: transaction });
    }
    catch (error) {
        next(error);
    }
}));
// Get a seed transaction by ID
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield (0, seedTransaction_service_1.getTransactionById)(Number(req.params.id));
        res.status(200).json({ success: true, data: transaction });
    }
    catch (error) {
        next(error);
    }
}));
// Get all seed transactions
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield (0, seedTransaction_service_1.getTransactions)();
        res.status(200).json({ success: true, data: transactions });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
