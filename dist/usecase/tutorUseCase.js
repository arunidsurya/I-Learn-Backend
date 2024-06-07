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
class tutorUseCase {
    constructor(itutorRepository, sendEmail, JwtToken) {
        this.iTutorRepository = itutorRepository;
        this.sendEmail = sendEmail;
        this.JwtToken = JwtToken;
    }
    registerTutor(tutorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = tutorData;
                const existingTutor = yield this.iTutorRepository.findByEmail(email);
                if (existingTutor) {
                    return {
                        status: 400,
                        success: false,
                        message: "Email already exists",
                    };
                }
                const newTutor = yield this.iTutorRepository.createTutor(tutorData);
                if (!newTutor) {
                    return {
                        status: 500,
                        success: false,
                        message: "internal server error, please try again later",
                    };
                }
                return {
                    status: 201,
                    success: true,
                    message: "Congratulations!! registration successfull",
                    newTutor,
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    loginTutor(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this.iTutorRepository.findByEmail(email);
                if (!tutor) {
                    return {
                        status: 400,
                        success: false,
                        message: "invalid credentials",
                    };
                }
                if (!tutor.isVerified) {
                    return {
                        status: 400,
                        success: false,
                        message: "Account not verified.!! please contact admin",
                    };
                }
                const token = yield this.iTutorRepository.loginTutor(tutor, email, password);
                if (!token) {
                    return {
                        status: 400,
                        success: false,
                        message: "invalid credentials",
                    };
                }
                return {
                    status: 201,
                    success: true,
                    message: "successfully loggedIn",
                    tutor,
                    token,
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateTutorInfo(tutorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this.iTutorRepository.updateTutorinfo(tutorData);
                if (!tutor) {
                    return {
                        status: 500,
                        success: false,
                        message: "Account updation unsuccessfull, Please try again later",
                        tutor,
                    };
                }
                return {
                    status: 201,
                    success: true,
                    message: "Account updated successfully",
                    tutor,
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    upadteTutorpassword(oldPassword, newPassword, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield this.iTutorRepository.updateTutorPassword(oldPassword, newPassword, email);
                if (tutor === null) {
                    return {
                        status: 500,
                        success: false,
                        message: "Account updation unsuccessfull, Please try again later",
                        tutor,
                    };
                }
                return {
                    status: 201,
                    success: true,
                    message: "Password updated successfully",
                    tutor,
                };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createCourse(data, tutor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedCourse = yield this.iTutorRepository.createCourse(data, tutor);
                if (savedCourse) {
                    return savedCourse;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    editCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedCourse = yield this.iTutorRepository.editCourse(data);
                if (savedCourse) {
                    return savedCourse;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getAllCourses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.iTutorRepository.getAllCourses(id);
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
    getNonApprovedCourses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.iTutorRepository.getNonApprovedCourses(id);
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
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.iTutorRepository.getCategories();
                return categories;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    deleteCourse(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.deleteCourse(_id);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    replyToQuestion(tutor, answer, courseId, contentId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.replyToQuestion(tutor, answer, courseId, contentId, questionId);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    replyToReview(tutor, comment, courseId, reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.replyToReview(tutor, comment, courseId, reviewId);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addScehdule(couresId, date, time, meetingCode, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.addSchedule(couresId, date, time, meetingCode, description);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getOneCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.getOneCourse(id);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getStudents(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.getStudents(tutorId);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getSearchResult(searchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.getSearchResult(searchKey);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getLast12MonthsCourseData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.last12MonthsCourseData(id);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getLast12MonthsOrderData(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.last12MonthsOrderData(tutorId);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getLast12MonthsUserData(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iTutorRepository.last12MonthsUserData(tutorId);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = tutorUseCase;
