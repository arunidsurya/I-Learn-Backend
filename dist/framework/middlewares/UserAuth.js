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
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const redis_1 = require("../config/redis");
const userModel_1 = __importDefault(require("../database/userModel"));
require("dotenv").config();
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const access_token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const refresh_token = req.cookies.refresh_token;
    // console.log("access_token:", access_token);
    if (!access_token) {
        console.log("un authorized-1");
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized - No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACTIVATION_SECRET);
        // Proceed if the access token is valid
        const userEmail = decoded.user.email;
        const user = yield redis_1.redis.get(`user-${userEmail}`);
        const currentUserData = yield userModel_1.default.findOne({ email: userEmail });
        if (currentUserData === null || currentUserData === void 0 ? void 0 : currentUserData.isBlocked) {
            console.log("un authorized-2");
            return res
                .status(401)
                .send({ success: false, message: "Profile is blocked" });
        }
        if (!user) {
            console.log("un authorized-3");
            return res
                .status(401)
                .send({ success: false, message: "User not found" });
        }
        req.user = JSON.parse(user);
        return next();
    }
    catch (error) {
        // Handle TokenExpiredError
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            if (!refresh_token) {
                console.log("un authorized-4");
                return res
                    .status(401)
                    .send({ success: false, message: "Unauthorized - Invalid token" });
            }
            try {
                const refreshDecoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
                const userEmail = refreshDecoded.user.email;
                const user = yield redis_1.redis.get(`user-${userEmail}`);
                if (!user) {
                    console.log("un authorized-5");
                    return res
                        .status(401)
                        .send({ success: false, message: "User not found" });
                }
                const newAccessToken = jsonwebtoken_1.default.sign({ user: JSON.parse(user) }, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
                // Store the new access token in res.locals
                res.locals.newAccessToken = newAccessToken;
                req.user = JSON.parse(user);
                return next();
            }
            catch (refreshError) {
                console.log("un authorized-6");
                return res
                    .status(401)
                    .send({ success: false, message: "Unauthorized - Invalid token" });
            }
        }
        console.error(error);
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
    }
});
exports.isAuthenticated = isAuthenticated;
