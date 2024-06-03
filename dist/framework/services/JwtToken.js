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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtTokenService {
    SignJwt(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({
                user,
            }, process.env.ACTIVATION_SECRET, {
                expiresIn: "15m",
            });
            return token;
        });
    }
    refreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({
                user,
            }, process.env.REFRESH_TOKEN, {
                expiresIn: "1d",
            });
            return token;
        });
    }
    SignTutorJwt(tutor) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({
                tutor,
            }, process.env.ACTIVATION_SECRET, {
                expiresIn: "1d",
            });
            return token;
        });
    }
    AdminSignJwt(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = jsonwebtoken_1.default.sign({
                    admin,
                }, process.env.ACTIVATION_SECRET, {
                    expiresIn: "1d",
                });
                return token;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    VerifyJwt(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwtToken = process.env.JWt_SECRET_KEY;
            const verified = jsonwebtoken_1.default.verify(token, jwtToken);
            return verified;
        });
    }
    otpGenerateJwt(user, activationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({
                user,
                activationCode,
            }, process.env.ACTIVATION_SECRET, {
                expiresIn: "5m",
            });
            return token;
        });
    }
    otpVerifyJwt(activationToken, activationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("Activation Token:", activationToken);
            // console.log("Activation Code:", activationCode);
            try {
                const decodedToken = jsonwebtoken_1.default.verify(activationToken, process.env.ACTIVATION_SECRET);
                // Validate if the decoded token matches the provided activation code
                if (decodedToken.activationCode === activationCode) {
                    return decodedToken;
                }
                else {
                    // If activation code doesn't match, return null
                    return null;
                }
            }
            catch (error) {
                // If verification fails, return null
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = JwtTokenService;
