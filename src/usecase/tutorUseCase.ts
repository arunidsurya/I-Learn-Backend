import Course from "../entities/course";
import Tutor from "../entities/tutorEntity";
import { redis } from "../framework/config/redis";
import JwtTokenService from "../framework/services/JwtToken";
import sendMail from "../framework/services/SendMail";
import ITutorRepository from "./interface/ITutorRepository";

class tutorUseCase {
  private iTutorRepository: ITutorRepository;
  private sendEmail: sendMail;
  private JwtToken: JwtTokenService;

  constructor(
    itutorRepository: ITutorRepository,
    sendEmail: sendMail,
    JwtToken: JwtTokenService
  ) {
    this.iTutorRepository = itutorRepository;
    this.sendEmail = sendEmail;
    this.JwtToken = JwtToken;
  }

  async registerTutor(tutorData: Tutor) {
    try {
      const { email } = tutorData;
      const existingTutor = await this.iTutorRepository.findByEmail(email);
      if (existingTutor) {
        return {
          status: 400,
          success: false,
          message: "Email already exists",
        };
      }
      const newTutor = await this.iTutorRepository.createTutor(tutorData);
      if (!newTutor) {
        return {
          status: 500,
          success: false,
          message: "internal server error, please try again later",
        };
      }
      return {
        status: 201,
        success: true,
        message: "Congratulations!! registration successfull",
        newTutor,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async loginTutor(email: string, password: string) {
    try {
      const tutor = await this.iTutorRepository.findByEmail(email);
      if (!tutor) {
        return {
          status: 400,
          success: false,
          message: "invalid credentials",
        };
      }
      if (!tutor.isVerified) {
        return {
          status: 400,
          success: false,
          message: "Account not verified.!! please contact admin",
        };
      }
      const token = await this.iTutorRepository.loginTutor(
        tutor,
        email,
        password
      );
      if (!token) {
        return {
          status: 400,
          success: false,
          message: "invalid credentials",
        };
      }
      return {
        status: 201,
        success: true,
        message: "successfully loggedIn",
        tutor,
        token,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async createCourse(data: Course) {
    try {
      const savedCourse = await this.iTutorRepository.createCourse(data);
      if (savedCourse) {
        return savedCourse;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async editCourse(data: Course) {
    try {
      const savedCourse = await this.iTutorRepository.editCourse(data);
      if (savedCourse) {
        return savedCourse;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getAllCourses(id: string) {
    try {
      const courses = await this.iTutorRepository.getAllCourses(id);

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
  async getNonApprovedCourses(id: string) {
    try {
      const courses = await this.iTutorRepository.getNonApprovedCourses(id);

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
  async getCategories() {
    try {
      const categories = await this.iTutorRepository.getCategories();
      return categories;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async deleteCourse(_id: string) {
    try {
      const result = await this.iTutorRepository.deleteCourse(_id);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async replyToQuestion(
    tutor: any,
    answer: string,
    courseId: string,
    contentId: string,
    questionId: string
  ) {
    try {
      const result = await this.iTutorRepository.replyToQuestion(
        tutor,
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

  async replyToReview(
    tutor: any,
    comment: string,
    courseId: string,
    reviewId: string
  ) {
    try {
      const result = await this.iTutorRepository.replyToReview(
        tutor,
        comment,
        courseId,
        reviewId
      );
      return result;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async addScehdule(
    couresId: string,
    date: string,
    time: string,
    meetingCode: string,
    description: string
  ) {
    try {
      const result = await this.iTutorRepository.addSchedule(
        couresId,
        date,
        time,
        meetingCode,
        description
      );
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getOneCourse(id: string) {
    try {
      const result = await this.iTutorRepository.getOneCourse(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async getStudents(tutorId: string) {
    try {
      const result = await this.iTutorRepository.getStudents(tutorId);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getSearchResult(searchKey:string){
    try {
      const result = await this.iTutorRepository.getSearchResult(searchKey);
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export default tutorUseCase;
