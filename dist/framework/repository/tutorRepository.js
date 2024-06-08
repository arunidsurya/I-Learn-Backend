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
const tutorModel_1 = __importDefault(require("../database/tutorModel"));
const CourseModel_1 = __importDefault(require("../database/CourseModel"));
const CategoryModel_1 = __importDefault(require("../database/CategoryModel"));
const courseData_1 = __importDefault(require("../database/courseData"));
const notificationModel_1 = __importDefault(require("../database/notificationModel"));
const orderModel_1 = __importDefault(require("../database/orderModel"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
class tutorRepository {
    constructor() {
        this.JwtToken = new JwtToken_1.default();
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isEmailExist = yield tutorModel_1.default
                    .findOne({ email })
                    .select("+password");
                if (!isEmailExist) {
                    return null;
                }
                return isEmailExist;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    createTutor(tutorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, gender, institute, qualifiaction, experience, } = tutorData;
                const newTutor = yield tutorModel_1.default.create({
                    name,
                    email,
                    password,
                    gender,
                    institute,
                    qualifiaction,
                    experience,
                });
                if (!newTutor) {
                    return null;
                }
                return newTutor;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    loginTutor(tutor, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPasswordMatch = yield tutor.comparePassword(password);
                if (!isPasswordMatch) {
                    return null;
                }
                else {
                    const token = yield this.JwtToken.SignTutorJwt(tutor);
                    redis_1.redis.set(`tutor-${tutor.email}`, JSON.stringify(tutor));
                    // console.log(token);
                    return token;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    updateTutorinfo(tutorData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { _id, name, institute, avatar } = tutorData;
                const tutor = yield tutorModel_1.default.findOne({ _id });
                if (!tutor) {
                    return null;
                }
                if (avatar && tutor) {
                    if ((_a = tutor.avatar) === null || _a === void 0 ? void 0 : _a.public_id) {
                        yield cloudinary_1.default.uploader.destroy(tutor.avatar.public_id);
                        const uploadRes = yield cloudinary_1.default.uploader.upload(avatar, {
                            upload_preset: "E_Learning",
                            folder: "avatars",
                        });
                        tutor.name = name || tutor.name;
                        tutor.institute = institute || tutor.institute;
                        tutor.avatar = {
                            url: uploadRes.secure_url,
                            public_id: uploadRes.public_id,
                        };
                    }
                    else {
                        const uploadRes = yield cloudinary_1.default.uploader.upload(avatar, {
                            upload_preset: "E_Learning",
                            folder: "avatars",
                        });
                        tutor.name = name || tutor.name;
                        tutor.institute = institute || tutor.institute;
                        tutor.avatar = {
                            url: uploadRes.secure_url,
                            public_id: uploadRes.public_id,
                        };
                    }
                }
                if (!avatar && tutor) {
                    tutor.name = name || tutor.name;
                    tutor.institute = institute || tutor.institute;
                }
                yield tutor.save();
                return tutor;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    updateTutorPassword(oldPassword, newPassword, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tutor = yield tutorModel_1.default.findOne({ email }).select("+password");
                if (!tutor) {
                    return null;
                }
                const isOldPasswordMatch = yield (tutor === null || tutor === void 0 ? void 0 : tutor.comparePassword(oldPassword));
                if (!isOldPasswordMatch) {
                    return null;
                }
                tutor.password = newPassword;
                yield tutor.save();
                redis_1.redis.set(`tutor-${tutor.email}`, JSON.stringify(tutor));
                return tutor;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    createCourse(data, tutor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(data);
                const { courseTitle, instructorId, instructorName, category, description, price, estimatedPrice, totalVideos, tags, thumbnail, level, demoUrl, benefits, prerequisites, courseData, } = data;
                const createdCourseData = yield courseData_1.default.create(courseData);
                const courseDataIds = Array.isArray(createdCourseData)
                    ? createdCourseData.map((data) => data._id)
                    : [];
                // Prepare data for Course document
                const savedCourse = yield CourseModel_1.default.create({
                    courseTitle,
                    instructorId,
                    instructorName,
                    category,
                    description,
                    price,
                    estimatedPrice,
                    totalVideos,
                    tags,
                    thumbnail,
                    level,
                    demoUrl,
                    benefits,
                    prerequisites,
                    courseData: courseDataIds,
                });
                if (savedCourse) {
                    yield notificationModel_1.default.create({
                        userId: tutor === null || tutor === void 0 ? void 0 : tutor._id,
                        title: "New Course Added",
                        message: `New Course Added by ${tutor === null || tutor === void 0 ? void 0 : tutor.name}`,
                    });
                    return savedCourse;
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
    getAllCourses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.default.find({
                    instructorId: id,
                    approved: true,
                })
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
    getNonApprovedCourses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.default.find({
                    instructorId: id,
                    approved: false,
                })
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
    deleteCourse(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield CourseModel_1.default.findById(_id);
                if (!course) {
                    return false; // Course not found
                }
                // Delete associated documents using Promise.all to wait for all deletions
                yield Promise.all(course.courseData.map((objId) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield courseData_1.default.findByIdAndDelete(objId);
                    }
                    catch (error) {
                        console.error(`Error deleting associated document with ID ${objId}:`, error);
                    }
                })));
                // Delete the main course document
                const courseResult = yield CourseModel_1.default.findByIdAndDelete(_id);
                if (!courseResult) {
                    return false; // Course deletion failed
                }
                return true; // Course deleted successfully
            }
            catch (error) {
                console.error("Error deleting course:", error);
                return false; // Error occurred during deletion
            }
        });
    }
    editCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract data from the input
                const { _id, courseTitle, instructorId, instructorName, category, description, price, estimatedPrice, totalVideos, tags, thumbnail, level, demoUrl, benefits, prerequisites, courseData, } = data;
                // Update the courseData documents
                yield Promise.all(courseData.map((data) => __awaiter(this, void 0, void 0, function* () {
                    yield courseData_1.default.findByIdAndUpdate(data._id, data);
                })));
                // Update the course document
                const updatedCourse = yield CourseModel_1.default.findByIdAndUpdate(_id, {
                    courseTitle,
                    instructorId,
                    instructorName,
                    category,
                    description,
                    price,
                    estimatedPrice,
                    totalVideos,
                    tags,
                    thumbnail,
                    level,
                    demoUrl,
                    benefits,
                    prerequisites,
                }, { new: true });
                return updatedCourse;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    replyToQuestion(tutor, answer, courseId, contentId, questionId) {
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
                // console.log(tutor);
                const newAnswer = {
                    user: tutor,
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
    replyToReview(tutor, comment, courseId, reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const course = yield CourseModel_1.default.findById(courseId);
                if (!course) {
                    return false;
                }
                const review = (_a = course === null || course === void 0 ? void 0 : course.reviews) === null || _a === void 0 ? void 0 : _a.find((rev) => rev._id.toString() === reviewId);
                if (!review) {
                    return false;
                }
                const replyData = {
                    tutor,
                    comment,
                };
                (_b = review === null || review === void 0 ? void 0 : review.commentReplies) === null || _b === void 0 ? void 0 : _b.push(replyData);
                yield course.save();
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addSchedule(couresId, date, time, meetingCode, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield CourseModel_1.default.findById(couresId);
                if (!course) {
                    return false;
                }
                const data = {
                    date,
                    time,
                    description,
                    meetingCode,
                };
                course.classSchedule = data;
                yield course.save();
                return true;
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
    getStudents(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield CourseModel_1.default.find({ instructorId: tutorId });
                if (courses.length === 0) {
                    return false;
                }
                const courseIds = courses.map((course) => course._id);
                // Find users with the specific fields
                const users = yield userModel_1.default.find({ courses: { $in: courseIds } }, "_id name email courses");
                // Create a map of courseId to course name for easy lookup
                const courseIdToNameMap = new Map();
                courses.forEach((course) => {
                    courseIdToNameMap.set(course._id.toString(), course.courseTitle);
                });
                // Enrich the users' courses with course names
                const enrichedUsers = users.map((user) => {
                    const enrichedCourses = user.courses.map((courseId) => ({
                        _id: courseId,
                        name: courseIdToNameMap.get(courseId.toString()),
                    }));
                    return {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        courses: enrichedCourses,
                    };
                });
                return enrichedUsers;
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
    // async last12MonthsCourseData(id: string): Promise<any> {
    //   try {
    //     const last12Months: any[] = [];
    //     const currentDate = new Date();
    //     currentDate.setDate(currentDate.getDate() + 1);
    //     for (let i = 11; i >= 0; i--) {
    //       const endDate = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate() - i * 28
    //       );
    //       const startDate = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate() - 28
    //       );
    //       const monthYear = endDate.toLocaleString("default", {
    //         day: "numeric",
    //         month: "short",
    //         year: "numeric",
    //       });
    //       const count = await CourseModel.countDocuments({
    //         createdAt: { $gte: startDate, $lt: endDate },
    //         instructorId: id,
    //       });
    //       last12Months.push({ month: monthYear, count });
    //     }
    //     return last12Months;
    //   } catch (error) {
    //     console.log(error);
    //     return null;
    //   }
    // }
    // async last12MonthsOrderData(tutorId: string): Promise<any> {
    //   try {
    //     const last12Months: any[] = [];
    //     const currentDate = new Date();
    //     currentDate.setDate(currentDate.getDate() + 1);
    //     for (let i = 11; i >= 0; i--) {
    //       const endDate = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate() - i * 28
    //       );
    //       const startDate = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate() - 28
    //       );
    //       const monthYear = endDate.toLocaleString("default", {
    //         day: "numeric",
    //         month: "short",
    //         year: "numeric",
    //       });
    //       const courses = await CourseModel.find({ instructorId: tutorId });
    //       const courseIds = courses.map((course) => course._id);
    //       const count = await OrderModel.countDocuments({
    //         createdAt: { $gte: startDate, $lt: endDate },
    //         courseId: { $in: courseIds },
    //       });
    //       last12Months.push({ month: monthYear, count });
    //     }
    //     console.log(last12Months);
    //     return last12Months;
    //   } catch (error) {
    //     console.log(error);
    //     return null;
    //   }
    // }
    // async last12MonthsUserData(tutorId: string): Promise<boolean | any | null> {
    //   try {
    //     const last12Months: any[] = [];
    //     const currentDate = new Date();
    //     currentDate.setDate(currentDate.getDate() + 1);
    //     for (let i = 11; i >= 0; i--) {
    //       const endDate = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate() - i * 28
    //       );
    //       const startDate = new Date(
    //         currentDate.getFullYear(),
    //         currentDate.getMonth(),
    //         currentDate.getDate() - 28
    //       );
    //       const monthYear = endDate.toLocaleString("default", {
    //         day: "numeric",
    //         month: "short",
    //         year: "numeric",
    //       });
    //       const courses = await CourseModel.find({
    //         instructorId: tutorId,
    //       });
    //       const courseIds = courses.map((course) => course._id);
    //       const count = await userModel.countDocuments({
    //         createdAt: { $gte: startDate, $lt: endDate },
    //         courses: { $in: courseIds },
    //       });
    //       last12Months.push({ month: monthYear, count });
    //     }
    //     return last12Months;
    //   } catch (error) {
    //     console.log(error);
    //     return null;
    //   }
    // }
    last12MonthsCourseData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                for (let i = 11; i >= 0; i--) {
                    // Calculate the start and end dates for the current month in the loop
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
                    // Format the month and year for display
                    const monthYear = startDate.toLocaleString("default", {
                        month: "short",
                        year: "numeric",
                    });
                    // Count the number of courses created between startDate and endDate by the instructor
                    const count = yield CourseModel_1.default.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                        instructorId: id,
                    });
                    // Add the result to the last12Months array
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
    last12MonthsOrderData(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                for (let i = 11; i >= 0; i--) {
                    // Calculate the start and end dates for the current month in the loop
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
                    // Format the month and year for display
                    const monthYear = startDate.toLocaleString("default", {
                        month: "short",
                        year: "numeric",
                    });
                    // Find the courses taught by the specified tutor
                    const courses = yield CourseModel_1.default.find({ instructorId: tutorId });
                    const courseIds = courses.map((course) => course._id);
                    // Count the number of orders for the tutor's courses created between startDate and endDate
                    const count = yield orderModel_1.default.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                        courseId: { $in: courseIds },
                    });
                    // Add the result to the last12Months array
                    last12Months.push({ month: monthYear, count });
                }
                console.log(last12Months);
                return last12Months;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    last12MonthsUserData(tutorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const last12Months = [];
                const currentDate = new Date();
                for (let i = 11; i >= 0; i--) {
                    // Calculate the start and end dates for the current month in the loop
                    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
                    // Format the month and year for display
                    const monthYear = startDate.toLocaleString("default", {
                        month: "short",
                        year: "numeric",
                    });
                    // Find the courses taught by the specified tutor
                    const courses = yield CourseModel_1.default.find({ instructorId: tutorId });
                    const courseIds = courses.map((course) => course._id);
                    // Count the number of users who enrolled in the tutor's courses created between startDate and endDate
                    const count = yield userModel_1.default.countDocuments({
                        createdAt: { $gte: startDate, $lt: endDate },
                        courses: { $in: courseIds },
                    });
                    // Add the result to the last12Months array
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
}
exports.default = tutorRepository;
