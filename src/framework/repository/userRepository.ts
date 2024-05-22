import mongoose, { set } from "mongoose";
import User from "../../entities/userEntity";
import IUserRepository from "../../usecase/interface/IUserRepository";
import { redis } from "../config/redis";
import userModel from "../database/userModel";
import JwtTokenService from "../services/JwtToken";
import cloudinary from "../config/cloudinary";
import { Document } from "mongoose";
import CourseModel, { IComment } from "../database/CourseModel";
import Course from "../../entities/course";
import OrderModel from "../database/orderModel";
import Order from "../../entities/oder";
import NotificationModel from "../database/notificationModel";
import CourseDataModel from "../database/courseData";
import ChatModel from "../database/liveChat";
import PremiumOrderModel from "../database/PremiumOrderModel";


class userRepository implements IUserRepository {
  JwtToken = new JwtTokenService();

  async findByEmail(email: string): Promise<User | null> {
    const isEmailExist = await userModel.findOne({ email }).select("+password");
    // console.log("isEmailExist:", isEmailExist);
    return isEmailExist;
  }
  
  async createUser(user: User): Promise<User | null> {
    try {
      const { name, email, gender, password } = user;
      const savedUser = await userModel.create({
        name,
        email,
        gender,
        password,
        isVerified: true,
      });

      return savedUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async loginUser(
    user: User,
    email: string,
    password: string
  ): Promise<{ access_token: string; refresh_token: string } | null> {
    try {
      const isPasswordMatch = await user.comparePassword(password);
      // console.log("match:", isPasswordMatch);

      if (!isPasswordMatch) {
        // Check if password does not match
        return null; // Return null if password does not match
      } else {
        const access_token = await this.JwtToken.SignJwt(user);
        const refresh_token = await this.JwtToken.refreshToken(user);
        redis.set(`user-${user.email}`, JSON.stringify(user) as any);
        // console.log(token);
        return { access_token, refresh_token };
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async isLoggedEmail(email: string): Promise<User | null> {
    const userData = await userModel.findOne({ email });

    return userData;
  }

  async forgotPasswordConfirm(
    email: string,
    newPassword: string
  ): Promise<User | null> {
    try {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        // Handle the case where the user is not found
        return null;
      }
      user.password = newPassword;
      await user.save();
      redis.set(user.email, JSON.stringify(user) as any);
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async updateUserinfo(userData: User): Promise<User | null> {
    try {
      const { _id, name, email, avatar } = userData;

      const user = await userModel.findOne({ _id });
      if (!user) {
        return null;
      }
      if (avatar && user) {
        if (user.avatar?.public_id) {
          await cloudinary.uploader.destroy(user.avatar.public_id);
          const uploadRes = await cloudinary.uploader.upload(avatar, {
            upload_preset: "E_Learning",
            folder: "avatars",
          });
          user.name = name || user.name;
          user.email = email || user.email;
          user.avatar = {
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id,
          };
        } else {
          const uploadRes = await cloudinary.uploader.upload(avatar, {
            upload_preset: "E_Learning",
            folder: "avatars",
          });
          user.name = name;
          user.email = email;
          user.avatar = {
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id,
          };
        }
      }
      if (!avatar && user) {
        user.name = name || user.name;
        user.email = email || user.email;
      }

      await user.save();

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateUserPassword(
    oldPassword: string,
    newPassword: string,
    email: string
  ): Promise<User | null> {
    try {
      // console.log(email);

      const user = await userModel.findOne({ email }).select("+password");
      // console.log(user);

      if (!user) {
        return null;
      }
      const isOldPasswordMatch = await user?.comparePassword(oldPassword);
      // console.log(isOldPasswordMatch);

      if (!isOldPasswordMatch) {
        return null;
      }
      user.password = newPassword;
      await user.save();
      redis.set(user.email, JSON.stringify(user) as any);

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async googleLogin(
    user: User
  ): Promise<{ access_token: string; refresh_token: string } | null> {
    try {
      const access_token = await this.JwtToken.SignJwt(user);
      const refresh_token = await this.JwtToken.refreshToken(user);

      redis.set(user.email, JSON.stringify(user) as any);
      // console.log(token);
      return { access_token, refresh_token };
    } catch (error) {
      return null;
    }
  }
  async googleSignup(
    name: string,
    email: string,
    avatar: string
  ): Promise<{
    savedUser: User;
    access_token: string;
    refresh_token: string;
  } | null> {
    try {
      // console.log(name, email, avatar);

      // Check if name and email are provided
      if (!name || !email) {
        throw new Error("Name and email are required");
      }

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const generatedPublicId = Math.random().toString(36).slice(-8);
      const savedUser = await userModel.create({
        name,
        email,
        gender: "not specified",
        avatar: {
          url: avatar,
          public_id: generatedPublicId,
        },
        password: generatedPassword,
        isVerified: true,
      });

      const access_token = await this.JwtToken.SignJwt(savedUser);
      const refresh_token = await this.JwtToken.refreshToken(savedUser);

      redis.set(savedUser.email, JSON.stringify(savedUser) as any);

      return { savedUser, access_token, refresh_token };
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async getAllCourses(): Promise<Document<any, any, Course>[] | null> {
    try {
      const courses = await CourseModel.find({ approved: true })
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
  async getCourse(_id: string): Promise<Course | null> {
    try {
      // console.log(_id);

      const course = await CourseModel.findById(_id)
        .populate("courseData")
        .exec();
      if (course) {
        return course;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getCourseContent(_id: string): Promise<Course | null> {
    try {
      // console.log(_id);

      const course = await CourseModel.findById(_id)
        .populate("courseData")
        .exec();
      if (course) {
        return course;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async createOrder(
    userId: string,
    courseId: string,
    payment_info: object
  ): Promise<object | boolean | null> {
    try {
      // console.log("courseId:", courseId);
      // console.log("userId:", userId);

      // console.log("paymentInfo:", payment_info);
      const user = await userModel.findById(userId);

      const courseExistInUser = user?.courses.some(
        (course: any) => course === courseId
      );

      if (courseExistInUser) {
        return null;
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return false;
      }

      const data = {
        courseId,
        userId,
        payment_info,
      };

      const newOrder = await OrderModel.create(data);

      user?.courses.push(course?._id);
      user?.courseProgress.push({
        courseId: course._id.toString(),
        sectionId: [],
      });

      redis.set(`user-${user?.email}`, JSON.stringify(user) as any);

      await user?.save();

      await NotificationModel.create({
        userId: user?._id,
        title: "New Order",
        message: `You hava a new order from ${course?.courseTitle}`,
      });

      course.purchased = +1;
      await course.save();

      return { newOrder, user };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addQuestion(
    user: any,
    question: string,
    courseId: string,
    contentId: string
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
      const newQuestion: any = {
        user,
        question,
        questionReplies: [],
      };
      courseContentData.questions?.push(newQuestion);
      await courseContentData.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async replyToQuestion(
    user: any,
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
      // console.log(user);

      const newAnswer: any = {
        user,
        answer,
      };
      question.questionReplies.push(newAnswer);
      await courseContentData.save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addReview(
    userEmail: string,
    courseId: string,
    userId: string,
    review: string,
    rating: number
  ): Promise<Course | boolean | null> {
    try {
      const userData = await redis.get(`user-${userEmail}`);

      if (userData === null) {
        console.log("no user data found");

        return false;
      }
      const user: User = JSON.parse(userData);
      // console.log(user?.courses);
      const userCourseList = user?.courses;

      const courseExists = userCourseList?.some(
        (course_id: any) => course_id.toString() === courseId.toString()
      );
      if (!courseExists) {
        console.log("no course found");

        return false;
      }

      const course = await CourseModel.findById(courseId);

      const reviewData: any = {
        user: user,
        comment: review,
        rating,
      };

      console.log(reviewData);

      course?.reviews.push(reviewData);

      let avg = 0;

      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });
      if (course) {
        course.ratings = avg / course.reviews.length;
      }

      await course?.save();

      await NotificationModel.create({
        userId: userId,
        title: "New Review Added",
        message: `${user.name} has posted a review in ${course?.courseTitle}`,
      });

      return course;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addChat(
    userName: string,
    userId: string,
    message: string,
    courseId: string
  ): Promise<boolean | null> {
    try {
      console.log("userName :", userName);
      console.log("userId :", userId);
      console.log("message :", message);
      console.log("courseId :", courseId);
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return false;
      }

      const chatData = {
        userName,
        userId,
        message,
      };
      const savedChat = await ChatModel.create(chatData);

      course.chat.push(savedChat._id);

      await course.save();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getChat(courseId: string): Promise<Course | null> {
    try {
      const course = await CourseModel.findById(courseId)
        .populate("chat")
        .exec();

      return course;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getErolledCourses(userId: string): Promise<Course[] | null> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return null;
      }
      const courses = user.courses;
      // console.log(courses);

      const enrolled_courses = await CourseModel.find({
        _id: { $in: courses },
      });

      // console.log(enrolled_courses);

      return enrolled_courses;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
  async createPremiumOrder(
    userId: string,
    payment_info: object
  ): Promise<object | boolean | null> {
    try {
      // console.log("userId:", userId);

      // console.log("paymentInfo:", payment_info);
      const user = await userModel.findById(userId);

      if (user?.premiumAccount) {
        return null;
      }

      const data = {
        userId,
        payment_info,
      };

      const newOrder = await PremiumOrderModel.create(data);

      // console.log(newOrder);

      if (user) {
        user.premiumAccount = true;
        const updatedUser = await user.save()!;

        redis.set(`user-${user?.email}`, JSON.stringify(updatedUser) as any);
      }

      await NotificationModel.create({
        userId: user?._id,
        title: "New Premium Order",
        message: `You hava a new order from ${user?.name}`,
      });

      return { newOrder, user };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addCourseProgres(
    userId: string,
    courseId: string,
    contentId: string
  ): Promise<boolean | User | null> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return false;
      }
      if (user.courseProgress.length === 0) {
        return false;
      }
      const course = user.courseProgress.find(
        (progress) => progress.courseId === courseId
      );
      if (!course) {
        return false;
      }
      if (course.sectionId.includes(contentId)) {
        return null;
      }
      course.sectionId.push(contentId);

      await user.save();

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

}

export default userRepository;
