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
exports.isTutuorAuthorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../config/redis");
require("dotenv").config();
const isTutuorAuthorized = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tutor_token = req.cookies.tutor_token;
    // console.log("access_token:", admin_accessToken);
    if (!tutor_token) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized - No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(tutor_token, process.env.ACTIVATION_SECRET);
        // console.log(decoded);
        if (!decoded) {
            return res
                .status(401)
                .send({ success: false, message: "Unauthorized - Invalid token" });
        }
        // console.log(decoded.user.email);
        const tutor = yield redis_1.redis.get(`tutor-${decoded.tutor.email}`);
        // tutor-${tutor.email}
        // console.log(user);
        if (!tutor) {
            return res
                .status(401)
                .send({ success: false, message: "Tutor not found" });
        }
        else {
            req.tutor = JSON.parse(tutor);
            next();
        }
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .send({ success: false, message: "Internal Server Error" });
    }
});
exports.isTutuorAuthorized = isTutuorAuthorized;
