import { Document } from "mongoose";
import Category from "../../entities/Categories";
import Admin from "../../entities/adminEntity";
import Course from "../../entities/course";
import Tutor from "../../entities/tutorEntity";
import User from "../../entities/userEntity";
import { INotification } from "../../framework/database/notificationModel";
import PremiumAccount from "../../entities/premiumAccount";

interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  registerAdmin(adminData: Admin): Promise<Admin | null>;
  getUsers(): Promise<Admin[] | null>;
  addUser(userData: User): Promise<User | null>;
  editUser(userData: User): Promise<User | null>;
  blockUser(_id: string): Promise<User | null>;
  unBlockUser(_id: string): Promise<User | null>;
  getTutors(): Promise<Tutor[] | null>;
  verifyTutor(_id: string): Promise<Tutor | null>;
  refuteTutor(_id: string): Promise<Tutor | null>;
  editTutor(tutorData: Tutor): Promise<Tutor | null>;
  createCategory(categoryData: Category): Promise<Category | null | boolean>;
  editCategory(categoryData: Category): Promise<Category | null | boolean>;
  deleteCategory(_id: string): Promise<boolean>;
  getCategories(): Promise<Category[] | null | boolean>;
  getApprovedCourses(): Promise<Document<any, any, Course>[] | null>;
  getNonApprovedCourses(): Promise<Document<any, any, Course>[] | null>;
  changeCourseStatus(status: string, courseId: string): Promise<boolean | null>;
  getNotification(): Promise<INotification[] | boolean | null>;
  changeNotificationStatus(id:string): Promise<INotification | boolean | null>;
  last12MonthsUserData(): Promise<any | boolean | null>;
  last12MonthsCourseData(): Promise<any | boolean | null>;
  last12MonthsOrderData(): Promise<any | boolean | null>;
  addPremiumOffer(title:string,description:string,price:number):Promise<PremiumAccount | boolean | null>;
  editPremiumOffer(_id:string,title:string,description:string,price:number):Promise<PremiumAccount | boolean | null>;
  deletePremiumOffer(_id:string):Promise< boolean | null>;
  getPremiumOffers():Promise<PremiumAccount[] | boolean | null>;
  getOnePremiumOffer(_id:string):Promise<PremiumAccount | boolean | null>;
  getSearchResult(searchKey: string): Promise<any[] | boolean | null>;
  getOneCourse(id: string): Promise<Course | null>;
}

export default IAdminRepository;
