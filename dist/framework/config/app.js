"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const tutorRoutes_1 = __importDefault(require("../routes/tutorRoutes"));
const errorRouter_1 = __importDefault(require("../routes/errorRouter"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
require("dotenv").config();
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, express_1.urlencoded)({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            origin: process.env.ORIGIN,
            credentials: true,
        }));
        app.use("/api/v1", userRoutes_1.default);
        app.use("/api/v1", adminRoutes_1.default);
        app.use("/api/v1", tutorRoutes_1.default);
        app.use("*", errorRouter_1.default);
        app.use(errorHandler_1.default);
        return app;
    }
    catch (error) {
        console.log("error");
    }
};
exports.createServer = createServer;
