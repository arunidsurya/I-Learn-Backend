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
const CategoryModel_1 = __importDefault(require("../database/CategoryModel"));
const adminModel_1 = __importDefault(require("../database/adminModel"));
const tutorModel_1 = __importDefault(require("../database/tutorModel"));
const userModel_1 = __importDefault(require("../database/userModel"));
const CourseModel_1 = __importDefault(require("../database/CourseModel"));
const notificationModel_1 = __importDefault(require("../database/notificationModel"));
const orderModel_1 = __importDefault(require("../database/orderModel"));
const PremiumAccountSchema_1 = __importDefault(require("../database/PremiumAccountSchema"));
class adminRepositoty {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield adminModel_1.default.findOne({ email }).select("+password");
                if (!admin) {
                    return null;
                }
                return admin;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    registerAdmin(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, gender, password } = adminData;
                const admin = yield adminModel_1.default.create({
                    name,
                    email,
                    gender,
                    password,
                    isVerified: true,
                });
                return admin;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.default.find({});
                if (!users) {
                    return null;
                }
                return users;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    addUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, gender, password } = userData;
                const isEmailExists = yield userModel_1.default.findOne({ email });
                if (isEmailExists) {
                    return null;
                }
                const newUser = userModel_1.default.create({
                    name,
                    email,
                    gender,
                    password,
                });
                if (!newUser) {
                    return null;
                }
                return newUser;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    editUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, name, email, gender } = userData;
                // console.log(name, email, gender);
                let user = yield userModel_1.default.findOne({ _id });
                if (!user) {
                    return null;
                }
                user.name = name;
                user.email = email;
                user.gender = gender;
                user = yield user.save();
                // console.log("newUser :", user);
                return user;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    blockUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.findOne({ _id });
                if (!user) {
                    return null;
                }
                user.isBlocked = true;
                user = yield user.save();
                // console.log("newUser :", user);
                return user;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    unBlockUser(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.findOne({ _id });
                if (!user) {
                    return null;
                }
                user.isBlocked = false;
                user = yield user.save();
                return user;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    getTutors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutors = yield tutorModel_1.default.find({});
                if (!tutors) {
                    return null;
                }
                return tutors;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    verifyTutor(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tutor = yield tutorModel_1.default.findOne({ _id });
                if (!tutor) {
                    return null;
                }
                tutor.isVerified = true;
                tutor = yield tutor.save();
                // console.log("newUser :", user);
                return tutor;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    refuteTutor(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tutor = yield tutorModel_1.default.findOne({ _id });
                if (!tutor) {
                    return null;
                }
                tutor.isVerified = false;
                tutor = yield tutor.save();
                // console.log("newUser :", user);
                return tutor;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    editTutor(tutorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, name, email, institute, qualifiaction, experience } = tutorData;
                // console.log(name, email, gender);
                let tutor = yield tutorModel_1.default.findOne({ _id });
                if (!tutor) {
                    return null;
                }
                tutor.name = name;
                tutor.email = email;
                tutor.institute = institute;
                tutor.qualifiaction = qualifiaction;
                tutor.experience = experience;
                tutor = yield tutor.save();
                // console.log("newUser :", user);
                return tutor;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield CategoryModel_1.default.find({
                    name: { $regex: new RegExp(categoryData.name.toString(), "i") },
                });
                // console.log("isExist:", isExist);
                if (isExist.length !== 0) {
                    return false;
                }
                const newCategory = yield CategoryModel_1.default.create(categoryData);
                // console.log("newCategory:", newCategory);
                if (!newCategory) {
                    return null;
                }
                return newCategory;
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
                const { _id, name, description } = categoryData;
                const category = yield CategoryModel_1.default.findById(_id);
                if (!category) {
                    return false; // Category not found
                }
                // Update fields other than _id
                category.name = name;
                category.description = description;
                yield category.save();
                return category; // Return the updated category
                return null;
            }
            catch (error) {
                console.log(error);
                return null; // Return null if an error occurs
            }
        });
    }
    deleteCategory(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield CategoryModel_1.default.deleteOne({ _id });
                if (result.deletedCount === 0) {
                    return false;
                }
                return true;
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
    getApprovedCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.default.find({ approved: true })
                    .populate("courseData")
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
    getNonApprovedCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.default.find({ approved: false })
                    .populate("courseData")
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
    changeCourseStatus(status, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield CourseModel_1.default.findById(courseId);
                if (course) {
                    if (status === "approve") {
                        course.approved = true;
                        yield course.save();
                        return true;
                    }
                    else if (status === "block") {
                        course.approved = false;
                        yield course.save();
                        return true;
                    }
                }
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    getNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield notificationModel_1.default.find({
                    status: "unread",
                }).sort({ createdAt: -1 });
                if (!notifications) {
                    return null;
                }
                return notifications;
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
                const notification = yield notificationModel_1.default.findById(id);
                if (!notification) {
                    return false;
                }
                notification.status = "read";
                yield notification.save();
                return notification;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    last12MonthsUserData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                for (let i = 11; i >= 0; i--) {
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);
                    const monthYear = endDate.toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const count = yield userModel_1.default.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                    });
                    last12Months.push({ month: monthYear, count });
                    console.log(last12Months);
                }
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    last12MonthsCourseData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                for (let i = 11; i >= 0; i--) {
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);
                    const monthYear = endDate.toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const count = yield CourseModel_1.default.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                    });
                    last12Months.push({ month: monthYear, count });
                }
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    last12MonthsOrderData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);
                for (let i = 11; i >= 0; i--) {
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i * 28);
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28);
                    const monthYear = endDate.toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });
                    const count = yield orderModel_1.default.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                    });
                    last12Months.push({ month: monthYear, count });
                }
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    addPremiumOffer(title, description, price) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const premiumOffer = yield PremiumAccountSchema_1.default.create({
                    title,
                    description,
                    price,
                });
                if (!premiumOffer) {
                    return false;
                }
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
                const premiumOffer = yield PremiumAccountSchema_1.default.findById(_id);
                if (!premiumOffer) {
                    return false;
                }
                premiumOffer.title = title;
                premiumOffer.description = description;
                premiumOffer.price = price;
                yield premiumOffer.save();
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
                const premiumOffer = yield PremiumAccountSchema_1.default.findByIdAndDelete(_id);
                if (!premiumOffer) {
                    return false;
                }
                return true;
            }
            catch (error) {
                console.log("Error deleting premium offer:", error);
                return false;
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
    getOnePremiumOffer(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const premiumOffer = yield PremiumAccountSchema_1.default.findById(_id);
                if (!premiumOffer) {
                    return false;
                }
                return premiumOffer;
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
                const result = yield CourseModel_1.default.find({ courseTitle: regex });
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
    getOneCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield CourseModel_1.default.findById(id)
                    .populate("courseData")
                    .exec();
                if (!course) {
                    return null;
                }
                return course;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = adminRepositoty;
