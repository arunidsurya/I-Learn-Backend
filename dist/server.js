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
const app_1 = require("./framework/config/app");
const connnectDB_1 = require("./framework/config/connnectDB");
const cloudinary_1 = require("cloudinary");
require("dotenv").config();
const http_1 = __importDefault(require("http"));
const socketServer_1 = require("./framework/config/socketServer");
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const app = (0, app_1.createServer)();
        const server = http_1.default.createServer(app);
        //cloudinary config
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_SECRET_KEY,
        });
        (0, socketServer_1.initSocketServer)(server);
        const PORT = process.env.PORT;
        server === null || server === void 0 ? void 0 : server.listen(PORT, () => {
            console.log(`server is running at PORT : ${PORT}`);
        });
        yield (0, connnectDB_1.connectDB)();
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
