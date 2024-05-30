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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../framework/config/redis");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
class userController {
    constructor(userCase) {
        this.userCase = userCase;
    }
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                //   console.log(userData);
                const user = yield this.userCase.registrationUser(userData);
                res.json({ user, success: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    activateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationCode = req.body.activation_code;
                const activationToken = req.body.activation_token;
                //   console.log(userData);
                const user = yield this.userCase.activateUser(activationCode, activationToken);
                res.status(201).json({
                    user,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const data = yield this.userCase.loginUser(email, password);
                // console.log("data :", data);
                if (data === null || data === void 0 ? void 0 : data.success) {
                    res.cookie("access_token", data.access_token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                    });
                    res.cookie("refresh_token", data.refresh_token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                    });
                    // res.cookie("access_token", data.access_token);
                    // res.cookie("refresh_token", data.refresh_token);
                    res.status(201).json({ data });
                }
                else {
                    res.json({ data });
                }
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "An error occurred",
                });
            }
        });
    }
    logoutUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                res.cookie("access_token", "", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1,
                });
                res.cookie("refresh_token", "", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1,
                });
                // res.cookie("access_token", "", { maxAge: 1 });
                // res.cookie("refresh_token", "", { maxAge: 1 });
                const email = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || "";
                redis_1.redis.del(`user-${email}`);
                res.status(200).json({
                    success: true,
                    message: "Logged out successfully",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPasswordOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                // console.log(email);
                const result = yield this.userCase.forgotPasswordOtp(email);
                res.status(201).json(result);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPasswordApproval(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationCode = req.body.activation_code;
                const activationToken = req.body.activation_token;
                //   console.log(userData);
                const result = yield this.userCase.forgotPasswordApproval(activationCode, activationToken);
                // console.log(result);
                res.json(result);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPasswordConfirm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, newPassword } = req.body;
                const result = yield this.userCase.forgotPasswordConfirm(email, newPassword);
                res.status(201).json(result);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    upadteUserInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = req.body;
            try {
                const user = yield this.userCase.updateUserInfo(userData);
                if (!user) {
                    return res
                        .status(400)
                        .json({ success: false, message: "No file uploaded" });
                }
                res.status(201).json({ user });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    upadteUserpassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldPassword, newPassword, email } = req.body;
                const user = yield this.userCase.upadteUserpassword(oldPassword, newPassword, email);
                // console.log(user);
                if (user && !user.success) {
                    return res.json({
                        success: false,
                        status: 400,
                        message: "Account updation unsuccessful. Please try again later.",
                    });
                }
                // Assuming update was successful, return a 200 status with the updated user data
                res.status(200).json({ success: true, user });
            }
            catch (error) {
                console.log(error);
                // Handle other errors, if any
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error." });
            }
        });
    }
    googleLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, avatar } = req.body;
                const data = yield this.userCase.googleAuth(name, email, avatar);
                if (data === null || data === void 0 ? void 0 : data.success) {
                    res.cookie("access_token", data.access_token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                    });
                    res.cookie("refresh_token", data.refresh_token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                    });
                    // res.cookie("access_token", data.access_token);
                    // res.cookie("refresh_token", data.refresh_token);
                    res.status(201).json({ data });
                }
                else {
                    res.json({ data });
                }
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "An error occurred",
                });
            }
        });
    }
    getAllCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userCase.getAllCourses();
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "No courses found",
                    });
                }
                res.json({ result, success: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.params;
                const result = yield this.userCase.getCourse(_id);
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "No courses found",
                    });
                }
                res.json({ result, success: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCourseContent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
                const { _id } = req.params;
                const result = yield this.userCase.getCourseContent(_id);
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "No courses found",
                    });
                }
                res.json({ result, success: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId, payment_info } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                if (!userId) {
                    return res.json({
                        success: false,
                        message: "Pleae Login to access this functionality",
                    });
                }
                if (payment_info) {
                    if ("id" in payment_info) {
                        const paymentIntentId = payment_info.id;
                        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
                        if (paymentIntent.status !== "succeeded") {
                            return res.json({
                                success: false,
                                message: "Payment not authorized!",
                            });
                        }
                    }
                }
                const result = yield this.userCase.createOrder(userId, courseId, payment_info);
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "you have already Purchased this course ",
                    });
                }
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "No course found !!",
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "order created successfully",
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    sendStripePulishKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
            });
        });
    }
    newPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create the payment intent with shipping information
                const myPayment = yield stripe.paymentIntents.create({
                    amount: req.body.amount,
                    currency: "usd",
                    metadata: {
                        company: "E-Learning",
                    },
                    description: "Payment for E-Learning Course",
                    // customer: customer.id, // Assign the created customer to the payment intent
                    automatic_payment_methods: {
                        enabled: true,
                    },
                });
                res.status(201).json({
                    success: true,
                    client_secret: myPayment.client_secret,
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ success: false, error: "Internal server error" });
            }
        });
    }
    addQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (user) {
                    const { question, courseId, contentId } = req.body;
                    const result = yield this.userCase.addQuestion(user, question, courseId, contentId);
                    if (result === false) {
                        return res.json({
                            success: false,
                            message: "invalid content Id",
                        });
                    }
                    return res.json({
                        success: true,
                        message: "Question added successfully",
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    replyToQestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (user) {
                    const { answer, courseId, contentId, questionId } = req.body;
                    const result = yield this.userCase.replyToQuestion(user, answer, courseId, contentId, questionId);
                    if (result === false) {
                        return res.json({
                            success: false,
                            message: "Internal server error.Please try again later",
                        });
                    }
                    return res.status(201).json({
                        success: true,
                        mesage: "Reply added successfully",
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { review, rating } = req.body;
                const courseId = req.params.id;
                const userEmail = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || null;
                const userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id) || "";
                const result = yield this.userCase.addReview(userEmail, courseId, userId, review, rating);
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "Error submitting review!! please try agian later",
                    });
                }
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "Review Already addded",
                    });
                }
                return res.json({
                    success: true,
                    message: "Review added successfully",
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, userId, message, courseId } = req.body;
            try {
                const result = yield this.userCase.addChat(userName, userId, message, courseId);
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "Internal server error!!. Please try again later",
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "chat saved successfully",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = req.params.id;
            try {
                const result = yield this.userCase.getChat(courseId);
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "internal server error, please try again later",
                    });
                }
                return res.json({
                    success: true,
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getEnrolledCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const result = yield this.userCase.getEnrolledCourses(userId);
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "internal server error, please try again later",
                    });
                }
                return res.json({
                    success: true,
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createPremiumOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { payment_info } = req.body;
                // console.log(payment_info);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                if (!userId) {
                    return res.json({
                        success: false,
                        message: "Pleae Login to access this functionality",
                    });
                }
                if (payment_info) {
                    if ("id" in payment_info) {
                        const paymentIntentId = payment_info.id;
                        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
                        if (paymentIntent.status !== "succeeded") {
                            console.log("not succeeded");
                            return res.json({
                                success: false,
                                message: "Payment not authorized!",
                            });
                        }
                    }
                }
                const result = yield this.userCase.createPremiumOrder(userId, payment_info);
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "you have already Purchased this course ",
                    });
                }
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "No course found !!",
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "order created successfully",
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addCourseProgress(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { courseId, contentId } = req.body;
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || "";
                const result = yield this.userCase.addCourseProgress(userId, courseId, contentId);
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "invalid content Id",
                    });
                }
                return res.json({
                    success: true,
                    message: "Review added successfully",
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getPremiumOffers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const premiumOffers = yield this.userCase.getPremiumOffers();
            if (premiumOffers === false) {
                return res.json({
                    success: false,
                    message: "no premium Offer found",
                });
            }
            return res.json({
                success: true,
                message: "premium offeres are received successfully",
                premiumOffers,
            });
        });
    }
    getVieoCallCredentials(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appID = process.env.ZEGOCLOUD_APP_ID;
                const serverSecret = process.env.ZEGOCLOUD_SERVER_SECRET;
                res.status(200).json({
                    success: true,
                    appID,
                    serverSecret,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getSearchResult(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchKey } = req.body;
            try {
                const result = yield this.userCase.getSearchResult(searchKey);
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "internal server error, please try again later",
                    });
                }
                return res.json({
                    success: true,
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCoursesByCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category } = req.body;
            try {
                const result = yield this.userCase.getCoursesByCategory(category);
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "No coureses found",
                    });
                }
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "internal server error, please try again later",
                    });
                }
                return res.json({
                    success: true,
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userCase.getCategories();
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "No categories found",
                    });
                }
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "internal server error, please try again later",
                    });
                }
                return res.json({
                    success: true,
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = userController;
