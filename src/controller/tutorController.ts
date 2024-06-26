import { Request, Response, NextFunction } from "express";
import { redis } from "../framework/config/redis";
import tutorUseCase from "../usecase/tutorUseCase";

class tutorController {
  private tutorCase: tutorUseCase;

  constructor(tutorCase: tutorUseCase) {
    this.tutorCase = tutorCase;
  }

  async registerTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const tutorData = req.body;
      const newTutor = await this.tutorCase.registerTutor(tutorData);
      res.json(newTutor);
    } catch (error) {
      console.log(error);
    }
  }
  async loginTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const data = await this.tutorCase.loginTutor(email, password);
      // console.log("data :", data);

      if (data?.success) {
        res.cookie("tutor_token", data.token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        // res.cookie("tutor_token", data.token);

        res.status(201).json({ data });
      } else {
        res.json({ data });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "An error occurred",
      });
    }
  }

  async upadteTutorInfo(req: Request, res: Response, next: NextFunction) {
    const tutorData = req.body; 

    try {
      const tutor = await this.tutorCase.updateTutorInfo(tutorData);
      if (!tutor) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }
      res.status(201).json({ tutor });
    } catch (error) {
      console.log(error);
    }
  }

  async upadteTutorpassword(req: Request, res: Response, next: NextFunction) {
    
    
    try {
      const { oldPassword, newPassword, email } = req.body;
      const tutor = await this.tutorCase.upadteTutorpassword(
        oldPassword,
        newPassword,
        email
      );
      if (tutor && !tutor.success) {
        return res.json({
          success: false,
          status: 400,
          message: "Account updation unsuccessful. Please try again later.",
        });
      }

      res.status(200).json({ success: true, tutor });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }

  async logoutTutor(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.tutor?.email || "";
      console.log("tutor-email:", email);

      redis.del(`tutor-${email}`);
      res.cookie("tutor_token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1,
      });
      // res.cookie("tutor_token", "", { maxAge: 1 });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.log(error);
    }
  }
  async createCourse(req: Request, res: Response, next: NextFunction) {
    const tutor = req?.tutor;
    try {
      const { data } = req.body;
      if (tutor) {
        const courseStatus = await this.tutorCase.createCourse(data, tutor);
        if (courseStatus === null) {
          return res.status(500).json({
            success: false,
            messge: "Course creation unsuccessfull",
          });
        }
        return res.status(201).json({
          success: true,
          message: "Course added suucessfully",
          courseStatus,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async editCourse(req: Request, res: Response, next: NextFunction) {
    console.log("calling controller");

    try {
      const { data } = req.body;
      const courseStatus = await this.tutorCase.editCourse(data);
      if (courseStatus === null) {
        return res.status(500).json({
          success: false,
          messge: "Course creation unsuccessfull",
        });
      }
      return res.status(201).json({
        success: true,
        message: "Course added suucessfully",
        courseStatus,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.tutorCase.getCategories();
      if (categories === null) {
        return res.status(404).json({
          success: false,
          message: "No categories available",
        });
      }
      if (categories === false) {
        return res.status(500).json({
          success: false,
          message: "Internal server error, Please try again later",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Category deleted successfully!!",
        categories,
      });
    } catch (error) {}
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const courses = await this.tutorCase.getAllCourses(id);
      if (courses === null) {
        return res.json({
          success: false,
          message: "No courses found",
        });
      }
      res.json({ courses, success: true });
    } catch (error) {
      console.log(error);
    }
  }

  async getNonApporvedCourses(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const courses = await this.tutorCase.getNonApprovedCourses(id);
      if (courses === null) {
        return res.json({
          success: false,
          message: "No courses found",
        });
      }
      res.json({ courses, success: true });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.params;
      const result = await this.tutorCase.deleteCourse(_id);
      if (result === false) {
        return res.status(404).json({
          sucess: false,
          message: "delete operation failed",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Course Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        sucess: false,
        message: "internal server error!! please try again later",
      });
    }
  }
  async replyToQestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { answer, courseId, contentId, questionId } = req.body;
      const tutor = req.tutor;
      // console.log(tutor);

      const result = await this.tutorCase.replyToQuestion(
        tutor,
        answer,
        courseId,
        contentId,
        questionId
      );
      if (result === false) {
        return res.json({
          success: false,
          message: "Internal server error.Please try again later",
        });
      }
      return res.status(201).json({
        success: true,
        mesage: "Reply added successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        sucess: false,
        message: "internal server error!! please try again later",
      });
    }
  }

  async replyToReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { comment, courseId, reviewId } = req.body;
      const tutor = req.tutor;
      const result = await this.tutorCase.replyToReview(
        tutor,
        comment,
        courseId,
        reviewId
      );
      if (result === false) {
        return res.json({
          success: false,
          message: "Internal server error.Please try again later",
        });
      }
      return res.status(201).json({
        success: true,
        mesage: "Reply added successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        sucess: false,
        message: "internal server error!! please try again later",
      });
    }
  }

  async addSchedule(req: Request, res: Response, next: NextFunction) {
    const courseId = req.params.id;
    const { date, time, meetingCode, description } = req.body;

    try {
      const result = await this.tutorCase.addScehdule(
        courseId,
        date,
        time,
        meetingCode,
        description
      );
      if (result === null) {
        return res.json({
          success: false,
          message: "internal server error, please try again later",
        });
      }
      if (result === false) {
        return res.json({
          success: false,
          message: "Course not found",
        });
      }
      return res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getOneCourse(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const result = await this.tutorCase.getOneCourse(id);
      if (result === null) {
        return res.json({
          success: false,
          message: "internal server error, please try again later",
        });
      }

      return res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getStudents(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const result = await this.tutorCase.getStudents(id);
      if (result === null) {
        return res.json({
          success: false,
          message: "internal server error, please try again later",
        });
      }

      return res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getSearchResult(req: Request, res: Response, next: NextFunction) {
    const { searchKey } = req.body;
    try {
      const result = await this.tutorCase.getSearchResult(searchKey);
      if (result === null) {
        return res.json({
          success: false,
          message: "internal server error, please try again later",
        });
      }

      return res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getVieoCallCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const appID = process.env.ZEGOCLOUD_APP_ID;
      const serverSecret = process.env.ZEGOCLOUD_SERVER_SECRET;
      res.status(200).json({
        success: true,
        appID,
        serverSecret,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getLast12MonthsCourseData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.tutor?._id || "";
      const courses = await this.tutorCase.getLast12MonthsCourseData(id);
      if (courses === null) {
        return res.json({
          success: false,
          message: "No data found",
        });
      }
      return res.json({
        success: true,
        message: "course analytics found successfully",
        courses,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getLast12MonthsOrderData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tutorId = req.tutor?._id || "";
      const orders = await this.tutorCase.getLast12MonthsOrderData(tutorId);
      if (orders === null) {
        return res.json({
          success: false,
          message: "No data found",
        });
      }
      return res.json({
        success: true,
        message: "orders analytics found successfully",
        orders,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getLast12MonthsUserData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tutorId = req.tutor?._id || "";
      const users = await this.tutorCase.getLast12MonthsUserData(tutorId);
      if (users === null) {
        return res.json({
          success: false,
          message: "No data found",
        });
      }
      return res.json({
        success: true,
        message: "users analytics found successfully",
        users,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default tutorController;
