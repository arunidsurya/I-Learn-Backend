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
class tutorController {
    constructor(tutorCase) {
        this.tutorCase = tutorCase;
    }
    registerTutor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorData = req.body;
                const newTutor = yield this.tutorCase.registerTutor(tutorData);
                res.json(newTutor);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    loginTutor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const data = yield this.tutorCase.loginTutor(email, password);
                // console.log("data :", data);
                if (data === null || data === void 0 ? void 0 : data.success) {
                    res.cookie("tutor_token", data.token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                    });
                    // res.cookie("tutor_token", data.token);
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
    logoutTutor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const email = ((_a = req.tutor) === null || _a === void 0 ? void 0 : _a.email) || "";
                console.log("tutor-email:", email);
                redis_1.redis.del(`tutor-${email}`);
                res.cookie("tutor_token", "", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1
                });
                // res.cookie("tutor_token", "", { maxAge: 1 });
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
    createCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = req === null || req === void 0 ? void 0 : req.tutor;
            try {
                const { data } = req.body;
                if (tutor) {
                    const courseStatus = yield this.tutorCase.createCourse(data, tutor);
                    if (courseStatus === null) {
                        return res.status(500).json({
                            success: false,
                            messge: "Course creation unsuccessfull",
                        });
                    }
                    return res.status(201).json({
                        success: true,
                        message: "Course added suucessfully",
                        courseStatus,
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("calling controller");
            try {
                const { data } = req.body;
                const courseStatus = yield this.tutorCase.editCourse(data);
                if (courseStatus === null) {
                    return res.status(500).json({
                        success: false,
                        messge: "Course creation unsuccessfull",
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "Course added suucessfully",
                    courseStatus,
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
                const categories = yield this.tutorCase.getCategories();
                if (categories === null) {
                    return res.status(404).json({
                        success: false,
                        message: "No categories available",
                    });
                }
                if (categories === false) {
                    return res.status(500).json({
                        success: false,
                        message: "Internal server error, Please try again later",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Category deleted successfully!!",
                    categories,
                });
            }
            catch (error) { }
        });
    }
    getAllCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const courses = yield this.tutorCase.getAllCourses(id);
                if (courses === null) {
                    return res.json({
                        success: false,
                        message: "No courses found",
                    });
                }
                res.json({ courses, success: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getNonApporvedCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const courses = yield this.tutorCase.getNonApprovedCourses(id);
                if (courses === null) {
                    return res.json({
                        success: false,
                        message: "No courses found",
                    });
                }
                res.json({ courses, success: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deleteCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.params;
                const result = yield this.tutorCase.deleteCourse(_id);
                if (result === false) {
                    return res.status(404).json({
                        sucess: false,
                        message: "delete operation failed",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Course Deleted successfully",
                });
            }
            catch (error) {
                console.log(error);
                return res.json({
                    sucess: false,
                    message: "internal server error!! please try again later",
                });
            }
        });
    }
    replyToQestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { answer, courseId, contentId, questionId } = req.body;
                const tutor = req.tutor;
                // console.log(tutor);
                const result = yield this.tutorCase.replyToQuestion(tutor, answer, courseId, contentId, questionId);
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
            catch (error) {
                console.log(error);
                return res.json({
                    sucess: false,
                    message: "internal server error!! please try again later",
                });
            }
        });
    }
    replyToReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { comment, courseId, reviewId } = req.body;
                const tutor = req.tutor;
                const result = yield this.tutorCase.replyToReview(tutor, comment, courseId, reviewId);
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
            catch (error) {
                console.log(error);
                return res.json({
                    sucess: false,
                    message: "internal server error!! please try again later",
                });
            }
        });
    }
    addSchedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = req.params.id;
            const { date, time, meetingCode, description } = req.body;
            try {
                const result = yield this.tutorCase.addScehdule(courseId, date, time, meetingCode, description);
                if (result === null) {
                    return res.json({
                        success: false,
                        message: "internal server error, please try again later",
                    });
                }
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "Course not found",
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
    getOneCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield this.tutorCase.getOneCourse(id);
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
    getStudents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield this.tutorCase.getStudents(id);
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
    getSearchResult(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchKey } = req.body;
            try {
                const result = yield this.tutorCase.getSearchResult(searchKey);
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
    getLast12MonthsCourseData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = ((_a = req.tutor) === null || _a === void 0 ? void 0 : _a._id) || "";
                const courses = yield this.tutorCase.getLast12MonthsCourseData(id);
                if (courses === null) {
                    return res.json({
                        success: false,
                        message: "No data found",
                    });
                }
                return res.json({
                    success: true,
                    message: "course analytics found successfully",
                    courses,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getLast12MonthsOrderData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const tutorId = ((_a = req.tutor) === null || _a === void 0 ? void 0 : _a._id) || "";
                const orders = yield this.tutorCase.getLast12MonthsOrderData(tutorId);
                if (orders === null) {
                    return res.json({
                        success: false,
                        message: "No data found",
                    });
                }
                return res.json({
                    success: true,
                    message: "orders analytics found successfully",
                    orders,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getLast12MonthsUserData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const tutorId = ((_a = req.tutor) === null || _a === void 0 ? void 0 : _a._id) || "";
                const users = yield this.tutorCase.getLast12MonthsUserData(tutorId);
                if (users === null) {
                    return res.json({
                        success: false,
                        message: "No data found",
                    });
                }
                return res.json({
                    success: true,
                    message: "users analytics found successfully",
                    users,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = tutorController;
