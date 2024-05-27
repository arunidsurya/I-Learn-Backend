import express from "express";

import userController from "../../controller/userController";
import sendMail from "../services/SendMail";
import JwtTokenService from "../services/JwtToken";
import tutorRepository from "../repository/tutorRepository";
import tutorUseCase from "../../usecase/tutorUseCase";
import tutorController from "../../controller/tutorController";
import { isTutuorAuthorized } from "../middlewares/tutorAuth";

const tutorRouter = express.Router();
const repository = new tutorRepository();
const sendEmail = new sendMail();
const JwtToken = new JwtTokenService();
const tutorCase = new tutorUseCase(repository, sendEmail, JwtToken);
const controller = new tutorController(tutorCase);

tutorRouter.post("/tutor/registration", (req, res, next) => {
  controller.registerTutor(req, res, next);
});
tutorRouter.post("/tutor/login", (req, res, next) => {
  controller.loginTutor(req, res, next);
});
tutorRouter.get("/tutor/logout", isTutuorAuthorized,(req, res, next) => {
  controller.logoutTutor(req, res, next);
});
tutorRouter.post("/tutor/create_course",isTutuorAuthorized, (req, res, next) => {
  controller.createCourse(req, res, next);
});
tutorRouter.put("/tutor/edit_course", isTutuorAuthorized,(req, res, next) => {
  controller.editCourse(req, res, next);
});
tutorRouter.get("/tutor/courses/:id", isTutuorAuthorized,(req, res, next) => {
  controller.getAllCourses(req, res, next);
});
tutorRouter.get("/tutor/non-approved-courses/:id", isTutuorAuthorized, (req, res, next) => {
  controller.getNonApporvedCourses(req, res, next);
});
tutorRouter.get("/tutor/categories",isTutuorAuthorized, (req, res, next) => {
  controller.getCategories(req, res, next);
});
tutorRouter.delete("/tutor/delete_course/:_id", isTutuorAuthorized,(req, res, next) => {
  controller.deleteCourse(req, res, next);
});
tutorRouter.delete("/tutor/delete_course/:_id", isTutuorAuthorized,(req, res, next) => {
  controller.deleteCourse(req, res, next);
});
tutorRouter.put( "/tutor/reply-question",isTutuorAuthorized,(req, res, next) => {
    controller.replyToQestion(req, res, next);
  });
tutorRouter.put( "/tutor/reply-review",isTutuorAuthorized,(req, res, next) => {
    controller.replyToReview(req, res, next);
  });
tutorRouter.put("/tutor/add-schedule/:id", isTutuorAuthorized, (req, res, next) => {
  controller.addSchedule(req, res, next);
});
tutorRouter.get("/tutor/get-one-course/:id", isTutuorAuthorized, (req, res, next) => {
  controller.getOneCourse(req, res, next);
});
tutorRouter.get("/tutor/get-students/:id", isTutuorAuthorized, (req, res, next) => {
  controller.getStudents(req, res, next);
});
tutorRouter.post("/tutor/get-search-result", isTutuorAuthorized, (req, res, next) => {
  controller.getSearchResult(req, res, next);
});
tutorRouter.get("/tutor/get-credentials", isTutuorAuthorized, (req, res, next) => {
  controller.getVieoCallCredentials(req, res, next);
});
tutorRouter.get("/tutor/course-analytics", isTutuorAuthorized, (req, res, next) => {
  controller.getLast12MonthsCourseData(req, res, next);
});
tutorRouter.get("/tutor/order-analytics", isTutuorAuthorized, (req, res, next) => {
  controller.getLast12MonthsOrderData(req, res, next);
});
tutorRouter.get("/tutor/user-analytics", isTutuorAuthorized, (req, res, next) => {
  controller.getLast12MonthsUserData(req, res, next);
});



export default tutorRouter;
