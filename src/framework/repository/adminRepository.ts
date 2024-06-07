import { Document } from "mongoose";
import Category from "../../entities/Categories";
import Admin from "../../entities/adminEntity";
import Tutor from "../../entities/tutorEntity";
import User from "../../entities/userEntity";
import IAdminRepository from "../../usecase/interface/IAdminRepository";
import CategoryModel from "../database/CategoryModel";
import adminModel from "../database/adminModel";
import tutorModel from "../database/tutorModel";
import userModel from "../database/userModel";
import CourseModel from "../database/CourseModel";
import Course from "../../entities/course";
import NotificationModel, {
  INotification,
} from "../database/notificationModel";
import OrderModel from "../database/orderModel";
import PremiumAccount from "../../entities/premiumAccount";
import PremiumAccountModel from "../database/PremiumAccountSchema";
import cloudinary from "../config/cloudinary";
import { redis } from "../config/redis";
import JwtTokenService from "../services/JwtToken";

class adminRepositoty implements IAdminRepository {
  JwtToken = new JwtTokenService();

  async findByEmail(email: string): Promise<Admin | null> {
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      if (!admin) {
        return null;
      }
      return admin;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async registerAdmin(adminData: Admin): Promise<Admin | null> {
    try {
      const { name, email, gender, password } = adminData;
      const admin = await adminModel.create({
        name,
        email,
        gender,
        password,
        isVerified: true,
      });
      return admin;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async loginAdmin(
    admin: Admin,
    email: string,
    password: string
  ): Promise<string | null> {
    try {
      const isPasswordMatch = await admin.comparePassword(password);
      if (!isPasswordMatch) {
        return null;
      } else {
        const token = await this.JwtToken.AdminSignJwt(admin);
        redis.set(admin.email, JSON.stringify(admin) as any);
        return token;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getUsers(): Promise<Admin[] | null> {
    try {
      const users = await userModel.find({});
      if (!users) {
        return null;
      }
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async addUser(userData: User): Promise<User | null> {
    try {
      const { name, email, gender, password } = userData;
      const isEmailExists = await userModel.findOne({ email });
      if (isEmailExists) {
        return null;
      }
      const newUser = userModel.create({
        name,
        email,
        gender,
        password,
      });
      if (!newUser) {
        return null;
      }
      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async editUser(userData: User): Promise<User | null> {
    try {
      const { _id, name, email, gender } = userData;
      // console.log(name, email, gender);

      let user = await userModel.findOne({ _id });
      if (!user) {
        return null;
      }
      user.name = name;
      user.email = email;
      user.gender = gender;
      user = await user.save();

      // console.log("newUser :", user);

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async blockUser(_id: string): Promise<User | null> {
    try {
      let user = await userModel.findOne({ _id });
      if (!user) {
        return null;
      }
      user.isBlocked = true;
      user = await user.save();

      // console.log("newUser :", user);

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async unBlockUser(_id: string): Promise<User | null> {
    try {
      let user = await userModel.findOne({ _id });
      if (!user) {
        return null;
      }
      user.isBlocked = false;
      user = await user.save();

      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getTutors(): Promise<Tutor[] | null> {
    try {
      const tutors = await tutorModel.find({});
      if (!tutors) {
        return null;
      }
      return tutors;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async verifyTutor(_id: string): Promise<Tutor | null> {
    try {
      let tutor = await tutorModel.findOne({ _id });
      if (!tutor) {
        return null;
      }
      tutor.isVerified = true;
      tutor = await tutor.save();

      // console.log("newUser :", user);

      return tutor;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async refuteTutor(_id: string): Promise<Tutor | null> {
    try {
      let tutor = await tutorModel.findOne({ _id });
      if (!tutor) {
        return null;
      }
      tutor.isVerified = false;
      tutor = await tutor.save();

      // console.log("newUser :", user);

      return tutor;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async editTutor(tutorData: Tutor): Promise<Tutor | null> {
    try {
      const { _id, name, email, institute, qualifiaction, experience } =
        tutorData;
      // console.log(name, email, gender);

      let tutor = await tutorModel.findOne({ _id });
      if (!tutor) {
        return null;
      }
      tutor.name = name;
      tutor.email = email;
      tutor.institute = institute;
      tutor.qualifiaction = qualifiaction;
      tutor.experience = experience;
      tutor = await tutor.save();

      // console.log("newUser :", user);

      return tutor;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async createCategory(
    categoryData: Category
  ): Promise<Category | null | boolean> {
    try {
      const isExist = await CategoryModel.find({
        name: { $regex: new RegExp(categoryData.name.toString(), "i") },
      });

      // console.log("isExist:", isExist);
      if (isExist.length !== 0) {
        return false;
      }
      const newCategory = await CategoryModel.create(categoryData);
      // console.log("newCategory:", newCategory);

      if (!newCategory) {
        return null;
      }
      return newCategory;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async editCategory(
    categoryData: Category
  ): Promise<Category | null | boolean> {
    try {
      const { _id, name, description } = categoryData;
      const category = await CategoryModel.findById(_id);

      if (!category) {
        return false; // Category not found
      }

      // Update fields other than _id
      category.name = name;
      category.description = description;

      await category.save();

      return category; // Return the updated category
      return null;
    } catch (error) {
      console.log(error);
      return null; // Return null if an error occurs
    }
  }
  async deleteCategory(_id: string): Promise<boolean> {
    try {
      const result = await CategoryModel.deleteOne({ _id });
      if (result.deletedCount === 0) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
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
  async getApprovedCourses(): Promise<Document<any, any, Course>[] | null> {
    try {
      const courses = await CourseModel.find({ approved: true })
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
  async getNonApprovedCourses(): Promise<Document<any, any, Course>[] | null> {
    try {
      const courses = await CourseModel.find({ approved: false })
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
  async changeCourseStatus(
    status: string,
    courseId: string
  ): Promise<boolean | null> {
    try {
      const course = await CourseModel.findById(courseId);
      if (course) {
        if (status === "approve") {
          course.approved = true;
          await course.save();
          return true;
        } else if (status === "block") {
          course.approved = false;
          await course.save();
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }
  async getNotification(): Promise<boolean | INotification[] | null> {
    try {
      const notifications = await NotificationModel.find({
        status: "unread",
      }).sort({ createdAt: -1 });

      if (!notifications) {
        return null;
      }

      return notifications;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async changeNotificationStatus(
    id: string
  ): Promise<boolean | INotification | null> {
    try {
      const notification = await NotificationModel.findById(id);
      if (!notification) {
        return false;
      }
      notification.status = "read";
      await notification.save();
      return notification;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // async last12MonthsUserData(): Promise<boolean | any | null> {
  //   // console.log("call");

  //   const user = await userModel.find()
  //   console.log(user);

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

  //       const count = await userModel.countDocuments({
  //         createdAt: { $gte: startDate, $lt: endDate },
  //       });
  //       last12Months.push({ month: monthYear, count });
  //     }
  //     return last12Months;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // }
  // async last12MonthsCourseData(): Promise<any> {
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
  //       });
  //       last12Months.push({ month: monthYear, count });
  //     }
  //     return last12Months;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // }

  // async last12MonthsOrderData(): Promise<any> {
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

  //       const count = await OrderModel.countDocuments({
  //         createdAt: { $gte: startDate, $lt: endDate },
  //       });
  //       last12Months.push({ month: monthYear, count });
  //     }
  //     return last12Months;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // }

  async last12MonthsUserData(): Promise<boolean | any | null> {
    try {
      const last12Months: any[] = [];
      const currentDate = new Date();

      for (let i = 11; i >= 0; i--) {
        const endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i + 1,
          0
        );
        const startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1
        );

        const monthYear = startDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });

        const count = await userModel.countDocuments({
          createdAt: { $gte: startDate, $lt: endDate },
        });
        last12Months.push({ month: monthYear, count });
      }
      return last12Months;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async last12MonthsCourseData(): Promise<any> {
    try {
      const last12Months: any[] = [];
      const currentDate = new Date();

      for (let i = 11; i >= 0; i--) {
        // Calculate the start and end dates for the current month in the loop
        const startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1
        );
        const endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i + 1,
          0
        );

        // Format the month and year for display
        const monthYear = startDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });

        // Count the number of courses created between startDate and endDate
        const count = await CourseModel.countDocuments({
          createdAt: { $gte: startDate, $lt: endDate },
        });

        // Add the result to the last12Months array
        last12Months.push({ month: monthYear, count });
      }
      return last12Months;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async last12MonthsOrderData(): Promise<any> {
    try {
      const last12Months: any[] = [];
      const currentDate = new Date();

      for (let i = 11; i >= 0; i--) {
        // Calculate the start and end dates for the current month in the loop
        const startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1
        );
        const endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i + 1,
          0
        );

        // Format the month and year for display
        const monthYear = startDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });

        // Count the number of orders created between startDate and endDate
        const count = await OrderModel.countDocuments({
          createdAt: { $gte: startDate, $lt: endDate },
        });

        // Add the result to the last12Months array
        last12Months.push({ month: monthYear, count });
      }
      return last12Months;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addPremiumOffer(
    title: string,
    description: string,
    price: number
  ): Promise<boolean | PremiumAccount | null> {
    try {
      const premiumOffer = await PremiumAccountModel.create({
        title,
        description,
        price,
      });
      if (!premiumOffer) {
        return false;
      }
      return premiumOffer;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }
  async editPremiumOffer(
    _id: string,
    title: string,
    description: string,
    price: number
  ): Promise<boolean | PremiumAccount | null> {
    try {
      const premiumOffer = await PremiumAccountModel.findById(_id);
      if (!premiumOffer) {
        return false;
      }

      premiumOffer.title = title;
      premiumOffer.description = description;
      premiumOffer.price = price;

      await premiumOffer.save();

      return premiumOffer;
    } catch (error: any) {
      console.log(error);
      return false;
    }
  }
  async deletePremiumOffer(_id: string): Promise<boolean | null> {
    try {
      const premiumOffer = await PremiumAccountModel.findByIdAndDelete(_id);

      if (!premiumOffer) {
        return false;
      }

      return true;
    } catch (error: any) {
      console.log("Error deleting premium offer:", error);

      return false;
    }
  }
  async getPremiumOffers(): Promise<boolean | PremiumAccount[] | null> {
    try {
      const premiumOffers = await PremiumAccountModel.find();
      if (premiumOffers.length === 0) {
        return false;
      }
      return premiumOffers;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getOnePremiumOffer(
    _id: string
  ): Promise<boolean | PremiumAccount | null> {
    try {
      const premiumOffer = await PremiumAccountModel.findById(_id);
      if (!premiumOffer) {
        return false;
      }
      return premiumOffer;
    } catch (error) {
      console.log(error);
      return false;
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
  async updateAdminInfo(adminData: Admin): Promise<Admin | null> {
    try {
      const { _id, name, avatar } = adminData;

      const admin = await adminModel.findOne({ _id });
      if (!admin) {
        return null;
      }
      if (avatar && admin) {
        if (admin.avatar?.public_id) {
          await cloudinary.uploader.destroy(admin.avatar.public_id);
          const uploadRes = await cloudinary.uploader.upload(avatar, {
            upload_preset: "E_Learning",
            folder: "avatars",
          });
          admin.name = name || admin.name;
          admin.avatar = {
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id,
          };
        } else {
          const uploadRes = await cloudinary.uploader.upload(avatar, {
            upload_preset: "E_Learning",
            folder: "avatars",
          });
          admin.name = name || admin.name;
          admin.avatar = {
            url: uploadRes.secure_url,
            public_id: uploadRes.public_id,
          };
        }
      }
      if (!avatar && admin) {
        admin.name = name || admin.name;
      }

      await admin.save();

      return admin;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async updateAdminPassword(
    oldPassword: string,
    newPassword: string,
    email: string
  ): Promise<Admin | null> {
    try {
      const admin = await adminModel.findOne({ email }).select("+password");

      if (!admin) {
        return null;
      }
      const isOldPasswordMatch = await admin?.comparePassword(oldPassword);

      if (!isOldPasswordMatch) {
        return null;
      }
      admin.password = newPassword;
      await admin.save();
      redis.set(admin.email, JSON.stringify(admin) as any);

      return admin;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default adminRepositoty;
