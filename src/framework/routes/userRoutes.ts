import express from "express";
import userRepository from "../repository/userRepository";
import userController from "../../controller/userController";
import userUseCase from "../../usecase/UserUserCase";
import sendMail from "../services/SendMail";
import JwtTokenService from "../services/JwtToken";
import { isAuthenticated } from "../middlewares/UserAuth";

const userRouter = express.Router();
const repository = new userRepository();
const sendEmail = new sendMail();
const JwtToken = new JwtTokenService();
const userCase = new userUseCase(repository, sendEmail, JwtToken);
const controller = new userController(userCase);

userRouter.post("/user/registration", (req, res, next) => {
  controller.registerUser(req, res, next);
});
userRouter.post("/user/activate-user", (req, res, next) => {
  controller.activateUser(req, res, next);
});
userRouter.post("/user/login", (req, res, next) => {
  controller.loginUser(req, res, next);
});
userRouter.get("/user/logout", isAuthenticated, (req, res, next) => {
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
userRouter.get("/user/getCourseContent/:_id", isAuthenticated,(req, res, next) => {
  controller.getCourseContent(req, res, next);
});
userRouter.post("/user/create-order", isAuthenticated,(req, res, next) => {
  controller.createOrder(req, res, next);
});
userRouter.post("/user/create-premium-order", isAuthenticated, (req, res, next) => {
  controller.createPremiumOrder(req, res, next);
});

userRouter.get("/user/stripepublishablekey", (req, res, next) => {
  controller.sendStripePulishKey(req, res, next);
});

userRouter.post("/user/payment", isAuthenticated, (req, res, next) => {
  controller.newPayment(req, res, next);
});

userRouter.put("/user/add-question",isAuthenticated, (req, res, next) => {
  controller.addQuestion(req, res, next);
});

userRouter.put("/user/add-answer", isAuthenticated, (req, res, next) => {
  controller.replyToQestion(req, res, next);
});

userRouter.put("/user/add-review/:id", isAuthenticated, (req, res, next) => {
  controller.addReview(req, res, next);
});

userRouter.put("/user/add-chat", isAuthenticated, (req, res, next) => {
  controller.addChat(req, res, next);
});

userRouter.get("/user/get-chat/:id", isAuthenticated, (req, res, next) => {
  controller.getChat(req, res, next);
});

userRouter.get("/user/enrolled_courses/:id", isAuthenticated, (req, res, next) => {
  controller.getEnrolledCourses(req, res, next);
});

userRouter.put("/user/add-progress", isAuthenticated, (req, res, next) => {
  controller.addCourseProgress(req, res, next);
});







export default userRouter;
