"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.AuthorizeError = exports.ValidationError = exports.APIError = void 0;
const status_codes_1 = require("./status-codes");
class BaseError extends Error {
    constructor(name, status, description) {
        super(description);
        this.name = name;
        this.status = status;
        this.message = description;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
// 500 Internal Error
class APIError extends BaseError {
    constructor(description = "api error") {
        super("api internal server error", status_codes_1.STATUS_CODES.INTERNAL_ERROR, description);
    }
}
exports.APIError = APIError;
// 400 Validation Error
class ValidationError extends BaseError {
    constructor(description = "bad request") {
        super("bad request", status_codes_1.STATUS_CODES.BAD_REQUEST, description);
    }
}
exports.ValidationError = ValidationError;
// 403 Authorize error
class AuthorizeError extends BaseError {
    constructor(description = "access denied") {
        super("access denied", status_codes_1.STATUS_CODES.UN_AUTHORISED, description);
    }
}
exports.AuthorizeError = AuthorizeError;
// 404 Not Found
class NotFoundError extends BaseError {
    constructor(description = "not found") {
        super(description, status_codes_1.STATUS_CODES.NOT_FOUND, description);
    }
}
exports.NotFoundError = NotFoundError;
