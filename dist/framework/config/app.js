"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const tutorRoutes_1 = __importDefault(require("../routes/tutorRoutes"));
const errorRouter_1 = __importDefault(require("../routes/errorRouter"));
const errorHandler_1 = __importDefault(require("../middlewares/errorHandler"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        const corsOptions = {
            origin: process.env.ORIGIN || "*",
            credentials: true,
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
            allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
            optionsSuccessStatus: 200,
        };
        // Apply CORS middleware
        app.use((0, cors_1.default)(corsOptions));
        // Manually add CORS headers for debugging
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN || "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            next();
        });
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        // Define routes
        app.use("/api/v1", userRoutes_1.default);
        app.use("/api/v1", adminRoutes_1.default);
        app.use("/api/v1", tutorRoutes_1.default);
        // Error handling routes
        app.use("*", errorRouter_1.default);
        app.use(errorHandler_1.default);
        return app;
    }
    catch (error) {
        console.log("Error creating server:", error);
    }
};
exports.default = createServer;
