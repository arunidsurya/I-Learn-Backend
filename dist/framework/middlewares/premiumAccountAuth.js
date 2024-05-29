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
exports.isPremium = void 0;
const redis_1 = require("../config/redis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isPremium = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access_token = req.cookies.access_token;
        const refresh_token = req.cookies.refresh_token;
        const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACTIVATION_SECRET);
        const userEmail = decoded.user.email;
        const userData = yield redis_1.redis.get(`user-${userEmail}`);
        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        const user = JSON.parse(userData);
        if (!user.premiumAccount) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        return next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.isPremium = isPremium;
