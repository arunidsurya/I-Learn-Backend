import { Request, Response, NextFunction } from "express";
import userUserCase from "../usecase/UserUserCase";
import { redis } from "../framework/config/redis";
import userModel from "../framework/database/userModel";
import Order from "../entities/oder";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class userController {
  private userCase: userUserCase;

  constructor(userCase: userUserCase) {
    this.userCase = userCase;
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      //   console.log(userData);
      const user = await this.userCase.registrationUser(userData);
      res.json({ user, success: true });
    } catch (error) {
      console.log(error);
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const activationCode = req.body.activation_code;
      const activationToken = req.body.activation_token;
      //   console.log(userData);
      const user = await this.userCase.activateUser(
        activationCode,
        activationToken
      );

      res.status(201).json({
        user,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const data = await this.userCase.loginUser(email, password);
      // console.log("data :", data);

      if (data?.success) {
        res.cookie("access_token", data.access_token);
        res.cookie("refresh_token", data.refresh_token);
        // console.log("access_token:", data.access_token);
        // console.log("refresh_Token", data.refreshToken);

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
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const email = req.user?.email || "";
      redis.del(`user-${email}`);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.log(error);
    }
  }
  async forgotPasswordOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      // console.log(email);
      const result = await this.userCase.forgotPasswordOtp(email);
      res.status(201).json(result);
    } catch (error: any) {
      console.log(error);
    }
  }
  async forgotPasswordApproval(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const activationCode = req.body.activation_code;
      const activationToken = req.body.activation_token;
      //   console.log(userData);
      const result = await this.userCase.forgotPasswordApproval(
        activationCode,
        activationToken
      );
      // console.log(result);

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
  async forgotPasswordConfirm(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, newPassword } = req.body;
      const result = await this.userCase.forgotPasswordConfirm(
        email,
        newPassword
      );
      res.status(201).json(result);
    } catch (error) {
      console.log(error);
    }
  }
  async upadteUserInfo(req: Request, res: Response, next: NextFunction) {
    const userData = req.body;

    try {
      const user = await this.userCase.updateUserInfo(userData);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }
      res.status(201).json({ user });
    } catch (error) {
      console.log(error);
    }
  }

  async upadteUserpassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldPassword, newPassword, email } = req.body;
      const user = await this.userCase.upadteUserpassword(
        oldPassword,
        newPassword,
        email
      );
      // console.log(user);
      if (user && !user.success) {
        return res.json({
          success: false,
          status: 400,
          message: "Account updation unsuccessful. Please try again later.",
        });
      }

      // Assuming update was successful, return a 200 status with the updated user data
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.log(error);
      // Handle other errors, if any
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, avatar } = req.body;

      const data = await this.userCase.googleAuth(name, email, avatar);

      if (data?.success) {
        res.cookie("access_token", data.access_token);
        res.cookie("refresh_token", data.refresh_token);

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
  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userCase.getAllCourses();
      if (result === null) {
        return res.json({
          success: false,
          message: "No courses found",
        });
      }
      res.json({ result, success: true });
    } catch (error) {
      console.log(error);
    }
  }
  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = req.params;
      const result = await this.userCase.getCourse(_id);
      if (result === null) {
        return res.json({
          success: false,
          message: "No courses found",
        });
      }
      res.json({ result, success: true });
    } catch (error) {
      console.log(error);
    }
  }
  async getCourseContent(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.user?.email;

      const { _id } = req.params;
      const result = await this.userCase.getCourseContent(_id);
      if (result === null) {
        return res.json({
          success: false,
          message: "No courses found",
        });
      }
      res.json({ result, success: true });
    } catch (error) {
      console.log(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, payment_info } = req.body as Order;

      const userId = req.user?._id;
      if (!userId) {
        return res.json({
          success: false,
          message: "Pleae Login to access this functionality",
        });
      }

      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );
          if (paymentIntent.status !== "succeeded") {
            return res.json({
              success: false,
              message: "Payment not authorized!",
            });
          }
        }
      }
      const result = await this.userCase.createOrder(
        userId,
        courseId,
        payment_info
      );

      if (result === null) {
        return res.json({
          success: false,
          message: "you have already Purchased this course ",
        });
      }
      if (result === false) {
        return res.json({
          success: false,
          message: "No course found !!",
        });
      }

      return res.status(201).json({
        success: true,
        message: "order created successfully",
        result,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendStripePulishKey(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }

  async newPayment(req: Request, res: Response, next: NextFunction) {
    try {
      // Create the payment intent with shipping information
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        metadata: {
          company: "E-Learning",
        },
        description: "Payment for E-Learning Course",
        // customer: customer.id, // Assign the created customer to the payment intent
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
  async addQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (user) {
        const { question, courseId, contentId } = req.body;

        const result = await this.userCase.addQuestion(
          user,
          question,
          courseId,
          contentId
        );
        if (result === false) {
          return res.json({
            success: false,
            message: "invalid content Id",
          });
        }
        return res.json({
          success: true,
          message: "Question added successfully",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async replyToQestion(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (user) {
        const { answer, courseId, contentId, questionId } = req.body;

        const result = await this.userCase.replyToQuestion(
          user,
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
      }
    } catch (error) {
      console.log(error);
    }
  }
  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { review, rating } = req.body;
      const courseId = req.params.id;

      const userEmail = req.user?.email || null;
      const userId = req.user?._id || "";
      const result = await this.userCase.addReview(
        userEmail,
        courseId,
        userId,
        review,
        rating
      );
      if (result === false) {
        return res.json({
          success: false,
          message: "Error submitting review!! please try agian later",
        });
      }
      if (result === null) {
        return res.json({
          success: false,
          message: "Review Already addded",
        });
      }
      return res.json({
        success: true,
        message: "Review added successfully",
        result,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async addChat(req: Request, res: Response, next: NextFunction) {
    const { userName, userId, message, courseId } = req.body;

    console.log(userName, userId, message, courseId);

    try {
      const result = await this.userCase.addChat(
        userName,
        userId,
        message,
        courseId
      );
      if (result === false) {
        return res.json({
          success: false,
          message: "Internal server error!!. Please try again later",
        });
      }
      return res.status(201).json({
        success: true,
        message: "chat saved successfully",
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getChat(req: Request, res: Response, next: NextFunction) {
    const courseId = req.params.id;

    try {
      const result = await this.userCase.getChat(courseId);
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

  async getEnrolledCourses(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id;

    try {
      const result = await this.userCase.getEnrolledCourses(userId);
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

  async createPremiumOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { payment_info } = req.body;

      // console.log(payment_info);

      const userId = req.user?._id;
      if (!userId) {
        return res.json({
          success: false,
          message: "Pleae Login to access this functionality",
        });
      }

      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );
          if (paymentIntent.status !== "succeeded") {
            console.log("not succeeded");

            return res.json({
              success: false,
              message: "Payment not authorized!",
            });
          }
        }
      }
      const result = await this.userCase.createPremiumOrder(
        userId,
        payment_info
      );

      if (result === null) {
        return res.json({
          success: false,
          message: "you have already Purchased this course ",
        });
      }
      if (result === false) {
        return res.json({
          success: false,
          message: "No course found !!",
        });
      }

      return res.status(201).json({
        success: true,
        message: "order created successfully",
        result,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addCourseProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, contentId } = req.body;
      const userId = req.user?._id || "";
      const result = await this.userCase.addCourseProgress(
        userId,
        courseId,
        contentId
      );
      if (result === false) {
        return res.json({
          success: false,
          message: "invalid content Id",
        });
      }
      return res.json({
        success: true,
        message: "Review added successfully",
        result,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getPremiumOffers(req: Request, res: Response, next: NextFunction) {
    const { _id } = req.params;
    const premiumOffers = await this.userCase.getPremiumOffers();
    if (premiumOffers === false) {
      return res.json({
        success: false,
        message: "no premium Offer found",
      });
    }
    return res.json({
      success: true,
      message: "premium offeres are received successfully",
      premiumOffers,
    });
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

  async getSearchResult(req: Request, res: Response, next: NextFunction) {
    const { searchKey } = req.body;
    try {
      const result = await this.userCase.getSearchResult(searchKey);
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

  async getCoursesByCategory(req: Request, res: Response, next: NextFunction) {
    const { category } = req.body;
    try {
      const result = await this.userCase.getCoursesByCategory(category);
      if (result === null) {
        return res.json({
          success: false,
          message: "No coureses found",
        });
      }
      if (result === false) {
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
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userCase.getCategories();
      if (result === null) {
        return res.json({
          success: false,
          message: "No categories found",
        });
      }
      if (result === false) {
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
}

export default userController;
