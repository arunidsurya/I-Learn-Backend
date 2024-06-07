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
class adminController {
    constructor(adminCase) {
        this.adminCase = adminCase;
    }
    registerAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = req.body;
            const result = yield this.adminCase.adminRegister(adminData);
            res.json(result);
        });
    }
    loginAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const data = yield this.adminCase.loginAdmin(email, password);
                // console.log("data :", data);
                if (data === null || data === void 0 ? void 0 : data.success) {
                    res.cookie("admin_AccessToken", data.token, {
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
    logoutAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                res.cookie("admin_AccessToken", "", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1,
                });
                // res.cookie("admin_AccessToken", "", { maxAge: 1 });
                const email = ((_a = req.admin) === null || _a === void 0 ? void 0 : _a.email) || "";
                redis_1.redis.del(email);
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
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminCase.getUsers();
                // console.log(users);
                if (!users) {
                    res.json({
                        success: false,
                        status: 400,
                        message: "No users found!!",
                    });
                }
                res.status(201).json({
                    success: true,
                    users,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const newUser = this.adminCase.addUser(userData);
                if (!newUser) {
                    return res.json({
                        status: 400,
                        success: false,
                        message: "Add user unsuccessfull!!",
                    });
                }
                res.status(201).json({
                    success: true,
                    message: "User added successfully",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const newUser = this.adminCase.editUser(userData);
                if (!newUser) {
                    return res.json({
                        status: 400,
                        success: false,
                        message: "update user unsuccessfull!!",
                    });
                }
                res.status(201).json({
                    success: true,
                    message: "User edited successfully",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const newUser = this.adminCase.blockUser(_id);
                if (!newUser) {
                    return res.json({
                        status: 400,
                        success: false,
                        message: "update user unsuccessfull!!",
                    });
                }
                res.status(201).json({
                    success: true,
                    message: "User edited successfully",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unBlockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const newUser = this.adminCase.unBlockUser(_id);
                if (!newUser) {
                    return res.json({
                        status: 400,
                        success: false,
                        message: "update user unsuccessfull!!",
                    });
                }
                res.status(201).json({
                    success: true,
                    message: "User edited successfully",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getTutors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutors = yield this.adminCase.getTutors();
                // console.log(tutors);
                if (!tutors) {
                    res.json({
                        success: false,
                        status: 400,
                        message: "No users found!!",
                    });
                }
                res.status(201).json({
                    success: true,
                    tutors,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyTutor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const newTutor = this.adminCase.verifyTutor(_id);
                if (!newTutor) {
                    return res.json({
                        status: 400,
                        success: false,
                        message: "update newTutor unsuccessfull!!",
                    });
                }
                res.status(201).json({
                    success: true,
                    message: "newTutor edited successfully",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    refuteTutor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const newTutor = this.adminCase.refuteTutor(_id);
                if (!newTutor) {
                    return res.json({
                        status: 400,
                        success: false,
                        message: "update user unsuccessfull!!",
                    });
                }
                res.status(201).json({
                    success: true,
                    message: "User edited successfully",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    editTutor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutorData = req.body;
                const newTutor = this.adminCase.editTutor(tutorData);
                if (!newTutor) {
                    return res.json({
                        status: 400,
                        success: false,
                        message: "update user unsuccessfull!!",
                    });
                }
                res.status(201).json({
                    success: true,
                    message: "User edited successfully",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryData = req.body;
                const newCategory = yield this.adminCase.createCategory(categoryData);
                if (newCategory === null) {
                    return res.status(500).json({
                        success: false,
                        message: "Internal server error, Please try again later",
                    });
                }
                if (newCategory === false) {
                    return res.status(409).json({
                        success: false,
                        message: "The category name already exists!!",
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "New Category created successfully!!",
                    newCategory,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error, Please try again later",
                });
            }
        });
    }
    editCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryData = req.body;
                const updatedCategory = yield this.adminCase.editCategory(categoryData);
                if (updatedCategory === null) {
                    return res.status(500).json({
                        success: false,
                        message: "Internal server error, Please try again later",
                    });
                }
                if (updatedCategory === false) {
                    return res.status(400).json({
                        success: false,
                        message: "The category not found!!",
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "Category updated successfully!!",
                    updatedCategory,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error, Please try again later",
                });
            }
        });
    }
    deleteCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.params.id;
                const result = yield this.adminCase.deleteCategory(_id);
                if (result === false) {
                    return res.status(500).json({
                        success: false,
                        message: "Internal server error, Please try again later",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Category deleted successfully!!",
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error, Please try again later",
                });
            }
        });
    }
    getCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.adminCase.getCategories();
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
    getApprovedCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.adminCase.getApprovedCourses();
                if (courses === null) {
                    return res.json({
                        success: false,
                        message: "No course found!!",
                    });
                }
                return res.status(200).json({
                    success: true,
                    courses,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getNonApprovedCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.adminCase.getNonApprovedCourses();
                if (courses === null) {
                    return res.json({
                        success: false,
                        message: "No course found!!",
                    });
                }
                return res.status(200).json({
                    success: true,
                    courses,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changeCourseStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = req.body.status;
                const courseId = req.body.courseId;
                const result = yield this.adminCase.changeCourseStatus(status, courseId);
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "Error occured!! please try again later",
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "course status updated successfully!!",
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminCase.getNotification();
                if (result === false) {
                    return res.json({
                        success: false,
                        message: "Error occured!! please try again later",
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "course status updated successfully!!",
                    result,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getLast12MonthsUserData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminCase.getLast12MonthsUserData();
                if (users === null) {
                    return res.json({
                        success: false,
                        message: "No data found",
                    });
                }
                return res.json({
                    success: true,
                    message: "Review added successfully",
                    users,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getLast12MonthsCourseData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.adminCase.getLast12MonthsCourseData();
                if (courses === null) {
                    return res.json({
                        success: false,
                        message: "No data found",
                    });
                }
                return res.json({
                    success: true,
                    message: "Review added successfully",
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
            try {
                const orders = yield this.adminCase.getLast12MonthsUserData();
                if (orders === null) {
                    return res.json({
                        success: false,
                        message: "No data found",
                    });
                }
                return res.json({
                    success: true,
                    message: "Review added successfully",
                    orders,
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    changeNotificationStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const notification = yield this.adminCase.changeNotificationStatus(id);
            if (notification === false) {
                return res.json({
                    success: false,
                    message: "satus change unsuccessful",
                });
            }
            return res.json({
                success: true,
                message: "status changed successfully",
                notification,
            });
        });
    }
    addPremiumOffer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, price } = req.body;
            const premiumOffer = yield this.adminCase.addPremiumOffer(title, description, price);
            if (premiumOffer === false) {
                return res.json({
                    success: false,
                    message: " premium package submisssion unsuccessful",
                });
            }
            return res.json({
                success: true,
                message: "Package added successfully",
                premiumOffer,
            });
        });
    }
    editPremiumOffer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, price } = req.body;
            const { _id } = req.params;
            const premiumOffer = yield this.adminCase.editPremiumOffer(_id, title, description, price);
            if (premiumOffer === false) {
                return res.json({
                    success: false,
                    message: "Package updation unsuccessful",
                });
            }
            return res.json({
                success: true,
                message: "package updated successfully",
                premiumOffer,
            });
        });
    }
    deletePremiumOffer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const premiumOffer = yield this.adminCase.deletePremiumOffer(_id);
            if (premiumOffer === false) {
                return res.json({
                    success: false,
                    message: "delete package unsuccessful",
                });
            }
            return res.json({
                success: true,
                message: "premium package deleted successfully",
            });
        });
    }
    getOnePremiumOffer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const premiumOffer = yield this.adminCase.getOnePremiumOffer(_id);
            if (premiumOffer === false) {
                return res.json({
                    success: false,
                    message: "no premium Offer found",
                });
            }
            return res.json({
                success: true,
                message: "premium offere is received successfully",
                premiumOffer,
            });
        });
    }
    getPremiumOffers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = req.params;
            const premiumOffers = yield this.adminCase.getPremiumOffers();
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
    getSearchResult(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchKey } = req.body;
            try {
                const result = yield this.adminCase.getSearchResult(searchKey);
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
    getOneCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const result = yield this.adminCase.getOneCourse(id);
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
    upadteAdminInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminData = req.body;
            try {
                const admin = yield this.adminCase.updateAdminInfo(adminData);
                if (!admin) {
                    return res
                        .status(400)
                        .json({ success: false, message: "No file uploaded" });
                }
                res.status(201).json({ admin });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    upadteAdminPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldPassword, newPassword, email } = req.body;
                const admin = yield this.adminCase.upadteAdminPassword(oldPassword, newPassword, email);
                if (admin && !admin.success) {
                    return res.json({
                        success: false,
                        status: 400,
                        message: "Account updation unsuccessful. Please try again later.",
                    });
                }
                res.status(200).json({ success: true, admin });
            }
            catch (error) {
                console.log(error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error." });
            }
        });
    }
}
exports.default = adminController;
