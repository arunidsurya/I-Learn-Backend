import { Document } from "mongoose";
import User from "../../entities/userEntity";
import Course from "../../entities/course";
import Order from "../../entities/oder";
import PremiumAccount from "../../entities/premiumAccount";


interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  isLoggedEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User | null>;
  loginUser(
    user: User,
    email: string,
    password: string
  ): Promise<{ access_token: string; refresh_token: string } | null>;
  forgotPasswordConfirm(
    email: string,
    newPassword: string
  ): Promise<User | null>;
  updateUserinfo(userData: User): Promise<User | null>;
  updateUserPassword(
    oldPassword: string,
    newPassword: string,
    email: string
  ): Promise<User | null>;
  googleLogin(
    user: User
  ): Promise<{ access_token: string; refresh_token: string } | null>;
  googleSignup(
    name: string,
    email: string,
    avatar: string
  ): Promise<{
    savedUser: User;
    access_token: string;
    refresh_token: string;
  } | null>;
  getAllCourses(): Promise<Document<any, any, Course>[] | null>;
  getCourse(userId: string): Promise<Course | null>;
  getErolledCourses(_id: string): Promise<Course[] | null>;
  getCourseContent(_id: string): Promise<Course | null>;
  createOrder(
    userId: string,
    courseId: string,
    payment_info: object
  ): Promise<object | boolean | null>;
  createPremiumOrder(
    userId: string,
    payment_info: object
  ): Promise<object | boolean | null>;
  addQuestion(
    user: any,
    question: string,
    courseId: string,
    contentId: string
  ): Promise<boolean | null>;
  replyToQuestion(
    user: any,
    answer: string,
    courseId: string,
    contentId: string,
    questionId: string
  ): Promise<boolean | null>;
  addReview(
    userEmail: string,
    courseId: string,
    userId:string,
    review: string,
    rating: number
  ): Promise<Course | boolean | null>;
  addChat(
    userName: string,
    userId: string,
    message: string,
    courseId: string
  ): Promise<boolean | null>;
  getChat(courseId: string): Promise<Course | null>;
  addCourseProgres(userId:string,courseId:string,contentId:string):Promise<User | boolean | null>;
  getPremiumOffers():Promise<PremiumAccount[] | boolean | null>;
}

export default IUserRepository;
