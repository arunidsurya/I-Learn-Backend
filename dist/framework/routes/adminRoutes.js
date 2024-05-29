"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../repository/adminRepository"));
const SendMail_1 = __importDefault(require("../services/SendMail"));
const JwtToken_1 = __importDefault(require("../services/JwtToken"));
const adminUseCase_1 = __importDefault(require("../../usecase/adminUseCase"));
const adminController_1 = __importDefault(require("../../controller/adminController"));
const adminAuth_1 = require("../middlewares/adminAuth");
const adminRouter = express_1.default.Router();
const repository = new adminRepository_1.default();
const sendEmail = new SendMail_1.default();
const JwtToken = new JwtToken_1.default();
const userCase = new adminUseCase_1.default(repository, sendEmail, JwtToken);
const controller = new adminController_1.default(userCase);
adminRouter.post("/admin/register", (req, res, next) => {
    controller.registerAdmin(req, res, next);
});
adminRouter.post("/admin/login", (req, res, next) => {
    controller.loginAdmin(req, res, next);
});
adminRouter.get("/admin/logout", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.logoutAdmin(req, res, next);
});
adminRouter.get("/admin/getUsers", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getUsers(req, res, next);
});
adminRouter.post("/admin/addUser", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.addUser(req, res, next);
});
adminRouter.put("/admin/editUser", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.editUser(req, res, next);
});
adminRouter.post("/admin/blockUser", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.blockUser(req, res, next);
});
adminRouter.post("/admin/unBlockUser", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.unBlockUser(req, res, next);
});
adminRouter.get("/admin/getTutors", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getTutors(req, res, next);
});
adminRouter.post("/admin/verifyTutor", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.verifyTutor(req, res, next);
});
adminRouter.post("/admin/refuteTutor", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.refuteTutor(req, res, next);
});
adminRouter.put("/admin/editTutor", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.editTutor(req, res, next);
});
adminRouter.post("/admin/create_category", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.createCategory(req, res, next);
});
adminRouter.put("/admin/edit_category", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.editCategory(req, res, next);
});
adminRouter.delete("/admin/delete_category/:id", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.deleteCategory(req, res, next);
});
adminRouter.get("/admin/get_categories", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getCategories(req, res, next);
});
adminRouter.get("/admin/courses", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getApprovedCourses(req, res, next);
});
adminRouter.get("/admin/non_approved_courses", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getNonApprovedCourses(req, res, next);
});
adminRouter.put("/admin/change_courses_status", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.changeCourseStatus(req, res, next);
});
adminRouter.get("/admin/get-notifications", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getNotifications(req, res, next);
});
adminRouter.get("/admin/user-analytics", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getLast12MonthsUserData(req, res, next);
});
adminRouter.get("/admin/course-analytics", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getLast12MonthsCourseData(req, res, next);
});
adminRouter.get("/admin/order-analytics", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getLast12MonthsOrderData(req, res, next);
});
adminRouter.get("/admin/change-notification-status/:id", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.changeNotificationStatus(req, res, next);
});
adminRouter.post("/admin/add-premiumOffer", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.addPremiumOffer(req, res, next);
});
adminRouter.put("/admin/edit-premiumOffer/:_id", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.editPremiumOffer(req, res, next);
});
adminRouter.delete("/admin/delete-premiumOffer/:_id", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.deletePremiumOffer(req, res, next);
});
adminRouter.get("/admin/get-one-premiumOffer/:_id", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getOnePremiumOffer(req, res, next);
});
adminRouter.get("/admin/get-premiumOffers", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getPremiumOffers(req, res, next);
});
adminRouter.post("/admin/get-search-result", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getSearchResult(req, res, next);
});
adminRouter.get("/admin/get-one-course/:id", adminAuth_1.isAuthorized, (req, res, next) => {
    controller.getOneCourse(req, res, next);
});
exports.default = adminRouter;
