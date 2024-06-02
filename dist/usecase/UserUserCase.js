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
const SendMail_1 = __importDefault(require("../framework/services/SendMail"));
class userUserCase {
    constructor(iuserRepository, sendEmail, JwtToken) {
        this.iUserRepository = iuserRepository;
        this.sendEmail = sendEmail;
        this.JwtToken = JwtToken;
    }
    registrationUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = user.email;
                // console.log(email);
                const isEmailExist = yield this.iUserRepository.findByEmail(email);
                if (isEmailExist) {
                    return { success: false, message: "Email already exists" };
                }
                const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
                const activationTokenPromise = this.JwtToken.otpGenerateJwt(user, activationCode);
                const activationToken = yield activationTokenPromise;
                const subject = "Please find the below otp to activate your account";
                const sendmail = this.sendEmail.sendMail({
                    email,
                    subject,
                    activationCode,
                });
                if (SendMail_1.default) {
                    return {
                        status: 201,
                        success: true,
                        message: "Please check your email to activate your account",
                        activationToken,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    activateUser(activationCode, activationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.JwtToken.otpVerifyJwt(activationToken, activationCode);
                if (!newUser) {
                    return {
                        status: 500,
                        success: false,
                        message: "Token expired,Please register again",
                    };
                }
                // console.log(newUser.user);
                const savedUser = yield this.iUserRepository.createUser(newUser.user);
                // console.log("saveduser :", savedUser);
                if (!savedUser) {
                    return {
                        status: 500,
                        success: false,
                        message: "internal error, please try again later",
                    };
                }
                return { savedUser, success: true };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Reached usecase");
                const user = yield this.iUserRepository.findByEmail(email);
                if (!user) {
                    console.log("no user found");
                    return {
                        status: 500,
                        success: false,
                        message: "Invalid email or password!!",
                    };
                }
                else if (user.isBlocked) {
                    console.log("user is blocked");
                    return {
                        status: 500,
                        success: false,
                        message: "Account suspended!!, please contact Admin",
                    };
                }
                const proToken = yield this.iUserRepository.loginUser(user, email, password);
                if (proToken === null) {
                    console.log("invalid email or paddword");
                    return {
                        status: 500,
                        success: false,
                        message: "Invalid email or password!!",
                    };
                }
                const { access_token, refresh_token } = proToken;
                return { status: 201, success: true, user, access_token, refresh_token };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPasswordOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.iUserRepository.isLoggedEmail(email);
            if (!user) {
                return {
                    status: 500,
                    success: false,
                    message: "Invalid email address!",
                };
            }
            // console.log("user :", user);
            const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
            const activationTokenPromise = this.JwtToken.otpGenerateJwt(user, activationCode);
            const activationToken = yield activationTokenPromise;
            const subject = "Please find the below otp to confirm your account";
            const sendmail = this.sendEmail.sendMail({
                email,
                subject,
                activationCode,
            });
            if (SendMail_1.default) {
                return {
                    status: 201,
                    success: true,
                    message: "Please check your email to confirm your account",
                    activationToken,
                    email,
                };
            }
        });
    }
    forgotPasswordApproval(activationCode, activationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.JwtToken.otpVerifyJwt(activationToken, activationCode);
                if (!newUser) {
                    return {
                        status: 500,
                        success: false,
                        message: "Token expired,Please register again",
                    };
                }
                // console.log(newUser.user);
                return {
                    status: 201,
                    success: true,
                    message: "otp verified successfully",
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPasswordConfirm(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.iUserRepository.forgotPasswordConfirm(email, newPassword);
                if (!user) {
                    return {
                        status: 500,
                        success: false,
                        message: "password change unsccessfull, please try agin later",
                    };
                }
                else {
                    return {
                        status: 201,
                        success: true,
                        message: "password changed successfully, please proceed to login page",
                        user,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateUserInfo(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.iUserRepository.updateUserinfo(userData);
                // console.log(user);
                if (!user) {
                    return {
                        status: 500,
                        success: false,
                        message: "Account updation unsuccessfull, Please try again later",
                        user,
                    };
                }
                return {
                    status: 201,
                    success: true,
                    message: "Account updated successfully",
                    user,
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    upadteUserpassword(oldPassword, newPassword, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.iUserRepository.updateUserPassword(oldPassword, newPassword, email);
                // console.log("user :", user);
                if (user === null) {
                    return {
                        status: 500,
                        success: false,
                        message: "Account updation unsuccessfull, Please try again later",
                        user,
                    };
                }
                return {
                    status: 201,
                    success: true,
                    message: "Password updated successfully",
                    user,
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    googleAuth(name, email, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isEmailExist = yield this.iUserRepository.findByEmail(email);
                // console.log(isEmailExist);
                if (isEmailExist) {
                    const proToken = yield this.iUserRepository.googleLogin(isEmailExist);
                    if (proToken) {
                        const { access_token, refresh_token } = proToken;
                        return {
                            status: 201,
                            success: true,
                            user: isEmailExist,
                            access_token,
                            refresh_token,
                        };
                    }
                }
                else {
                    const savedUserDetails = yield this.iUserRepository.googleSignup(name, email, avatar);
                    if (savedUserDetails) {
                        return {
                            status: 201,
                            success: true,
                            user: savedUserDetails.savedUser,
                            access_token: savedUserDetails.access_token,
                            refresh_toke: savedUserDetails.refresh_token,
                        };
                    }
                    else {
                        return {
                            status: 500,
                            success: false,
                            message: "Login failed, Please try again later",
                        };
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.iUserRepository.getAllCourses();
                if (courses === null) {
                    return null;
                }
                else {
                    return {
                        courses,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCourse(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.iUserRepository.getCourse(_id);
                if (course === null) {
                    return null;
                }
                else {
                    return {
                        course,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCourseContent(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.iUserRepository.getCourseContent(_id);
                if (course === null) {
                    return null;
                }
                else {
                    return {
                        course,
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createOrder(userId, courseId, payment_info) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.iUserRepository.createOrder(userId, courseId, payment_info);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    createPremiumOrder(userId, payment_info) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.iUserRepository.createPremiumOrder(userId, payment_info);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addQuestion(user, question, courseId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iUserRepository.addQuestion(user, question, courseId, contentId);
                return result;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    replyToQuestion(user, answer, courseId, contentId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iUserRepository.replyToQuestion(user, answer, courseId, contentId, questionId);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addReview(userEmail, courseId, userId, review, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.iUserRepository.addReview(userEmail, courseId, userId, review, rating);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addChat(userName, userId, message, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.iUserRepository.addChat(userName, userId, message, courseId);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getChat(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.iUserRepository.getChat(courseId);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getEnrolledCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.iUserRepository.getErolledCourses(userId);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addCourseProgress(userId, courseId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iUserRepository.addCourseProgres(userId, courseId, contentId);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getPremiumOffers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const premiumOffers = yield this.iUserRepository.getPremiumOffers();
                return premiumOffers;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getSearchResult(searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iUserRepository.getSearchResult(searchKey);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getCoursesByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.iUserRepository.getCoursesByCategory(category);
                return courses;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.iUserRepository.getCategories();
                return categories;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
exports.default = userUserCase;
