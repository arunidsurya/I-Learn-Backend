import mongoose, { Document, set } from "mongoose";
import User from "../../entities/userEntity";
import ITutorRepository from "../../usecase/interface/ITutorRepository";
import { redis } from "../config/redis";
import userModel from "../database/userModel";
import JwtTokenService from "../services/JwtToken";
import Tutor from "../../entities/tutorEntity";
import tutorModel from "../database/tutorModel";
import CourseModel from "../database/CourseModel";
import Category from "../../entities/Categories";
import CategoryModel from "../database/CategoryModel";
import CourseDataModel from "../database/courseData";
import Course from "../../entities/course";
import NotificationModel from "../database/notificationModel";

class tutorRepository implements ITutorRepository {
  JwtToken = new JwtTokenService();
  async findByEmail(email: string): Promise<Tutor | null> {
    try {
      const isEmailExist = await tutorModel
        .findOne({ email })
        .select("+password");
      if (!isEmailExist) {
        return null;
      }
      return isEmailExist;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async createTutor(tutorData: Tutor): Promise<Tutor | null> {
    try {
      const {
        name,
        email,
        password,
        gender,
        institute,
        qualifiaction,
        experience,
      } = tutorData;

      const newTutor = await tutorModel.create({
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
    } catch (error) {
      console.log(error);

      return null;
    }
  }
  async loginTutor(
    tutor: Tutor,
    email: string,
    password: string
  ): Promise<string | null> {
    try {
      const isPasswordMatch = await tutor.comparePassword(password);
      if (!isPasswordMatch) {
        // Check if password does not match
        return null; // Return null if password does not match
      } else {
        const token = await this.JwtToken.SignTutorJwt(tutor);
        redis.set(`tutor-${tutor.email}`, JSON.stringify(tutor) as any);
        // console.log(token);
        return token;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async createCourse(data: Course,tutor:Tutor): Promise<Document<any, any, Course> | null> {
    try {
      // console.log(data);

      const {
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
        courseData,
      } = data;

      const createdCourseData = await CourseDataModel.create(courseData);

      // console.log("createdCourseData :", createdCourseData);

      // Convert createdCourseData to an array if it's not already
      const courseDataIds = Array.isArray(createdCourseData)
        ? createdCourseData.map((data) => data._id)
        : [];

      // Prepare data for Course document
      const savedCourse = await CourseModel.create({
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
              await NotificationModel.create({
                userId: tutor?._id,
                title: "New Course Added",
                message: `New Course Added by ${tutor?.name}`,
              });
        return savedCourse;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getAllCourses(
    id: string
  ): Promise<Document<any, any, Course>[] | null> {
    try {
      const courses = await CourseModel.find({
        instructorId: id,
        approved: true,
      })
        .populate("courseData")
        .sort({ createdAt: -1 })
        .exec();
      if (courses) {
        return courses;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getNonApprovedCourses(
    id: string
  ): Promise<mongoose.Document<any, any, Course>[] | null> {
    try {
      const courses = await CourseModel.find({
        instructorId: id,
        approved: false,
      })
        .populate("courseData")
        .sort({ createdAt: -1 })
        .exec();
      if (courses) {
        return courses;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getCategories(): Promise<Category[] | null | boolean> {
    try {
      const categories = await CategoryModel.find();
      if (categories.length === 0) {
        return null;
      }
      return categories;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async deleteCourse(_id: string): Promise<boolean> {
    try {
      const course = await CourseModel.findById(_id);
      if (!course) {
        return false; // Course not found
      }

      // Delete associated documents using Promise.all to wait for all deletions
      await Promise.all(
        course.courseData.map(async (objId) => {
          try {
            await CourseDataModel.findByIdAndDelete(objId);
          } catch (error) {
            console.error(
              `Error deleting associated document with ID ${objId}:`,
              error
            );
          }
        })
      );

      // Delete the main course document
      const courseResult = await CourseModel.findByIdAndDelete(_id);
      if (!courseResult) {
        return false; // Course deletion failed
      }

      return true; // Course deleted successfully
    } catch (error) {
      console.error("Error deleting course:", error);
      return false; // Error occurred during deletion
    }
  }
  async editCourse(data: Course): Promise<Document<any, any, Course> | null> {
    try {
      // Extract data from the input
      const {
        _id,
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
        courseData,
      } = data;

      // Update the courseData documents
      await Promise.all(
        courseData.map(async (data) => {
          await CourseDataModel.findByIdAndUpdate(data._id, data);
        })
      );

      // Update the course document
      const updatedCourse = await CourseModel.findByIdAndUpdate(
        _id,
        {
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
        },
        { new: true }
      );

      return updatedCourse;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async replyToQuestion(
    tutor: any,
    answer: string,
    courseId: string,
    contentId: string,
    questionId: string
  ): Promise<boolean | null> {
    try {
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        console.log("invalid contentId");
        return false;
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return false;
      }
      const courseContentData = await CourseDataModel.findById(contentId);
      if (!courseContentData) {
        return false;
      }
      const question = courseContentData?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return false;
      }

      // console.log(tutor);

      const newAnswer: any = {
        user: tutor,
        answer,
      };
      console.log(newAnswer);

      question.questionReplies.push(newAnswer);
      await courseContentData.save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async replyToReview(
    tutor: any,
    comment: string,
    courseId: string,
    reviewId: string
  ): Promise<boolean | null> {
    try {
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return false;
      }
      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );
      if (!review) {
        return false;
      }

      const replyData: any = {
        tutor,
        comment,
      };

      review?.commentReplies?.push(replyData);

      await course.save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addSchedule(
    couresId: string,
    date: string,
    time: string,
    meetingCode: string,
    description: string
  ): Promise<boolean | null> {
    try {
      const course = await CourseModel.findById(couresId);
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
      await course.save();
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getOneCourse(id: string): Promise<Course | null> {
    try {
      const course = await CourseModel.findById(id)
        .populate("courseData")
        .exec();

      if (!course) {
        return null;
      }
      return course;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getStudents(tutorId: string): Promise<boolean | any[] | null> {
    try {
      const courses = await CourseModel.find({ instructorId: tutorId });
      if (courses.length === 0) {
        return false;
      }

      const courseIds = courses.map((course) => course._id);

      // Find users with the specific fields
      const users = await userModel.find(
        { courses: { $in: courseIds } },
        "_id name email courses"
      );

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
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getSearchResult(searchKey: string): Promise<boolean | any[] | null> {
    try {
      const escapedSearchKey = searchKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedSearchKey, "i");

      const result = await CourseModel.find({ courseTitle: regex });

      if (result.length === 0) {
        return null; // No matches found
      }

      return result; // Return the array of results
    } catch (error) {
      console.error("Error occurred while searching for courses:", error);
      return false; // Error occurred
    }
  }
  async last12MonthsCourseData(id: string): Promise<any> {
    try {
      const last12Months: any[] = [];
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);

      for (let i = 11; i >= 0; i--) {
        const endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - i * 28
        );
        const startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - 28
        );

        const monthYear = endDate.toLocaleString("default", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const count = await CourseModel.countDocuments({
          createdAt: { $gte: startDate, $lt: endDate },
          instructorId: id,
        });

        last12Months.push({ month: monthYear, count });
      }
      return last12Months;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default tutorRepository;
