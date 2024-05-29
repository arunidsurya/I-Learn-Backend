"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(err.status).json({
            error: {
                message: err.message,
            },
        });
    }
    else {
        res.status(500).json({
            error: {
                message: "Internal Server Error",
            },
        });
    }
};
exports.default = errorHandler;
