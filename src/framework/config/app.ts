import express, { urlencoded, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routes/userRoutes";
import adminRouter from "../routes/adminRoutes";
import tutorRouter from "../routes/tutorRoutes";
import errorRouter from "../routes/errorRouter";
import errorHandler from "../middlewares/errorHandler";
require("dotenv").config();

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const createServer = () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
      cors({
        origin: process.env.ORIGIN,
        credentials: true,
      })
    );
    app.use("/api/v1", userRouter);
    app.use("/api/v1", adminRouter);
    app.use("/api/v1", tutorRouter);

    app.use("*",errorRouter)

    app.use(errorHandler);

    return app;
  } catch (error) {
    console.log("error");
  }
};
