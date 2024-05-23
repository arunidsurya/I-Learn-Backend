import Category from "../entities/Categories";
import Admin from "../entities/adminEntity";
import Tutor from "../entities/tutorEntity";
import User from "../entities/userEntity";
import { redis } from "../framework/config/redis";
import JwtTokenService from "../framework/services/JwtToken";
import sendMail from "../framework/services/SendMail";
import IAdminRepository from "./interface/IAdminRepository";

class adminUseCase {
  private iAdminRepository: IAdminRepository;
  private sendEmail: sendMail;
  private JwtToken: JwtTokenService;

  constructor(
    iAdminRepository: IAdminRepository,
    sendEmail: sendMail,
    JwtToken: JwtTokenService
  ) {
    this.iAdminRepository = iAdminRepository;
    this.sendEmail = sendEmail;
    this.JwtToken = JwtToken;
  }

  async loginAdmin(email: string, password: string) {
    try {
      const admin = await this.iAdminRepository.findByEmail(email);
      if (!admin) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }
      const isPasswordMatch = await admin.comparePassword(password);
      if (!isPasswordMatch) {
        return {
          success: false,
          message: "Entered password is wrong",
        };
      }
      const token = await this.JwtToken.AdminSignJwt(admin);
      if (!token) {
        return {
          success: false,
          message: "Internal server error, please try again later",
        };
      }
      redis.set(admin.email, JSON.stringify(admin) as any);
      return { status: 201, success: true, admin, token };
    } catch (error) {
      console.log(error);
    }
  }
  async adminRegister(adminData: Admin) {
    try {
      const { name, email, gender, password } = adminData;
      const isEmailExist = await this.iAdminRepository.findByEmail(email);
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
    } catch (error) {}
  }

  async getUsers() {
    try {
      const users = await this.iAdminRepository.getUsers();
      if (!users) {
        return false;
      }
      return users;
    } catch (error) {
      console.log(error);
    }
  }
  async addUser(userData: User) {
    try {
      const newUser = await this.iAdminRepository.addUser(userData);
      if (!newUser) {
        return false;
      }
      return newUser;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async editUser(userData: User) {
    try {
      const newUser = await this.iAdminRepository.editUser(userData);
      if (!newUser) {
        return false;
      }
      // console.log("newUser :", newUser);

      return newUser;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async blockUser(_id: string) {
    try {
      const newUser = await this.iAdminRepository.blockUser(_id);
      if (!newUser) {
        return false;
      }
      // console.log("newUser :", newUser);

      return newUser;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async unBlockUser(_id: string) {
    try {
      const newUser = await this.iAdminRepository.unBlockUser(_id);
      if (!newUser) {
        return false;
      }
      return newUser;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getTutors() {
    try {
      const tutors = await this.iAdminRepository.getTutors();
      if (!tutors) {
        return false;
      }
      return tutors;
    } catch (error) {
      console.log(error);
    }
  }
  async verifyTutor(_id: string) {
    try {
      const newTutor = await this.iAdminRepository.verifyTutor(_id);
      if (!newTutor) {
        return false;
      }
      return newTutor;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async refuteTutor(_id: string) {
    try {
      const newTutor = await this.iAdminRepository.refuteTutor(_id);
      if (!newTutor) {
        return false;
      }
      return newTutor;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async editTutor(tutorData: Tutor) {
    try {
      const newTutor = await this.iAdminRepository.editTutor(tutorData);
      if (!newTutor) {
        return false;
      }
      // console.log("newUser :", newUser);

      return newTutor;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async createCategory(categoryData: Category) {
    try {
      const result = await this.iAdminRepository.createCategory(categoryData);
      if (result === false) {
        return false;
      }
      if (result === null) {
        return result;
      }
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async editCategory(categoryData: Category) {
    try {
      const result = await this.iAdminRepository.editCategory(categoryData);
      if (result === false) {
        return false;
      }
      if (result === null) {
        return result;
      }
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async deleteCategory(_id: string) {
    try {
      const result = await this.iAdminRepository.deleteCategory(_id);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getCategories() {
    try {
      const categories = await this.iAdminRepository.getCategories();
      return categories;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getApprovedCourses() {
    try {
      const result = await this.iAdminRepository.getApprovedCourses();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getNonApprovedCourses() {
    try {
      const result = await this.iAdminRepository.getNonApprovedCourses();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async changeCourseStatus(status: string, courseId: string) {
    try {
      const result = await this.iAdminRepository.changeCourseStatus(
        status,
        courseId
      );
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getNotification() {
    try {
      const data = await this.iAdminRepository.getNotification();
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getLast12MonthsUserData() {
    try {
      const result = await this.iAdminRepository.last12MonthsUserData();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getLast12MonthsCourseData() {
    try {
      const result = await this.iAdminRepository.last12MonthsCourseData();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getLast12MonthsOrderData() {
    try {
      const result = await this.iAdminRepository.last12MonthsOrderData();
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async changeNotificationStatus(id: string) {
    try {
      const notification = await this.iAdminRepository.changeNotificationStatus(
        id
      );
      return notification;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addPremiumOffer(title: string, description: string, price: number) {
    try {
      const premiumOffer = await this.iAdminRepository.addPremiumOffer(
        title,
        description,
        price
      );
      return premiumOffer;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async editPremiumOffer(
    _id: string,
    title: string,
    description: string,
    price: number
  ) {
    try {
      const premiumOffer = await this.iAdminRepository.editPremiumOffer(
        _id,
        title,
        description,
        price
      );
      return premiumOffer;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async deletePremiumOffer(_id: string) {
    try {
      const result = await this.iAdminRepository.deletePremiumOffer(_id);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getOnePremiumOffer(_id: string) {
    try {
      const premiumOffer = await this.iAdminRepository.getOnePremiumOffer(_id);
      return premiumOffer;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getPremiumOffers() {
    try {
      const premiumOffers = await this.iAdminRepository.getPremiumOffers();
      return premiumOffers;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async getSearchResult(searchKey: string) {
    try {
      const result = await this.iAdminRepository.getSearchResult(searchKey);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getOneCourse(id: string) {
    try {
      const result = await this.iAdminRepository.getOneCourse(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default adminUseCase;
