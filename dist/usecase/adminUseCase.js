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
class adminUseCase {
    constructor(iAdminRepository, sendEmail, JwtToken) {
        this.iAdminRepository = iAdminRepository;
        this.sendEmail = sendEmail;
        this.JwtToken = JwtToken;
    }
    loginAdmin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.iAdminRepository.findByEmail(email);
                if (!admin) {
                    return {
                        success: false,
                        message: "Invalid email or password",
                    };
                }
                const isPasswordMatch = yield admin.comparePassword(password);
                if (!isPasswordMatch) {
                    return {
                        success: false,
                        message: "Entered password is wrong",
                    };
                }
                const token = yield this.JwtToken.AdminSignJwt(admin);
                if (!token) {
                    return {
                        success: false,
                        message: "Internal server error, please try again later",
                    };
                }
                redis_1.redis.set(admin.email, JSON.stringify(admin));
                return { status: 201, success: true, admin, token };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    adminRegister(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, gender, password } = adminData;
                const isEmailExist = yield this.iAdminRepository.findByEmail(email);
                if (isEmailExist) {
                    return {
                        success: false,
                        message: "Exisiting Email",
                    };
                }
                const admin = this.iAdminRepository.registerAdmin(adminData);
                if (!admin) {
                    return {
                        success: false,
                        message: "Internal server error, please try again later",
                    };
                }
                return {
                    success: false,
                    message: "Successfully registered",
                    admin,
                };
            }
            catch (error) { }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.iAdminRepository.getUsers();
                if (!users) {
                    return false;
                }
                return users;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.iAdminRepository.addUser(userData);
                if (!newUser) {
                    return false;
                }
                return newUser;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    editUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.iAdminRepository.editUser(userData);
                if (!newUser) {
                    return false;
                }
                // console.log("newUser :", newUser);
                return newUser;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    blockUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.iAdminRepository.blockUser(_id);
                if (!newUser) {
                    return false;
                }
                // console.log("newUser :", newUser);
                return newUser;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    unBlockUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.iAdminRepository.unBlockUser(_id);
                if (!newUser) {
                    return false;
                }
                return newUser;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getTutors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutors = yield this.iAdminRepository.getTutors();
                if (!tutors) {
                    return false;
                }
                return tutors;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyTutor(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTutor = yield this.iAdminRepository.verifyTutor(_id);
                if (!newTutor) {
                    return false;
                }
                return newTutor;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    refuteTutor(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTutor = yield this.iAdminRepository.refuteTutor(_id);
                if (!newTutor) {
                    return false;
                }
                return newTutor;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    editTutor(tutorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTutor = yield this.iAdminRepository.editTutor(tutorData);
                if (!newTutor) {
                    return false;
                }
                // console.log("newUser :", newUser);
                return newTutor;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.createCategory(categoryData);
                if (result === false) {
                    return false;
                }
                if (result === null) {
                    return result;
                }
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    editCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.editCategory(categoryData);
                if (result === false) {
                    return false;
                }
                if (result === null) {
                    return result;
                }
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    deleteCategory(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.deleteCategory(_id);
                return result;
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
                const categories = yield this.iAdminRepository.getCategories();
                return categories;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getApprovedCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.getApprovedCourses();
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getNonApprovedCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.getNonApprovedCourses();
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    changeCourseStatus(status, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.changeCourseStatus(status, courseId);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.iAdminRepository.getNotification();
                return data;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getLast12MonthsUserData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.last12MonthsUserData();
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getLast12MonthsCourseData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.last12MonthsCourseData();
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getLast12MonthsOrderData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.last12MonthsOrderData();
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    changeNotificationStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield this.iAdminRepository.changeNotificationStatus(id);
                return notification;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addPremiumOffer(title, description, price) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const premiumOffer = yield this.iAdminRepository.addPremiumOffer(title, description, price);
                return premiumOffer;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    editPremiumOffer(_id, title, description, price) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const premiumOffer = yield this.iAdminRepository.editPremiumOffer(_id, title, description, price);
                return premiumOffer;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    deletePremiumOffer(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.iAdminRepository.deletePremiumOffer(_id);
                return result;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    getOnePremiumOffer(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const premiumOffer = yield this.iAdminRepository.getOnePremiumOffer(_id);
                return premiumOffer;
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
                const premiumOffers = yield this.iAdminRepository.getPremiumOffers();
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
                const result = yield this.iAdminRepository.getSearchResult(searchKey);
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
                const result = yield this.iAdminRepository.getOneCourse(id);
                return result;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = adminUseCase;
