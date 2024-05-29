"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SendMail_1 = __importDefault(require("../services/SendMail"));
const JwtToken_1 = __importDefault(require("../services/JwtToken"));
const tutorRepository_1 = __importDefault(require("../repository/tutorRepository"));
const tutorUseCase_1 = __importDefault(require("../../usecase/tutorUseCase"));
const tutorController_1 = __importDefault(require("../../controller/tutorController"));
const tutorAuth_1 = require("../middlewares/tutorAuth");
const tutorRouter = express_1.default.Router();
const repository = new tutorRepository_1.default();
const sendEmail = new SendMail_1.default();
const JwtToken = new JwtToken_1.default();
const tutorCase = new tutorUseCase_1.default(repository, sendEmail, JwtToken);
const controller = new tutorController_1.default(tutorCase);
tutorRouter.post("/tutor/registration", (req, res, next) => {
    controller.registerTutor(req, res, next);
});
tutorRouter.post("/tutor/login", (req, res, next) => {
    controller.loginTutor(req, res, next);
});
tutorRouter.get("/tutor/logout", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.logoutTutor(req, res, next);
});
tutorRouter.post("/tutor/create_course", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.createCourse(req, res, next);
});
tutorRouter.put("/tutor/edit_course", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.editCourse(req, res, next);
});
tutorRouter.get("/tutor/courses/:id", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getAllCourses(req, res, next);
});
tutorRouter.get("/tutor/non-approved-courses/:id", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getNonApporvedCourses(req, res, next);
});
tutorRouter.get("/tutor/categories", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getCategories(req, res, next);
});
tutorRouter.delete("/tutor/delete_course/:_id", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.deleteCourse(req, res, next);
});
tutorRouter.delete("/tutor/delete_course/:_id", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.deleteCourse(req, res, next);
});
tutorRouter.put("/tutor/reply-question", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.replyToQestion(req, res, next);
});
tutorRouter.put("/tutor/reply-review", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.replyToReview(req, res, next);
});
tutorRouter.put("/tutor/add-schedule/:id", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.addSchedule(req, res, next);
});
tutorRouter.get("/tutor/get-one-course/:id", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getOneCourse(req, res, next);
});
tutorRouter.get("/tutor/get-students/:id", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getStudents(req, res, next);
});
tutorRouter.post("/tutor/get-search-result", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getSearchResult(req, res, next);
});
tutorRouter.get("/tutor/get-credentials", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getVieoCallCredentials(req, res, next);
});
tutorRouter.get("/tutor/course-analytics", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getLast12MonthsCourseData(req, res, next);
});
tutorRouter.get("/tutor/order-analytics", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getLast12MonthsOrderData(req, res, next);
});
tutorRouter.get("/tutor/user-analytics", tutorAuth_1.isTutuorAuthorized, (req, res, next) => {
    controller.getLast12MonthsUserData(req, res, next);
});
exports.default = tutorRouter;
