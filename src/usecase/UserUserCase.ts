import User from "../entities/userEntity";
import JwtTokenService from "../framework/services/JwtToken";
import sendMail from "../framework/services/SendMail";
import IUserRepository from "./interface/IUserRepository";

class userUserCase {
  private iUserRepository: IUserRepository;
  private sendEmail: sendMail;
  private JwtToken: JwtTokenService;

  constructor(
    iuserRepository: IUserRepository,
    sendEmail: sendMail,
    JwtToken: JwtTokenService
  ) {
    this.iUserRepository = iuserRepository;
    this.sendEmail = sendEmail;
    this.JwtToken = JwtToken;
  }

  async registrationUser(user: User) {
    try {
      const email = user.email;
      // console.log(email);
      const isEmailExist = await this.iUserRepository.findByEmail(email);
      if (isEmailExist) {
        return { success: false, message: "Email already exists" };
      }

      const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
      const activationTokenPromise = this.JwtToken.otpGenerateJwt(
        user,
        activationCode
      );
      const activationToken = await activationTokenPromise;
      // console.log(activationToken);
      // console.log(activationCode);

      const subject = "Please find the below otp to activate your account";

      const sendmail = this.sendEmail.sendMail({
        email,
        subject,
        activationCode,
      });
      if (sendMail) {
        return {
          status: 201,
          success: true,
          message: "Please check your email to activate your account",
          activationToken,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  async activateUser(activationCode: string, activationToken: string) {
    console.log("activationToken :", activationToken);
    console.log("activationCode :", activationCode);
    try {
      const newUser = await this.JwtToken.otpVerifyJwt(
        activationToken,
        activationCode
      );

      if (!newUser) {
        return {
          status: 500,
          success: false,
          message: "Token expired,Please register again",
        };
      }
      // console.log(newUser.user);
      const savedUser = await this.iUserRepository.createUser(newUser.user);
      // console.log("saveduser :", savedUser);
      if (!savedUser) {
        return {
          status: 500,
          success: false,
          message: "internal error, please try again later",
        };
      }

      return { savedUser, success: true };
    } catch (error) {
      console.log(error);
    }
  }
  async loginUser(email: string, password: string) {
    try {
      // console.log(email);
      const user = await this.iUserRepository.findByEmail(email);

      if (!user) {
        return {
          status: 500,
          success: false,
          message: "Invalid email or password!!",
        };
      } else if (user.isBlocked) {
        return {
          status: 500,
          success: false,
          message: "Account suspended!!, please contact Admin",
        };
      }
      const proToken = await this.iUserRepository.loginUser(
        user,
        email,
        password
      );

      if (!proToken) {
        return {
          status: 500,
          success: false,
          message: "Invalid email or password!!",
        };
      }
      const { access_token, refresh_token } = proToken;
      return { status: 201, success: true, user, access_token, refresh_token };
    } catch (error) {
      console.log(error);
    }
  }
  async forgotPasswordOtp(email: string) {
    const user = await this.iUserRepository.isLoggedEmail(email);
    if (!user) {
      return {
        status: 500,
        success: false,
        message: "Invalid email address!",
      };
    }
    // console.log("user :", user);

    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const activationTokenPromise = this.JwtToken.otpGenerateJwt(
      user,
      activationCode
    );
    const activationToken = await activationTokenPromise;
    // console.log(activationToken);
    // console.log(activationCode);

    const subject = "Please find the below otp to confirm your account";

    const sendmail = this.sendEmail.sendMail({
      email,
      subject,
      activationCode,
    });
    if (sendMail) {
      return {
        status: 201,
        success: true,
        message: "Please check your email to confirm your account",
        activationToken,
        email,
      };
    }
  }
  async forgotPasswordApproval(
    activationCode: string,
    activationToken: string
  ) {
    try {
      // console.log("code:", activationCode);
      // console.log("token:", activationToken);
      const newUser = await this.JwtToken.otpVerifyJwt(
        activationToken,
        activationCode
      );
      if (!newUser) {
        return {
          status: 500,
          success: false,
          message: "Token expired,Please register again",
        };
      }
      // console.log(newUser.user);
      return {
        status: 201,
        success: true,
        message: "otp verified successfully",
      };
    } catch (error) {
      console.log(error);
    }
  }
  async forgotPasswordConfirm(email: string, newPassword: string) {
    try {
      const user = await this.iUserRepository.forgotPasswordConfirm(
        email,
        newPassword
      );
      if (!user) {
        return {
          status: 500,
          success: false,
          message: "password change unsccessfull, please try agin later",
        };
      } else {
        return {
          status: 201,
          success: true,
          message:
            "password changed successfully, please proceed to login page",
          user,
        };
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  async updateUserInfo(userData: User) {
    try {
      const user = await this.iUserRepository.updateUserinfo(userData);
      // console.log(user);

      if (!user) {
        return {
          status: 500,
          success: false,
          message: "Account updation unsuccessfull, Please try again later",
          user,
        };
      }
      return {
        status: 201,
        success: true,
        message: "Account updated successfully",
        user,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async upadteUserpassword(
    oldPassword: string,
    newPassword: string,
    email: string
  ) {
    try {
      const user = await this.iUserRepository.updateUserPassword(
        oldPassword,
        newPassword,
        email
      );
      // console.log("user :", user);

      if (user === null) {
        return {
          status: 500,
          success: false,
          message: "Account updation unsuccessfull, Please try again later",
          user,
        };
      }
      return {
        status: 201,
        success: true,
        message: "Password updated successfully",
        user,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async googleAuth(name: string, email: string, avatar: string) {
    try {
      const isEmailExist = await this.iUserRepository.findByEmail(email);
      // console.log(isEmailExist);

      if (isEmailExist) {
        const proToken = await this.iUserRepository.googleLogin(isEmailExist);
        if (proToken) {
          const { access_token, refresh_token } = proToken;
          return {
            status: 201,
            success: true,
            user: isEmailExist,
            access_token,
            refresh_token,
          };
        }
      } else {
        const savedUserDetails = await this.iUserRepository.googleSignup(
          name,
          email,
          avatar
        );
        if (savedUserDetails) {
          return {
            status: 201,
            success: true,
            user: savedUserDetails.savedUser,
            access_token: savedUserDetails.access_token,
            refresh_toke: savedUserDetails.refresh_token,
          };
        } else {
          return {
            status: 500,
            success: false,
            message: "Login failed, Please try again later",
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getAllCourses() {
    try {
      const courses = await this.iUserRepository.getAllCourses();

      if (courses === null) {
        return null;
      } else {
        return {
          courses,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getCourse(_id: string) {
    try {
      const course = await this.iUserRepository.getCourse(_id);

      if (course === null) {
        return null;
      } else {
        return {
          course,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async getCourseContent(_id: string) {
    try {
      const course = await this.iUserRepository.getCourseContent(_id);

      if (course === null) {
        return null;
      } else {
        return {
          course,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
  async createOrder(userId: string, courseId: string, payment_info: object) {
    try {
      const result = this.iUserRepository.createOrder(
        userId,
        courseId,
        payment_info
      );
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async createPremiumOrder(userId: string, payment_info: object) {
    try {
      console.log("Reached here");

      const result = this.iUserRepository.createPremiumOrder(
        userId,
        payment_info
      );
      console.log(result);

      return result;
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
  ) {
    try {
      const result = await this.iUserRepository.addQuestion(
        user,
        question,
        courseId,
        contentId
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async replyToQuestion(
    user: any,
    answer: string,
    courseId: string,
    contentId: string,
    questionId: string
  ) {
    try {
      const result = await this.iUserRepository.replyToQuestion(
        user,
        answer,
        courseId,
        contentId,
        questionId
      );
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addReview(
    userEmail: any,
    courseId: string,
    userId: string,
    review: string,
    rating: number
  ) {
    try {
      const result = this.iUserRepository.addReview(
        userEmail,
        courseId,
        userId,
        review,
        rating
      );
      return result;
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
  ) {
    console.log("userName :", userName);
    console.log("userId :", userId);
    console.log("message :", message);
    console.log("courseId :", courseId);
    try {
      const result = this.iUserRepository.addChat(
        userName,
        userId,
        message,
        courseId
      );
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getChat(courseId: string) {
    try {
      const result = this.iUserRepository.getChat(courseId);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getEnrolledCourses(userId: string) {
    try {
      const result = this.iUserRepository.getErolledCourses(userId);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addCourseProgress(userId: string, courseId: string, contentId: string) {
    try {
      const result = await this.iUserRepository.addCourseProgres(
        userId,
        courseId,
        contentId
      );
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getPremiumOffers() {
    try {
      const premiumOffers = await this.iUserRepository.getPremiumOffers();
      return premiumOffers;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default userUserCase;
