"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const userController_1 = __importDefault(require("../../controller/userController"));
const UserUserCase_1 = __importDefault(require("../../usecase/UserUserCase"));
const SendMail_1 = __importDefault(require("../services/SendMail"));
const JwtToken_1 = __importDefault(require("../services/JwtToken"));
const UserAuth_1 = require("../middlewares/UserAuth");
const premiumAccountAuth_1 = require("../middlewares/premiumAccountAuth");
const userRouter = express_1.default.Router();
const repository = new userRepository_1.default();
const sendEmail = new SendMail_1.default();
const JwtToken = new JwtToken_1.default();
const userCase = new UserUserCase_1.default(repository, sendEmail, JwtToken);
const controller = new userController_1.default(userCase);
userRouter.post("/user/registration", (req, res, next) => {
    controller.registerUser(req, res, next);
});
userRouter.post("/user/activate-user", (req, res, next) => {
    controller.activateUser(req, res, next);
});
userRouter.post("/user/login", (req, res, next) => {
    controller.loginUser(req, res, next);
});
userRouter.post("/user/new-login", (req, res, next) => {
    controller.loginUser(req, res, next);
});
userRouter.get("/user/logout", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.logoutUser(req, res, next);
});
userRouter.post("/user/forgot_password_otp", (req, res, next) => {
    controller.forgotPasswordOtp(req, res, next);
});
userRouter.post("/user/forgot_password_approve", (req, res, next) => {
    controller.forgotPasswordApproval(req, res, next);
});
userRouter.post("/user/forgot_password_confirm", (req, res, next) => {
    controller.forgotPasswordConfirm(req, res, next);
});
userRouter.put("/user/update_user_info", (req, res, next) => {
    controller.upadteUserInfo(req, res, next);
});
userRouter.put("/user/update_user_password", (req, res, next) => {
    controller.upadteUserpassword(req, res, next);
});
userRouter.post("/user/google_signin", (req, res, next) => {
    controller.googleLogin(req, res, next);
});
userRouter.get("/user/courses", (req, res, next) => {
    controller.getAllCourses(req, res, next);
});
userRouter.get("/user/getCourse/:_id", (req, res, next) => {
    controller.getCourse(req, res, next);
});
userRouter.get("/user/getCourseContent/:_id", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.getCourseContent(req, res, next);
});
userRouter.post("/user/create-order", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.createOrder(req, res, next);
});
userRouter.post("/user/create-premium-order", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.createPremiumOrder(req, res, next);
});
userRouter.get("/user/stripepublishablekey", (req, res, next) => {
    controller.sendStripePulishKey(req, res, next);
});
userRouter.post("/user/payment", (req, res, next) => {
    controller.newPayment(req, res, next);
});
userRouter.put("/user/add-question", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.addQuestion(req, res, next);
});
userRouter.put("/user/add-answer", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.replyToQestion(req, res, next);
});
userRouter.put("/user/add-review/:id", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.addReview(req, res, next);
});
userRouter.put("/user/add-chat", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.addChat(req, res, next);
});
userRouter.get("/user/get-chat/:id", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.getChat(req, res, next);
});
userRouter.get("/user/enrolled_courses/:id", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.getEnrolledCourses(req, res, next);
});
userRouter.put("/user/add-progress", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.addCourseProgress(req, res, next);
});
userRouter.get("/user/get-premiumOffers", UserAuth_1.isAuthenticated, (req, res, next) => {
    controller.getPremiumOffers(req, res, next);
});
userRouter.get("/user/get-videocall-credentials", UserAuth_1.isAuthenticated, premiumAccountAuth_1.isPremium, (req, res, next) => {
    controller.getVieoCallCredentials(req, res, next);
});
userRouter.post("/user/get-search-result", (req, res, next) => {
    controller.getSearchResult(req, res, next);
});
userRouter.post("/user/get-courses-by_category", (req, res, next) => {
    controller.getCoursesByCategory(req, res, next);
});
userRouter.get("/user/get-categories", (req, res, next) => {
    controller.getCategories(req, res, next);
});
exports.default = userRouter;
