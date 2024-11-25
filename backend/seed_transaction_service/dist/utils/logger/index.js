"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.logger = void 0;
const pino_http_1 = require("pino-http");
const pino_1 = __importDefault(require("pino"));
exports.logger = (0, pino_1.default)({
    level: "info",
    base: {
        serviceName: "catalog-service",
    },
    serializers: pino_1.default.stdSerializers,
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    transport: {
        target: "pino-pretty",
        level: "error",
    },
});
exports.httpLogger = (0, pino_http_1.pinoHttp)({
    level: "error",
    logger: exports.logger,
});
