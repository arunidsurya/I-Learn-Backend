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
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("../config/redis");
const userModel_1 = __importDefault(require("../database/userModel"));
const JwtToken_1 = __importDefault(require("../services/JwtToken"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const CourseModel_1 = __importDefault(require("../database/CourseModel"));
const orderModel_1 = __importDefault(require("../database/orderModel"));
const notificationModel_1 = __importDefault(require("../database/notificationModel"));
const courseData_1 = __importDefault(require("../database/courseData"));
const liveChat_1 = __importDefault(require("../database/liveChat"));
const PremiumOrderModel_1 = __importDefault(require("../database/PremiumOrderModel"));
const PremiumAccountSchema_1 = __importDefault(require("../database/PremiumAccountSchema"));
const CategoryModel_1 = __importDefault(require("../database/CategoryModel"));
class userRepository {
    constructor() {
        this.JwtToken = new JwtToken_1.default();
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isEmailExist = yield userModel_1.default.findOne({ email }).select("+password");
            // console.log("isEmailExist:", isEmailExist);
            return isEmailExist;
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, gender, password } = user;
                const savedUser = yield userModel_1.default.create({
                    name,
                    email,
                    gender,
                    password,
                    isVerified: true,
                });
                return savedUser;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    loginUser(user, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPasswordMatch = yield user.comparePassword(password);
                // console.log("match:", isPasswordMatch);
                if (!isPasswordMatch) {
                    // Check if password does not match
                    return null; // Return null if password does not match
                }
                else {
                    const access_token = yield this.JwtToken.SignJwt(user);
                    const refresh_token = yield this.JwtToken.refreshToken(user);
                    redis_1.redis.set(`user-${user.email}`, JSON.stringify(user));
                    // console.log(token);
                    return { access_token, refresh_token };
                }
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    isLoggedEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield userModel_1.default.findOne({ email });
            return userData;
        });
    }
    forgotPasswordConfirm(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findOne({ email: email });
                if (!user) {
                    // Handle the case where the user is not found
                    return null;
                }
                user.password = newPassword;
                yield user.save();
                redis_1.redis.set(user.email, JSON.stringify(user));
                return user;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    updateUserinfo(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { _id, name, email, avatar } = userData;
                const user = yield userModel_1.default.findOne({ _id });
                if (!user) {
                    return null;
                }
                if (avatar && user) {
                    if ((_a = user.avatar) === null || _a === void 0 ? void 0 : _a.public_id) {
                        yield cloudinary_1.default.uploader.destroy(user.avatar.public_id);
                        const uploadRes = yield cloudinary_1.default.uploader.upload(avatar, {
                            upload_preset: "E_Learning",
                            folder: "avatars",
                        });
                        user.name = name || user.name;
                        user.email = email || user.email;
                        user.avatar = {
                            url: uploadRes.secure_url,
                            public_id: uploadRes.public_id,
                        };
                    }
                    else {
                        const uploadRes = yield cloudinary_1.default.uploader.upload(avatar, {
                            upload_preset: "E_Learning",
                            folder: "avatars",
                        });
                        user.name = name;
                        user.email = email;
                        user.avatar = {
                            url: uploadRes.secure_url,
                            public_id: uploadRes.public_id,
                        };
                    }
                }
                if (!avatar && user) {
                    user.name = name || user.name;
                    user.email = email || user.email;
                }
                yield user.save();
                return user;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    updateUserPassword(oldPassword, newPassword, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(email);
                const user = yield userModel_1.default.findOne({ email }).select("+password");
                // console.log(user);
                if (!user) {
                    return null;
                }
                const isOldPasswordMatch = yield (user === null || user === void 0 ? void 0 : user.comparePassword(oldPassword));
                // console.log(isOldPasswordMatch);
                if (!isOldPasswordMatch) {
                    return null;
                }
                user.password = newPassword;
                yield user.save();
                redis_1.redis.set(user.email, JSON.stringify(user));
                return user;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    googleLogin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const access_token = yield this.JwtToken.SignJwt(user);
                const refresh_token = yield this.JwtToken.refreshToken(user);
                redis_1.redis.set(user.email, JSON.stringify(user));
                // console.log(token);
                return { access_token, refresh_token };
            }
            catch (error) {
                return null;
            }
        });
    }
    googleSignup(name, email, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(name, email, avatar);
                // Check if name and email are provided
                if (!name || !email) {
                    throw new Error("Name and email are required");
                }
                const generatedPassword = Math.random().toString(36).slice(-8) +
                    Math.random().toString(36).slice(-8);
                const generatedPublicId = Math.random().toString(36).slice(-8);
                const savedUser = yield userModel_1.default.create({
                    name,
                    email,
                    gender: "not specified",
                    avatar: {
                        url: avatar,
                        public_id: generatedPublicId,
                    },
                    password: generatedPassword,
                    isVerified: true,
                });
                const access_token = yield this.JwtToken.SignJwt(savedUser);
                const refresh_token = yield this.JwtToken.refreshToken(savedUser);
                redis_1.redis.set(savedUser.email, JSON.stringify(savedUser));
                return { savedUser, access_token, refresh_token };
                return null;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.default.find({ approved: true })
                    .sort({ createdAt: -1 })
                    .exec();
                if (courses) {
                    return courses;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getCourse(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(_id);
                const course = yield CourseModel_1.default.findById(_id)
                    .populate("courseData")
                    .exec();
                if (course) {
                    return course;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getCourseContent(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(_id);
                const course = yield CourseModel_1.default.findById(_id)
                    .populate("courseData")
                    .exec();
                if (course) {
                    return course;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    createOrder(userId, courseId, payment_info) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("courseId:", courseId);
                // console.log("userId:", userId);
                // console.log("paymentInfo:", payment_info);
                const user = yield userModel_1.default.findById(userId);
                const courseExistInUser = user === null || user === void 0 ? void 0 : user.courses.some((course) => course === courseId);
                if (courseExistInUser) {
                    return null;
                }
                const course = yield CourseModel_1.default.findById(courseId);
                if (!course) {
                    return false;
                }
                const data = {
                    courseId,
                    userId,
                    payment_info,
                };
                const newOrder = yield orderModel_1.default.create(data);
                user === null || user === void 0 ? void 0 : user.courses.push(course === null || course === void 0 ? void 0 : course._id);
                user === null || user === void 0 ? void 0 : user.courseProgress.push({
                    courseId: course._id.toString(),
                    sectionId: [],
                });
                redis_1.redis.set(`user-${user === null || user === void 0 ? void 0 : user.email}`, JSON.stringify(user));
                yield (user === null || user === void 0 ? void 0 : user.save());
                yield notificationModel_1.default.create({
                    userId: user === null || user === void 0 ? void 0 : user._id,
                    title: "New Order",
                    message: `You hava a new order from ${course === null || course === void 0 ? void 0 : course.courseTitle}`,
                });
                course.purchased = +1;
                yield course.save();
                return { newOrder, user };
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addQuestion(user, question, courseId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const course = yield CourseModel_1.default.findById(courseId);
                if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                    console.log("invalid contentId");
                    return false;
                }
                const courseContent = (_a = course === null || course === void 0 ? void 0 : course.courseData) === null || _a === void 0 ? void 0 : _a.find((item) => item._id.equals(contentId));
                if (!courseContent) {
                    return false;
                }
                const courseContentData = yield courseData_1.default.findById(contentId);
                if (!courseContentData) {
                    return false;
                }
                const newQuestion = {
                    user,
                    question,
                    questionReplies: [],
                };
                (_b = courseContentData.questions) === null || _b === void 0 ? void 0 : _b.push(newQuestion);
                yield courseContentData.save();
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    replyToQuestion(user, answer, courseId, contentId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const course = yield CourseModel_1.default.findById(courseId);
                if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
                    console.log("invalid contentId");
                    return false;
                }
                const courseContent = (_a = course === null || course === void 0 ? void 0 : course.courseData) === null || _a === void 0 ? void 0 : _a.find((item) => item._id.equals(contentId));
                if (!courseContent) {
                    return false;
                }
                const courseContentData = yield courseData_1.default.findById(contentId);
                if (!courseContentData) {
                    return false;
                }
                const question = (_b = courseContentData === null || courseContentData === void 0 ? void 0 : courseContentData.questions) === null || _b === void 0 ? void 0 : _b.find((item) => item._id.equals(questionId));
                if (!question) {
                    return false;
                }
                // console.log(user);
                const newAnswer = {
                    user,
                    answer,
                };
                question.questionReplies.push(newAnswer);
                yield courseContentData.save();
                return true;
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
                const userData = yield redis_1.redis.get(`user-${userEmail}`);
                if (userData === null) {
                    console.log("no user data found");
                    return false;
                }
                const user = JSON.parse(userData);
                // console.log(user?.courses);
                const userCourseList = user === null || user === void 0 ? void 0 : user.courses;
                const courseExists = userCourseList === null || userCourseList === void 0 ? void 0 : userCourseList.some((course_id) => course_id.toString() === courseId.toString());
                if (!courseExists) {
                    console.log("no course found");
                    return false;
                }
                const course = yield CourseModel_1.default.findById(courseId);
                if (course) {
                    for (let review of course === null || course === void 0 ? void 0 : course.reviews) {
                        let presentUser = review.user;
                        if (presentUser && presentUser._id === user._id) {
                            return null;
                        }
                    }
                }
                const reviewData = {
                    user: user,
                    comment: review,
                    rating,
                };
                course === null || course === void 0 ? void 0 : course.reviews.push(reviewData);
                let avg = 0;
                course === null || course === void 0 ? void 0 : course.reviews.forEach((rev) => {
                    avg += rev.rating;
                });
                if (course) {
                    course.ratings = avg / course.reviews.length;
                }
                yield (course === null || course === void 0 ? void 0 : course.save());
                yield notificationModel_1.default.create({
                    userId: userId,
                    title: "New Review Added",
                    message: `${user.name} has posted a review in ${course === null || course === void 0 ? void 0 : course.courseTitle}`,
                });
                return course;
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
                const course = yield CourseModel_1.default.findById(courseId);
                if (!course) {
                    return false;
                }
                const chatData = {
                    userName,
                    userId,
                    message,
                };
                const savedChat = yield liveChat_1.default.create(chatData);
                course.chat.push(savedChat._id);
                yield course.save();
                return true;
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
                const course = yield CourseModel_1.default.findById(courseId)
                    .populate("chat")
                    .exec();
                return course;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getErolledCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById(userId);
                if (!user) {
                    return null;
                }
                const courses = user.courses;
                // console.log(courses);
                const enrolled_courses = yield CourseModel_1.default.find({
                    _id: { $in: courses },
                });
                // console.log(enrolled_courses);
                return enrolled_courses;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    createPremiumOrder(userId, payment_info) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("userId:", userId);
                // console.log("paymentInfo:", payment_info);
                const user = yield userModel_1.default.findById(userId);
                if (user === null || user === void 0 ? void 0 : user.premiumAccount) {
                    return null;
                }
                const data = {
                    userId,
                    payment_info,
                };
                const newOrder = yield PremiumOrderModel_1.default.create(data);
                // console.log(newOrder);
                if (user) {
                    user.premiumAccount = true;
                    const updatedUser = yield user.save();
                    redis_1.redis.set(`user-${user === null || user === void 0 ? void 0 : user.email}`, JSON.stringify(updatedUser));
                }
                yield notificationModel_1.default.create({
                    userId: user === null || user === void 0 ? void 0 : user._id,
                    title: "New Premium Order",
                    message: `You hava a new order from ${user === null || user === void 0 ? void 0 : user.name}`,
                });
                return { newOrder, user };
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addCourseProgres(userId, courseId, contentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.findById(userId);
                if (!user) {
                    return false;
                }
                if (user.courseProgress.length === 0) {
                    return false;
                }
                const course = user.courseProgress.find((progress) => progress.courseId === courseId);
                if (!course) {
                    return false;
                }
                if (course.sectionId.includes(contentId)) {
                    return null;
                }
                course.sectionId.push(contentId);
                yield user.save();
                return user;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getPremiumOffers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const premiumOffers = yield PremiumAccountSchema_1.default.find();
                if (premiumOffers.length === 0) {
                    return false;
                }
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
                const escapedSearchKey = searchKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const regex = new RegExp(escapedSearchKey, "i");
                const result = yield CourseModel_1.default.find({ courseTitle: regex, approved: true });
                if (result.length === 0) {
                    return null; // No matches found
                }
                return result; // Return the array of results
            }
            catch (error) {
                console.error("Error occurred while searching for courses:", error);
                return false; // Error occurred
            }
        });
    }
    getCoursesByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.default.find({ category: category });
                if (courses.length === 0) {
                    return null;
                }
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
                const categories = yield CategoryModel_1.default.find();
                if (categories.length === 0) {
                    return null;
                }
                return categories;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
}
exports.default = userRepository;
