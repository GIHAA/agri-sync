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
exports.transaction = exports.connect = exports.query = void 0;
const pg_1 = require("pg");
const config_1 = require("../config");
const pool = new pg_1.Pool(Object.assign({ connectionString: config_1.config.db.connectionString }, (config_1.config.db.connectionString
    ? {}
    : {
        user: config_1.config.db.user,
        host: config_1.config.db.host,
        database: config_1.config.db.name,
        password: config_1.config.db.password,
        port: config_1.config.db.port,
        max: config_1.config.db.pool.max || 10,
        min: config_1.config.db.pool.min || 2,
        idleTimeoutMillis: config_1.config.db.pool.idle || 10000,
    })));
const query = (text, params) => __awaiter(void 0, void 0, void 0, function* () {
    const start = Date.now();
    try {
        const result = yield pool.query(text, params);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV !== "production") {
            console.log("Executed query", { text, duration, rows: result.rowCount });
        }
        return result;
    }
    catch (error) {
        console.error("Database query error:", { text, error });
        throw error;
    }
});
exports.query = query;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield pool.connect();
        return client;
    }
    catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
});
exports.connect = connect;
const transaction = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield (0, exports.connect)();
    try {
        yield client.query("BEGIN");
        const result = yield callback(client);
        yield client.query("COMMIT");
        return result;
    }
    catch (error) {
        yield client.query("ROLLBACK");
        console.error("Transaction failed. Rolled back changes:", error);
        throw error;
    }
    finally {
        client.release();
    }
});
exports.transaction = transaction;
exports.default = { query: exports.query, connect: exports.connect, transaction: exports.transaction };
